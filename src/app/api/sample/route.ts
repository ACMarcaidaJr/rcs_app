// src/app/api/sample/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { fetchFromDataverse } from '@/lib/fetchFromDataverse';
import { handleApiError } from '@/lib/api-error';

export async function GET(req: NextRequest) {
  try {
    const data = await fetchFromDataverse({
      table: 'crc9f_users',
      method: 'POST',
      body: {
        crc9f_username: 'Johnssssfinalfgfgf',
        crc9f_name: 'john123',
      },
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return handleApiError(error, req, 'Failed to post user to Dataverse');
  }
}
