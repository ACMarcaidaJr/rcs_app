import { NextRequest, NextResponse } from 'next/server';
import { fetchFromDataverse } from '@/lib/fetchFromDataverse';
import { handleApiError } from '@/lib/api-error';

export async function GET(req: NextRequest) {
  try {
    const totalUsers = await fetchFromDataverse({
      table: `${process.env.USER_TABLE}/$count`,
      method: 'GET',
    });

    const activeUsers = await fetchFromDataverse({
      table: process.env.USER_TABLE!,
      method: 'GET',
      maxsize: 1,
      query: `?$filter=crc9f_is_active eq 1&$count=true`,
    });
    const inactiveUsers = await fetchFromDataverse({
      table: process.env.USER_TABLE!,
      method: 'GET',
      maxsize: 1,
      query: `?$filter=crc9f_is_active eq 0&$count=true`,
    });
    return NextResponse.json({
      success: true,
      totals: {
        total_users: totalUsers,
        active_users: activeUsers['@odata.count'] ?? 0,
        inactive_users: inactiveUsers['@odata.count'] ?? 0,
      },
      message_title: 'Users Summary',
      message: 'Successfully fetched users summary',
    });

  } catch (error) {
    return handleApiError(error, req, 'Failed to fetch users summary');
  }
}