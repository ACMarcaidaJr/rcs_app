"use client"

import { z } from "zod"

export const TaskSchema = z.object({
    task_title: z.string().nonempty('The notice title is required'),
    rcs_roleid: z.string(),
    task_description: z.string(),
    deadline: z.string(),
    supporting_document: z.instanceof(File).optional()
})
