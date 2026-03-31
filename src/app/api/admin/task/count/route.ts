import { NextRequest, NextResponse } from 'next/server';
import { fetchFromDataverse } from '@/lib/fetchFromDataverse';
import { handleApiError } from '@/lib/api-error';

export async function GET(req: NextRequest) {
    try {
        const total = await fetchFromDataverse({
            table: `${process.env.TASK_TABLE}/$count`,
            method: 'GET',
        });

        const active = await fetchFromDataverse({
            table: process.env.TASK_TABLE!,
            method: 'GET',
            maxsize: 1,
            query: `?$filter=crc9f_is_active eq 1&$count=true`,
        });
        const inactive = await fetchFromDataverse({
            table: process.env.TASK_TABLE!,
            method: 'GET',
            maxsize: 1,
            query: `?$filter=crc9f_is_active eq 0&$count=true`,
        });
        return NextResponse.json({
            success: true,
            totals: {
                total_tasks: total,
                active_tasks: active['@odata.count'] ?? 0,
                inactive_tasks: inactive['@odata.count'] ?? 0,
            },
            message_title: 'Tasks Summary',
            message: 'Successfully fetched tasks summary',
        });

    } catch (error) {
        return handleApiError(error, req, 'Failed to fetch roles summary');
    }
}