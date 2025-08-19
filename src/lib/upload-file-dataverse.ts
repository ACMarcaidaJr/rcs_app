import { getDataverseAccessToken } from '@/lib/getDataverseToken';

interface UploadFileToDataverseParams {
    table: string;           // e.g. process.env.SUBMITTED_NAP_FORM_ONE_TABLE!
    recordId: string;        // GUID of the record
    column: string;          // The file column logical name (e.g., 'crc9f_signed_nap_form_one_file')
    file: File;              // File from formData
}

export async function uploadFileToDataverse({
    table,
    recordId,
    column,
    file
}: UploadFileToDataverseParams) {
    if (!file) throw new Error('No file provided.');

    const arrayBuffer = await file.arrayBuffer();
    const fileBytes = new Uint8Array(arrayBuffer);

    if (fileBytes.length >= 134_217_728) {
        throw new Error('File too large for single-request upload. Use chunked upload instead.');
    }

    const token = await getDataverseAccessToken();

    const uploadUrl = `${process.env.NEXT_PUBLIC_DATAVERSE_URL}/${table}(${recordId})/${column}`;
    const uploadResponse = await fetch(uploadUrl, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${token}`,
            'OData-MaxVersion': '4.0',
            'OData-Version': '4.0',
            Accept: 'application/json',
            'Content-Type': 'application/octet-stream',
            'x-ms-file-name': file.name,
            'If-None-Match': 'null'
        },
        body: fileBytes
    });

    if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        throw new Error(`File upload failed: ${errorText}`);
    }

    return true;
}
