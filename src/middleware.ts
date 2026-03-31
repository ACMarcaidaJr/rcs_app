import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const { pathname } = req.nextUrl

  const isAuth = !!token
  const isLoginPage = pathname.startsWith("/login")

  if (!isAuth) {
    if (isLoginPage) return NextResponse.next()

    let from = pathname
    if (req.nextUrl.search) {
      from += req.nextUrl.search
    }

    return NextResponse.redirect(
      new URL(`/login?from=${encodeURIComponent(from)}`, req.url)
    )
  }

  const allowedRoutes = token.moduleLinks as {href: string}[] | undefined

  // Logged in but no permissions
  if (!allowedRoutes || allowedRoutes.length === 0) {
    return NextResponse.redirect(new URL("/no-role", req.url))
  }

  // Redirect logged-in user away from login page
  if (isLoginPage) {
    return NextResponse.redirect(
      new URL(allowedRoutes[0]?.href, req.url)
    )
  }

  // RBAC route check
  const isAllowed = allowedRoutes.some(route =>
    pathname === route.href || pathname.startsWith(route.href + "/")
  )

  if (!isAllowed) {
    return NextResponse.redirect(new URL("/unauthorized", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/pages/:path*", "/login", "/api:path*"],
}