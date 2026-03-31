import { NextRequest, NextResponse } from 'next/server';
import { fetchFromDataverse } from '@/lib/fetchFromDataverse';
import { handleApiError } from '@/lib/api-error';
import { prefixKeysWithCrc9f } from '@/lib/prefixKey';
import { stripPrefixFromKeys } from '@/lib/strip-prefix-from-keys';


export async function POST(req: NextRequest) {
    try {
        const { rcs_roleid, rcs_userid, is_active} = await req.json();
        const record = await fetchFromDataverse({
            table: `${process.env.USER_ROLE_TABLE}`,
            method: 'GET',
            query: `?$filter=crc9f_user_id/crc9f_rcs_userid eq '${rcs_userid}' and crc9f_role_id/crc9f_rcs_roleid eq '${rcs_roleid}'`
        });
        const user_role_rcs_roleid = record.value?.[0]?.crc9f_rcs_user_roleid;
        let data;
        if (!user_role_rcs_roleid) {
            const saved_data = await fetchFromDataverse({
                table: `${process.env.USER_ROLE_TABLE}`,
                method: 'POST',
                body: {
                    crc9f_is_active: is_active,
                    "crc9f_user_id@odata.bind": `/crc9f_rcs_users(${rcs_userid})`,
                    "crc9f_role_id@odata.bind": `/crc9f_rcs_roles(${rcs_roleid})`
                }
            });
            data = saved_data

        } else {
            const saved_data = await fetchFromDataverse({
                table: `${process.env.USER_ROLE_TABLE}(${user_role_rcs_roleid})`,
                method: 'PATCH',
                body: prefixKeysWithCrc9f({ is_active })
            });
            data = saved_data;
        }
        return NextResponse.json({
            success: true,
            data: data,
            message_title: 'Assign role',
            message: 'Successfully assigned a new role',
        })

    } catch (error) {
        return handleApiError(error, req, 'Failed to assign role');
    }
}

