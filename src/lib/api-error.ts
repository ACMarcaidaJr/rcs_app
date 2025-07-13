
import { NextRequest, NextResponse } from 'next/server';

export function handleApiError(
    error: unknown,
    req: NextRequest,
    message?: string | '',
    status = 500
) {
    console.error(`❌ [${req.method}] ${req.nextUrl.pathname}:`, error);

    return NextResponse.json(
        {
            success: false,
            error: error,
            custom_message: message ,
        },
        { status }
    );
}
