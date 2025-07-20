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

// < div className = "flex flex-col gap-2" >
//     <Label>Add name for this form </Label>
//         < Input placeholder = 'Enter name' />
//         </div>
//         < div className = "grid gap-4 p-3 border rounded-lg border-secondary grid-cols-1 md:grid-cols-2 xl:grid-cols-3" >
//             {
//                 [
//                 { label: 'Name of office', placeholder: 'Enter', type: 'text' },
//                 { label: 'Address', placeholder: 'Enter', type: 'text' },
//                 { label: 'Department/Division', placeholder: 'Enter', type: 'text' },
//                 { label: 'Section/Unit', placeholder: 'Enter', type: 'text' },
//                 { label: 'Person-in-Charge of files', placeholder: 'Enter', type: 'text' },
//                 { label: 'Telephone No.', placeholder: 'Enter', type: 'text' },
//                 { label: 'Email address', placeholder: 'abc@org.org.gov.ph', type: 'text' },
//                 { label: 'Date prepared', placeholder: '', type: 'date' },
//       ].map((field, idx) => (
//                     <div key= { idx } className = "flex flex-col gap-2" >
//                     <Label>{ field.label } </Label>
//                     < Input placeholder = { field.placeholder } type = { field?.type || 'text'} />
//             </div>
//       ))}