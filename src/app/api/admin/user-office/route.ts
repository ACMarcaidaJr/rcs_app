import { NextRequest, NextResponse } from 'next/server';
import { fetchFromDataverse } from '@/lib/fetchFromDataverse';
import { handleApiError } from '@/lib/api-error';
import { prefixKeysWithCrc9f } from '@/lib/prefixKey';
import { stripPrefixFromKeys } from '@/lib/strip-prefix-from-keys';

export async function POST(req: NextRequest) {
  try {
    const { rcs_officeid, rcs_userid, is_active } = await req.json();

    // ✅ STEP 1: Get ALL user_office records of this user
    const allRecords = await fetchFromDataverse({
      table: `${process.env.USER_OFFICE_TABLE}`,
      method: "GET",
      query: `?$select=crc9f_rcs_user_officeid&$filter=crc9f_user_id/crc9f_rcs_userid eq '${rcs_userid}'`,
    });

    // ✅ STEP 2: Deactivate all existing records
    await Promise.all(
      (allRecords.value || []).map((item: any) =>
        fetchFromDataverse({
          table: `${process.env.USER_OFFICE_TABLE}(${item.crc9f_rcs_user_officeid})`,
          method: "PATCH",
          body: {
            crc9f_is_active: 0,
          },
        })
      )
    );

    // ✅ STEP 3: Check if specific user-office already exists
    const record = await fetchFromDataverse({
      table: `${process.env.USER_OFFICE_TABLE}`,
      method: "GET",
      query: `?$filter=crc9f_user_id/crc9f_rcs_userid eq '${rcs_userid}' and crc9f_office_id/crc9f_rcs_officeid eq '${rcs_officeid}'`,
    });

    const existingId = record.value?.[0]?.crc9f_rcs_user_officeid;

    let data;

    if (!existingId) {
      data = await fetchFromDataverse({
        table: `${process.env.USER_OFFICE_TABLE}`,
        method: "POST",
        body: {
          crc9f_is_active: 1,
          "crc9f_user_id@odata.bind": `/${process.env.USER_TABLE}(${rcs_userid})`,
          "crc9f_office_id@odata.bind": `/${process.env.OFFICE_TABLE}(${rcs_officeid})`,
        },
      });
    } else {
      data = await fetchFromDataverse({
        table: `${process.env.USER_OFFICE_TABLE}(${existingId})`,
        method: "PATCH",
        body: {
          crc9f_is_active: is_active,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data,
      message_title: "Assign office",
      message: "Successfully assigned a new office",
    });
  } catch (error) {
    return handleApiError(error, req, "Failed to assign office");
  }
}