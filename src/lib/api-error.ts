
import { NextRequest, NextResponse } from 'next/server';

export function handleApiError(
    error: unknown,
    req: NextRequest,
    message_title?: string | '',
    message?: string | '',
    status = 500
) {
    console.error(`❌ [${req.method}] ${req.nextUrl.pathname}:`, error);

    return NextResponse.json(
        {
            success: false,
            error: error,
            message_title: '',
            message: message,
        },
        { status }
    );
}
