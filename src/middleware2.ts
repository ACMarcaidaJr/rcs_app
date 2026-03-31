import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "./lib/api-error";

export async function middleware(req: NextRequest) {
    const url = req.nextUrl.clone();
    const path = url.pathname;
    // Only guard /page/* routes
    if (path.startsWith("/page/")) {
        const userModulesCookie = req.cookies.get("user_and_modules")?.value;
        if (!userModulesCookie) {
            url.pathname = "/";
            return NextResponse.redirect(url);
        }
        try {
            const user_and_modules_parsed = JSON.parse(decodeURIComponent(userModulesCookie));

            const allowedPaths: string[] = user_and_modules_parsed?.modules?.map((mod: any) => mod.href);

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
        const userModulesCookie = req.cookies.get("user_and_modules")?.value;
        if (userModulesCookie) {
            try {
                const user_and_modules_parsed = JSON.parse(decodeURIComponent(userModulesCookie));
                const allowedPaths: string[] = user_and_modules_parsed?.modules?.map((mod: any) => mod.href);
                if (allowedPaths?.length && path === "/") {
                    url.pathname = allowedPaths[0];
                    return NextResponse.redirect(url);
                }
            } catch (err) {
                handleApiError(err, req, "No User Role", "Please contact you Admin")
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
