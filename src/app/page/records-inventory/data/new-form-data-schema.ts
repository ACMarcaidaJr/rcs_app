"use client"

import { z } from "zod"

export const formSchema = z.object({
    form_name: z.string().nonempty('The form name is required'),
    name_of_office:z.string().nonempty('The name of office is required'),
    address:z.string().nonempty('This field is required'),
    date_prepared:z.string().nonempty('This field is required'),
    department_or_division: z.string().nonempty('This field is required'),
    email_address: z.string().nonempty('This field is required'),
    person_in_charge_of_files:z.string().nonempty('This field is required'),
    section_or_unit: z.string().nonempty('This field is required'),
    telephone_no: z.string().nonempty('This field is required')
})
