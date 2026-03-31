"use client"

import { z } from "zod"

export const formSchema = z.object({
    form_name: z.string().nonempty('The form name is required'),
    name_of_office:z.string().nonempty('The name of office is required'),
    address:z.string(),
    date_prepared:z.string(),
    department_or_division: z.string(),
    email_address: z.string(),
    person_in_charge_of_files:z.string(),
    section_or_unit: z.string(),
    telephone_no: z.string(),
    assistance_name: z.string(),
    assistance_position: z.string(),
    approver_name: z.string(),
    approver_position: z.string()
})

/*
nap_form_one_header_id
user_name
status
*/