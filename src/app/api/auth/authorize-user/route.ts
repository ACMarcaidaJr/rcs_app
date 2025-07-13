import { NextRequest, NextResponse } from 'next/server';
import { fetchFromDataverse } from '@/lib/fetchFromDataverse';
import { handleApiError } from '@/lib/api-error';

export async function GET(req: NextRequest) {
    try {
        const data = await fetchFromDataverse({
            table: 'crc9f_roles',
            method: 'POST',
            body: {
                crc9f_username: '',
                
            }
        })

    } catch (error) {
        return handleApiError(error, req, 'Failed to fetch user with condition');
    }
}