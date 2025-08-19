import { NextRequest, NextResponse } from 'next/server';
import { fetchFromDataverse } from '@/lib/fetchFromDataverse';
import { handleApiError } from '@/lib/api-error';
import { getUniqueNameFromCookie } from '@/lib/get-user-unique-name-from-cookie';
import { getDataverseAccessToken } from '@/lib/getDataverseToken';
import { prefixKeysWithCrc9f } from '@/lib/prefixKey';

export async function POST(req: NextRequest) {
    try {
        const user = getUniqueNameFromCookie(req);
        const user_name = user?.email;

        const formData = await req.formData();
        const remarks = formData.get('remarks')
        const signedFile = formData.get('signed_nap_form_one_file') as File;
        const office_id = formData.get('office_id');
        const nap_form_one_header_id = formData.get('nap_form_one_header_id');
        const rcs_nap_form_one_headerid = formData.get('rcs_nap_form_one_headerid');
        const rcs_announcement_notices_id = formData.get('rcs_announcement_notices_id')

        if (!signedFile) {
            throw new Error('No file provided.');
        }

        // Read file bytes
        const arrayBuffer = await signedFile.arrayBuffer();
        const fileBytes = new Uint8Array(arrayBuffer);
        const fileName = signedFile.name;

        if (fileBytes.length >= 134_217_728) { // 128 MB
            throw new Error('File too large for single-request upload. Use chunked upload instead.');
        }

        const access_token = await getDataverseAccessToken();

        // Step 1: Create the record first
        const metadata = {
            remarks: remarks,
            user_name: user_name,
            office_id: office_id,
            rcs_announcement_notices_id,
            nap_form_one_header_id: nap_form_one_header_id,
        };

        const created = await fetchFromDataverse({
            table: process.env.SUBMITTED_NAP_FORM_ONE_TABLE!,
            method: 'POST',
            body: prefixKeysWithCrc9f(metadata),
        });

        const recordId = created.crc9f_rcs_submitted_nap_form_oneid;
        console.log('metadata', metadata);

        const uploadUrl = `${process.env.NEXT_PUBLIC_DATAVERSE_URL}/${process.env.SUBMITTED_NAP_FORM_ONE_TABLE}(${recordId})/crc9f_signed_nap_form_one_file`;
        console.log('Uploading to:', uploadUrl);
        const uploadResponse = await fetch(uploadUrl, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${access_token}`,
                'OData-MaxVersion': '4.0',
                'OData-Version': '4.0',
                Accept: 'application/json',
                'Content-Type': 'application/octet-stream',
                'x-ms-file-name': fileName,
                'If-None-Match': 'null'
            },
            body: fileBytes
        });
        if (!uploadResponse.ok) {
            const errorText = await uploadResponse.text();
            throw new Error(`File upload failed: ${errorText}`);
        }
        const update_form_body = { status: 'submitted' };
        const update_form_status = await fetchFromDataverse({
            table: `${process.env.NAP_FORM_ONE_HEADERS_TABLE}(${rcs_nap_form_one_headerid})`,
            method: 'PATCH',
            body: prefixKeysWithCrc9f(update_form_body),
        });
        console.log('update_form_status', update_form_status)
        return NextResponse.json({
            success: true,
            message: 'Submit successfully',
        });

    } catch (error) {
        return handleApiError(error, req, 'Oops', 'Sorry, something went wrong');
    }
}
