import { NextRequest, NextResponse } from 'next/server';
import { fetchFromDataverse } from '@/lib/fetchFromDataverse';
import { handleApiError } from '@/lib/api-error';

export async function GET(req: NextRequest) {
  try {
    const totalRoles = await fetchFromDataverse({
      table: `${process.env.ROLE_TABLE}/$count`,
      method: 'GET',
    });

    const activeRoles = await fetchFromDataverse({
      table: process.env.ROLE_TABLE!,
      method: 'GET',
      maxsize: 1,
      query: `?$filter=crc9f_is_active eq '1'&$count=true`,
    });
    const inactiveRoles = await fetchFromDataverse({
      table: process.env.ROLE_TABLE!,
      method: 'GET',
      maxsize: 1,
      query: `?$filter=crc9f_is_active eq '0'&$count=true`,
    });
    return NextResponse.json({
      success: true,
      totals: {
        total_roles: totalRoles,
        active_roles: activeRoles['@odata.count'] ?? 0,
        inactive_roles: inactiveRoles['@odata.count'] ?? 0,
      },
      message_title: 'Roles Summary',
      message: 'Successfully fetched roles summary',
    });

  } catch (error) {
    return handleApiError(error, req, 'Failed to fetch roles summary');
  }
}