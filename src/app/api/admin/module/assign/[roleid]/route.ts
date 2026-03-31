
import { NextRequest, NextResponse } from 'next/server';
import { fetchFromDataverse } from '@/lib/fetchFromDataverse';
import { handleApiError } from '@/lib/api-error';
import { prefixKeysWithCrc9f } from '@/lib/prefixKey';
import { stripPrefixFromKeys } from '@/lib/strip-prefix-from-keys';


// MODULE_TABLE=crc9f_rcs_modules
// MODULE_ROLE_TABLE=crc9f_rcs_module_roles
export async function GET(req: NextRequest, { params }: { params: Promise<{ roleid: string }> }) {
    try {
        const { roleid } = await params;
        const data = await fetchFromDataverse({
            table: `${process.env.MODULE_TABLE}`,
            query: `?$select=crc9f_title,crc9f_description,crc9f_href,crc9f_icon,crc9f_is_sidelink,crc9f_is_active,createdon,crc9f_module_id,crc9f_rcs_moduleid&$filter=crc9f_is_active eq 1 &$expand=crc9f_rcs_module_role_module_id_crc9f_rcs_module($filter=crc9f_role_id/crc9f_rcs_roleid eq '${roleid}' and crc9f_is_active eq 1;$select=crc9f_rcs_module_roleid,crc9f_module_id, crc9f_role_id,crc9f_is_active)`
        });
        // rcs_module_role_module_id_crc9f_rcs_module -expander

        const cleaned_modules = stripPrefixFromKeys(data.value).map((module: any) => ({
            rcs_moduleid: module.rcs_moduleid,
            module_id: module.module_id,
            title: module.title,
            description: module.description,
            href: module.href,
            icon: module.icon,
            is_active: module.is_active,
            is_sidelink: module.is_sidelink,
            is_assigned: module.rcs_module_role_module_id_crc9f_rcs_module?.length ? true : false
        }));
        return NextResponse.json({
            success: true,
            data: cleaned_modules,
            message_title: 'Create a New Role',
            message: 'Successfully created a new role',
        })
    } catch (error) {
        return handleApiError(error, req, 'Failed to assign role');
    }
}