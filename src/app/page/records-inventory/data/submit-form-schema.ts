'use client'

import { z } from "zod";


export const submitFormSchema = z.object({
    remarks: z.string().min(1, "The remarks is required"),
    office_id: z.string().min(1, "The office is required"),
    nap_form_one_header_id: z.string(),
    rcs_nap_form_one_headerid: z.string(),
    signed_nap_form_one_file: z.instanceof(File, { message: "The signed NAP Form No. 1 is required" })
});
