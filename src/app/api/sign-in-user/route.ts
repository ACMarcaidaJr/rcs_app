import { NextRequest, NextResponse } from 'next/server';
import { fetchFromDataverse } from '@/lib/fetchFromDataverse';
import { handleApiError } from '@/lib/api-error';
import { prefixKeysWithCrc9f } from '@/lib/prefixKey';

export async function POST(req: NextRequest) {
    try {
        const req_body = await req.json();

        const user_name = req_body?.user_name


        // check if user is already exist in the table
        const user_data = await fetchFromDataverse({
            table: `${process.env.USER_TABLE}`,
            query: `$filter=crc9f_user_name eq '${user_name}'`
        });

        // if user is not exist in the table then execute
        if (!user_data?.value[0]?.crc9f_user_id) {
            await fetchFromDataverse({
                table: `${process.env.USER_TABLE}`,
                method: 'POST',
                body: prefixKeysWithCrc9f(req_body)
            })
        }
        // get the user_role
        const user_role_data = await fetchFromDataverse({
            table: `${process.env.USER_ROLE_TABLE}`,
            query: `$filter=crc9f_user_name eq '${user_name}'`

        })
        // get all module_ids from module_role table that equal to the role_id
        const role_id = user_role_data?.value[0]?.crc9f_role_id
        let response = {}
        // IF ROLE THEN FETCH FROM MODULE_ROLES AND ROLES
        if (role_id) {
            const module_role_data = await fetchFromDataverse({
                table: `${process.env.MODULE_ROLE_TABLE}`,
                query: `$filter=crc9f_role_id eq '${role_id}'`

            })

            // // get all modules from module table
            // const module_id = module_role_data?.value[0]?.crc9f_module_id
            // console.log('module_id', module_id)
            // const module_data = await fetchFromDataverse({
            //     table: `${process.env.MODULE_TABLE}`,
            //     query: `$filter=crc9f_mod    ule_id eq '${module_id}'`

            // })
            const module_ids = module_role_data?.value.map((item: any) => item.crc9f_module_id).filter(Boolean);

            const moduleFilter = module_ids.map((id: string) => `crc9f_module_id eq '${id}'`).join(' or ');

            const module_data = await fetchFromDataverse({
                table: `${process.env.MODULE_TABLE}`,
                query: `$filter=${moduleFilter}&$select=crc9f_module_id,crc9f_is_active,crc9f_href, crc9f_label, crc9f_title, crc9f_icon`
            });

            const cleaned_modules = module_data?.value?.map((item: any) => ({
                icon: item.crc9f_icon,
                href: item.crc9f_href,
                label: item.crc9f_label,
                title: item.crc9f_title,
            })) || [];

            const response = NextResponse.json({
                success: true,
                modules: cleaned_modules,
                message: 'Successfully fetching Authorizing the user',
            });

            response.cookies.set('user_modules', JSON.stringify(cleaned_modules), {
                httpOnly: false,
                sameSite: 'lax',
                secure: true,
                path: '/',
                maxAge: 60 * 60 * 24 * 7,
            })
            return response
        }
        throw {
            success: false,
            code: 2,
            message: 'No User Role'
        };
        // console.log('module_role_data', module_role_data)
        // return NextResponse.json({ success: true, modules: extractModuleObjects(module_data) });
    } catch (error) {
        return handleApiError(error, req, 'Failed to post user to Dataverse');
    }
}
// crc9f_rcs_userid