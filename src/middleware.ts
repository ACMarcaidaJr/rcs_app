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

  // ✅ PUBLIC ROUTES (VERY IMPORTANT)
  const isPublic =
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname === "/no-role" ||
    pathname === "/unauthorized"

  if (isPublic) return NextResponse.next()

  // ❌ DO NOT PROTECT API ROUTES
  if (pathname.startsWith("/api")) {
    return NextResponse.next()
  }

  // 🔐 NOT AUTHENTICATED
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

  const allowedRoutes = token.flattedLinks as { href: string }[] | undefined

  // ❌ LOGGED IN BUT NO ROLES
  if (!allowedRoutes || allowedRoutes.length === 0) {
    return NextResponse.redirect(new URL("/no-role", req.url))
  }

  // 🔁 REDIRECT AWAY FROM LOGIN
  if (isLoginPage) {
    return NextResponse.redirect(
      new URL(allowedRoutes[0]?.href || "/", req.url)
    )
  }

  // ✅ NORMALIZE PATH (remove trailing slash)
  const cleanPath = pathname.replace(/\/$/, "")

  // 🔐 RBAC CHECK (IMPROVED)
  const isAllowed = allowedRoutes.some(route => {
    const base = route.href.replace(/\/$/, "")

    return (
      cleanPath === base ||
      cleanPath.startsWith(base + "/")
    )
  })

  if (!isAllowed) {
    return NextResponse.redirect(new URL("/unauthorized", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/pages/:path*", "/login"], // ✅ REMOVED /api
}