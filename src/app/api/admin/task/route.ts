import { NextRequest, NextResponse } from 'next/server';
import { executeBatchMulti, BatchOperation } from '@/lib/dataverse-batch'; // Using your batch utility
import { prefixKeysWithCrc9f } from '@/lib/prefixKey';
import { handleApiError } from '@/lib/api-error';
import { fetchFromDataverse } from '@/lib/fetchFromDataverse';
import { stripPrefixFromKeys } from '@/lib/strip-prefix-from-keys';
import { uploadFileToDataverse } from '@/lib/upload-file-dataverse';
export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('supporting_document') as File;

        const metadata = prefixKeysWithCrc9f({
            task_title: formData.get('task_title'),
            task_description: formData.get('task_description'),
            deadline: formData.get('deadline'),
            is_active: 1,
            "role_id@odata.bind": `/${process.env.ROLE_TABLE}(${formData.get('rcs_roleid')})`
        });


        const createdTask = await fetchFromDataverse({
            table: process.env.TASK_TABLE!,
            method: 'POST',
            body: metadata,
        });
        console.log("createdTask", createdTask)
        const recordId = createdTask.id || createdTask.crc9f_rcs_taskid;

        if (!recordId) {
            throw new Error("Failed to retrieve ID for the created task.");
        }

        // 2. Upload the file to the newly created record
        if (file && file.size > 0) {
            await uploadFileToDataverse({
                table: process.env.TASK_TABLE!,
                recordId: recordId,
                column: 'crc9f_supporting_document',
                file: file
            });
        }

        return NextResponse.json({
            success: true,
            message_title: 'Success',
            message: 'Task created and document uploaded successfully.',
        });

    } catch (error: any) {
        console.error("Task Creation Error:", error);
        return handleApiError(error, req, 'Error', error.message || 'Submission failed');
    }
}

export async function GET(req: NextRequest) {
    try {
        const tasks = await fetchFromDataverse({
            table: process.env.TASK_TABLE!,
        })
        const response = NextResponse.json({
            success: true,
            data: stripPrefixFromKeys(tasks.value),
            message_title: 'Success',
            message: 'Successfully fetch the offces',
        });
        return response;
    } catch (error) {
        return handleApiError(error, req, 'Oops', 'Sorry, something went wrong');
    }
}