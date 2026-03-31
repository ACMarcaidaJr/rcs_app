
import { NextRequest, NextResponse } from 'next/server';
import { fetchFromDataverse } from '@/lib/fetchFromDataverse';
import { handleApiError } from '@/lib/api-error';
import { getUniqueNameFromCookie } from '@/lib/get-user-unique-name-from-cookie';
import { getDataverseAccessToken } from '@/lib/getDataverseToken';
import { prefixKeysWithCrc9f } from '@/lib/prefixKey';
import { uploadFileToDataverse } from '@/lib/upload-file-dataverse';
import { stripPrefixFromKeys } from '@/lib/strip-prefix-from-keys';

export async function GET(req: NextRequest) {
    try {
        const user_account = getUniqueNameFromCookie(req)

        // get the user's role
        const userrole = await fetchFromDataverse({
            table: `${process.env.USER_ROLE_TABLE}`,
            query: `$filter=crc9f_user_name eq '${user_account?.email}'`
        })
        // get the role's info / guid
        const role_id = userrole?.value[0]?.crc9f_role_id;
        const roleinfo = await fetchFromDataverse({
            table: `${process.env.ROLE_TABLE}`,
            query: `$filter=crc9f_role_id eq '${role_id}'`
        })
        // using role guid, get the announcement.
        const roleguid = roleinfo?.value[0]?.crc9f_rcs_roleid;
        const data = await fetchFromDataverse({
            table: `${process.env.NAP_FORM_ONE_COMPLIANCE_NOTICE}`,
            query: `$filter=_crc9f_role_id_value eq ${roleguid} and crc9f_is_active eq ${1} and crc9f_type eq 'inventory'`

        })


        // USERS SEE WHO HAS THE SAME OFFICE,
        // USER CAN SEE THE DOCS, CAN COLLABORATE
        // USER CAN SHARE DOCS TO SAME DOCS
        // THE UI SHOULD HAVE COLLABORATION LOOK
        // WITH THE SAME OFFICES, THEY CAN SEE WHO ARE WITH THEM
        //

        // UPON LOGGING IN, 
        // USERS CAN FILL UP AND SELECT OFFICE THAT WERE CREATED BY THE ADMIN/RECORDS SECTION
        



        // check if the user is already complied with the notice.
        // by office_id, announcement_notice_id, 

        // const submitted_nap = await fetchFromDataverse({
        //     table: `${process.env.SUBMITTED_NAP_FORM_ONE_TABLE}`,
        //     query: `$filter=announcement_notice_id eq ${}`
        // })
        const response = NextResponse.json({
            success: true,
            data: stripPrefixFromKeys(data?.value),
            message_title: 'Success',
            message: 'Successfully fetch the announcement',
        });
        return response;
    } catch (error) {
        return handleApiError(error, req, 'Oops', 'Sorry, something went wrong');
    }
}