'use client'

import {z} from "zod";


export const submitFormSchema = z.object({
    remarks: z.string().nonempty("The remarks is required"),
    office: z.string().nonempty("The office is required"),
    signed_nap_form_1: z.file().nonoptional("The signed NAP Form No. 1 is required")
})