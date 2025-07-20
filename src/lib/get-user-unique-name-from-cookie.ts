import { NextRequest } from "next/server";

export function getUniqueNameFromCookie(req: NextRequest): { email?: string; raw?: any } | null {
    const token = req.cookies.get('rcs_access_token')?.value;
    if (!token) return null;

    try {
        // JWT format: header.payload.signature
        const [, payloadBase64] = token.split('.');
        const payloadJson = Buffer.from(payloadBase64, 'base64').toString('utf-8');
        const decoded = JSON.parse(payloadJson);
        return {
            email: decoded?.unique_name ,
            raw: decoded,
        };
    } catch (err) {
        console.error('❌ Failed to decode JWT payload from rcs_access_token cookie:', err);
        return null;
    }
}
