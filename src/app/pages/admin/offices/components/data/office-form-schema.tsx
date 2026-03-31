"use client"

import { z } from "zod"

export const addOfficeProfileSchema = z.object({
    name_of_office:z.string().nonempty('The name of office is required'),
    department_or_division: z.string(),
    section_or_unit: z.string(),
    telephone_no: z.string(),
    local_no: z.string()
})
 