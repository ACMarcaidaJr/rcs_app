import { NextRequest, NextResponse } from 'next/server';
import { fetchFromDataverse } from '@/lib/fetchFromDataverse';
import { handleApiError } from '@/lib/api-error';

export async function GET(req: NextRequest, { params }: { params: { file_id: string } }) {
    try {
        const { file_id } = await params;
        const fileBlob = await fetchFromDataverse({
            table: `${process.env.TASK_TABLE}(${file_id})/crc9f_supporting_document/$value`,
            responseType: "blob",
        });

        const arrayBuffer = await fileBlob.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Return raw file with headers
        return new NextResponse(buffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf', // Or dynamic based on your data
                'Content-Disposition': 'inline',   // 'inline' tells browser to preview, not download
            },
        });

    } catch (error) {
        return handleApiError(error, req, 'Oops', 'Sorry, something went wrong');
    }
}