
import { NextRequest, NextResponse } from 'next/server';
import { fetchFromDataverse } from '@/lib/fetchFromDataverse';
import { handleApiError } from '@/lib/api-error';
import { prefixKeysWithCrc9f } from '@/lib/prefixKey';
import { stripPrefixFromKeys } from '@/lib/strip-prefix-from-keys';



export async function GET(req: NextRequest, { params }: { params: Promise<{ userid: string }> }) {
    try {
        const { userid } = await params;
        const data = await fetchFromDataverse({
            table: `${process.env.ROLE_TABLE}`,
            query: `?$select=crc9f_role_name,crc9f_description,crc9f_is_active,createdon,crc9f_role_id,crc9f_rcs_roleid&$filter=crc9f_is_active eq '1'&$expand=crc9f_rcs_user_role_role_id_crc9f_rcs_role($filter=crc9f_user_id/crc9f_rcs_userid eq '${userid}' and crc9f_is_active eq 1;$select=crc9f_user_id, crc9f_role_id, crc9f_rcs_user_roleid, crc9f_is_active)`
        });
        const cleaned_roles = stripPrefixFromKeys(data.value).map((role: any) => ({
            role_id: role.role_id,
            role_name: role.role_name,
            description: role.description,
            is_active: role.is_active,
            createdon: role.createdon,
            rcs_roleid: role.rcs_roleid,
            is_assigned: role.rcs_user_role_role_id_crc9f_rcs_role?.length ? true : false
        }));
        return NextResponse.json({
            success: true,
            data: cleaned_roles,
            message_title: 'Create a New Role',
            message: 'Successfully created a new role',
        })
    } catch (error) {
        return handleApiError(error, req, 'Failed to assign role');
    }
}