import { NextRequest, NextResponse } from 'next/server';
import { fetchFromDataverse } from '@/lib/fetchFromDataverse';
import { handleApiError } from '@/lib/api-error';
import { prefixKeysWithCrc9f } from '@/lib/prefixKey';
import { stripPrefixFromKeys } from '@/lib/strip-prefix-from-keys';

export async function POST(req: NextRequest) {
    try {
        const { rcs_moduleid, rcs_roleid, is_active } = await req.json();
        console.log("rcs_moduleid, rcs_roleid, is_active", rcs_moduleid, rcs_roleid, is_active)
        const record = await fetchFromDataverse({
            table: `${process.env.MODULE_ROLE_TABLE}`,
            method: 'GET',
            query: `?$filter=crc9f_role_id/crc9f_rcs_roleid eq '${rcs_roleid}' and crc9f_module_id/crc9f_rcs_moduleid eq '${rcs_moduleid}'`
        });
        const module_role_rcs_moduleid = record.value?.[0]?.crc9f_rcs_module_roleid;
        console.log("module_role_rcs_moduleid>>>>", module_role_rcs_moduleid)
        let data;
        if (!module_role_rcs_moduleid) {
            const saved_data = await fetchFromDataverse({
                table: `${process.env.MODULE_ROLE_TABLE}`,
                method: 'POST',
                body: {
                    crc9f_is_active: is_active,
                    "crc9f_role_id@odata.bind": `/crc9f_rcs_roles(${rcs_roleid})`,
                    "crc9f_module_id@odata.bind": `/crc9f_rcs_modules(${rcs_moduleid})`
                }
            });
            data = saved_data
        } else {
            const saved_data = await fetchFromDataverse({
                table: `${process.env.MODULE_ROLE_TABLE}(${module_role_rcs_moduleid})`,
                method: 'PATCH',
                body: prefixKeysWithCrc9f({ is_active })
            });
            data = saved_data;
        }
        return NextResponse.json({
            success: true,
            data: data,
            message_title: 'Assign module',
            message: 'Successfully assigned a new module',
        })

    } catch (error) {
        return handleApiError(error, req, 'Failed to assign module');
    }
}

