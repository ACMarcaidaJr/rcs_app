"use client"

import { z } from "zod"

export const AnnouncementsSchema = z.object({
    notice_title: z.string().nonempty('The notice title is required'),
    rcs_roleid: z.string(),
    notice_description: z.string(),
    year_covered: z.string(),
    deadline_of_submission: z.string(),
    supporting_document: z.instanceof(File).optional()
})
