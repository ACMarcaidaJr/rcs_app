import { NextRequest, NextResponse } from 'next/server';
import { fetchFromDataverse } from '@/lib/fetchFromDataverse';
import { handleApiError } from '@/lib/api-error';

export async function GET(req: NextRequest) {
  try {
    const totalOffice = await fetchFromDataverse({
      table: `${process.env.OFFICE_TABLE}/$count`,
      method: 'GET',
    });

    const activeOffices = await fetchFromDataverse({
      table: process.env.OFFICE_TABLE!,
      method: 'GET',
      maxsize: 1,
      query: `?$filter=crc9f_is_active eq 1&$count=true`,
    });
    const inactiveOffices = await fetchFromDataverse({
      table: process.env.OFFICE_TABLE!,
      method: 'GET',
      maxsize: 1,
      query: `?$filter=crc9f_is_active eq 0&$count=true`,
    });
    return NextResponse.json({
      success: true,
      totals: {
        total_offices: totalOffice,
        active_offices: activeOffices['@odata.count'] ?? 0,
        inactive_offices: inactiveOffices['@odata.count'] ?? 0,
      },
      message_title: 'Offices Summary',
      message: 'Successfully fetched offices summary',
    });

  } catch (error) {
    return handleApiError(error, req, 'Failed to fetch roles summary');
  }
}