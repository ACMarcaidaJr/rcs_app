import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "./lib/api-error";

export async function middleware(req: NextRequest) {
    const url = req.nextUrl.clone();
    const path = url.pathname;

    // Only guard /page/* routes
    if (path.startsWith("/page/")) {
        const userModulesCookie = req.cookies.get("user_modules")?.value;
        if (!userModulesCookie) {
            url.pathname = "/";
            return NextResponse.redirect(url);
        }
        try {
            const modules = JSON.parse(decodeURIComponent(userModulesCookie));
            const allowedPaths: string[] = modules.map((mod: any) => mod.href);

            const isAllowed = allowedPaths.some((allowedPath) =>
                path.startsWith(allowedPath)
            );

            if (!isAllowed) {
                url.pathname = allowedPaths[0] || "/";
                return NextResponse.redirect(url);
            }
        } catch (err) {
            console.error("Invalid user_modules cookie:", err);
            url.pathname = "/";
            return NextResponse.redirect(url);
        }
    }
    if (path === "/") {
        const userModulesCookie = req.cookies.get("user_modules")?.value;
        if (userModulesCookie) {
            try {
                const modules = JSON.parse(decodeURIComponent(userModulesCookie));
                const allowedPaths = modules.map((mod: any) => mod.href);
                if (allowedPaths?.length && path === "/") {
                    url.pathname = allowedPaths[0];
                    return NextResponse.redirect(url);
                }

            } catch (err) {
                handleApiError(err, req, "No User Role")
                // console.error("Invalid user_modules cookie:", err);
                // url.pathname = "/";
                // return NextResponse.redirect(url);
            }

        }


    }


    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/page/:path*", "/api/:path*"],
};









// import { NextRequest, NextResponse } from "next/server";
// import { jwtVerify, createRemoteJWKSet } from "jose";

// const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID!;

// const jwksUri = `https://login.microsoftonline.com/${TENANT_ID}/discovery/v2.0/keys`;
// const JWKS = createRemoteJWKSet(new URL(jwksUri));


// async function isTokenValid(token: string): Promise<boolean> {
//     try {
//         await jwtVerify(token, JWKS, {
//             issuer: `https://sts.windows.net/${TENANT_ID}/`,
//             audience: process.env.NEXT_PUBLIC_MIDDLEWARE_AUDIENCE,
//         });

//         return true;
//     } catch (error) {
//         return false;
//     }
// }

// export async function middleware(req: NextRequest) {
//     const token = req.cookies.get("rcs_access_token")?.value || "";
//     const user_modules = req.cookies.get("user_modules")?.value || "";
//     const url = req.nextUrl.clone();
//     const path = url.pathname;

//     const isAuthorized = token && (await isTokenValid(token));


//     if (path.startsWith("/api/")) {
//         if (!isAuthorized) {
//             return new NextResponse(
//                 JSON.stringify({ success: false, message: 'Unauthorized user' }),
//                 { status: 401, headers: { "Content-Type": "application/json" } }
//             );
//         }
//         return NextResponse.next();
//     }

//     // // Handle page routes
//     if (!isAuthorized && path.startsWith("/page/")) {
//         url.pathname = "/";
//         return NextResponse.redirect(url);
//     }

//     // if (isAuthorized && path === "/") {
//     //     url.pathname = "/page/dashboard";
//     //     return NextResponse.redirect(url);
//     // }

//     return NextResponse.next();
// }
// export const config = {
//     matcher: ["/", "/api/:path*", "/page/:path*"],
// };
