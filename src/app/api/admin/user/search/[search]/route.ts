import { NextRequest, NextResponse } from 'next/server';
import { fetchFromDataverse } from '@/lib/fetchFromDataverse';
import { handleApiError } from '@/lib/api-error';
import { stripPrefixFromKeys } from '@/lib/strip-prefix-from-keys';

export async function GET(req: NextRequest,
    { params }: { params: Promise<{ search: string }> }
) {
    try {
        const { search } = await params;

        const safe = search.replace(/'/g, "''").trim();
        const terms = safe.split(/\s+/);

        const searchFilter = terms
            .map(
                (term) =>
                    `(contains(crc9f_given_name,'${term}')` +
                    ` or contains(crc9f_family_name,'${term}')` +
                    ` or contains(crc9f_user_name,'${term}'))`
            )
            .join(" and "); 

        const query =
            `?$select=crc9f_rcs_userid,crc9f_user_name,crc9f_given_name,crc9f_family_name` +
            `&$filter=${searchFilter} and crc9f_is_active eq 1` +
            `&$expand=crc9f_rcs_user_office_user_id_crc9f_rcs_user(` +
            `$select=crc9f_rcs_user_officeid,crc9f_office_id;` +
            `$filter=crc9f_is_active eq 1;` +
            `$expand=crc9f_office_id($select=crc9f_rcs_officeid,crc9f_name_of_office)` +
            `)`;

        // fetch users
        const data = await fetchFromDataverse({
            table: process.env.USER_TABLE!,
            method: 'GET',
            query: query,
        });


        return NextResponse.json({
            success: true,
            data: stripPrefixFromKeys(data.value),
            message_title: 'Users Summary',
            message: 'Successfully fetched users summary',
        });

    } catch (error) {
        return handleApiError(error, req, 'Failed to fetch users summary');
    }
}