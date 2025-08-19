"use client"

import { z } from "zod"

export const AnnouncementsSchema = z.object({
    notice_title: z.string().nonempty('The notice title is required'),
    rcs_roleid: z.string(),
    notice_description: z.string(),
    inclusive_year_start: z.string(),
    inclusive_year_end: z.string(),
    supporting_document: z.instanceof(File).optional()
})
