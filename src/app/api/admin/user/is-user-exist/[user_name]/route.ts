import { NextRequest, NextResponse } from 'next/server';
import { fetchFromDataverse } from '@/lib/fetchFromDataverse';
import { handleApiError } from '@/lib/api-error';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ user_name: string }> }
) {
    try {
        const { user_name } = await params;
        console.log('user_name', user_name);
        const user_data = await fetchFromDataverse({
            table: `${process.env.USER_TABLE}`,
            query: `$filter=crc9f_user_name eq '${user_name}'`,
        });

        return NextResponse.json({
            success: true,
            data: user_data.value,
            message_title: 'This username already exists.',
            message: 'Username not available. Please choose another.',
        });
    } catch (error) {
        return handleApiError(error, req, 'Failed to get user to Dataverse');
    }
}