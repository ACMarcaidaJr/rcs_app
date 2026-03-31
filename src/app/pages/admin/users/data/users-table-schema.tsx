"use client"

import { z } from "zod"

export const UserSchema = z.object({
    user_name: z.string().nonempty('The user name is required'),
    position_title: z.string().nonempty('The job title is required'),
    given_name: z.string().nonempty('The first name is required'),
    middle_name: z.string(),
    family_name: z.string().nonempty('The lastname is required'),
    suffix: z.string(),
    sex: z.string().nonempty('The sex is required'),
})