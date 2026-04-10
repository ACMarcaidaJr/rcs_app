'use client'

import { z } from "zod";


export const submitFormSchema = z.object({
    creator_remarks: z.string(),
    office_id: z.string().nonempty("The office is required"),
    rcs_taskid: z.string(),
    rcs_nap_form_one_headerid: z.string(),
    nap_form_one: z.instanceof(File, { message: "The signed NAP Form No. 1 is required" })
});
