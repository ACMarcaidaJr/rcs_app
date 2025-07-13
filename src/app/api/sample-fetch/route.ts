// src/app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { fetchFromDataverse } from '@/lib/fetchFromDataverse';
import { handleApiError } from '@/lib/api-error';

export async function GET(req: NextRequest) {
    try {
        // const username = "Johnssssfinalfgfgf".replace(/'/g, "''");
        const samp_str = `Johnssssfinalfgfgf`;
        const username = samp_str.replace(/'/g, "''");
        const data = await fetchFromDataverse({
            table: `${process.env.USER_TABLE}`,
            query: `$filter=crc9f_user_name eq '${username}'`,
        });

        return NextResponse.json({ success: true, data });
    } catch (error) {
        return handleApiError(error, req, 'Failed to fetch user with condition');
    }
}
