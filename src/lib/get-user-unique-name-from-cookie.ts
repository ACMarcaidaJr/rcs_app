import { NextRequest } from "next/server";

export function getUniqueNameFromCookie(
  req: NextRequest
): { email?: string; rcs_userid?: string; raw?: any } | null {
  const token = req.cookies.get("user_and_modules")?.value;
  // console.log("token", token);
  if (!token) return null;

  try {
    const decoded = JSON.parse(token); // it's plain JSON, not JWT
    // console.log("decoded===============================>>>>>", decoded);
    return {
      email: decoded?.user?.user_email,
      rcs_userid: decoded?.user?.rcs_userid,
      raw: decoded,
    };
  } catch (err) {
    console.error("❌Failed to parse JSON cookie:", err);
    return null;
  }
}
