import { NextRequest, NextResponse } from 'next/server';
import { fetchFromDataverse } from '@/lib/fetchFromDataverse';
import { handleApiError } from '@/lib/api-error';



export async function GET(req: NextRequest, { params }: { params: { file_id: string } }) {
    try {
        
        let fileData: string | null = null;
        const rcs_announcement_noticeid = await params.file_id
        console.log('rcs_announcement_noticeid$$$$$$$$$$$', rcs_announcement_noticeid)
        const fileBlob = await fetchFromDataverse({
            table: `${process.env.NAP_FORM_ONE_COMPLIANCE_NOTICE}(${rcs_announcement_noticeid})/crc9f_supporting_document/$value`,
            responseType: "blob",
        });
        const arrayBuffer = await fileBlob.arrayBuffer();
        const base64String = Buffer.from(arrayBuffer).toString("base64");
        fileData = base64String;
        return NextResponse.json({
            success: true,
            data: {
                file: fileData,
            },
            message_title: "Success",
            message: "Successfully fetched the notice file",
        });

    } catch (error) {
        return handleApiError(error, req, 'Oops', 'Sorry, something went wrong');
    }
}
