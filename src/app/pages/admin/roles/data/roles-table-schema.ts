"use client"

import { z } from "zod"

export const RoleSchema = z.object({
    role_name: z.string().nonempty('The role name is required'),
    description: z.string().nonempty('The description is required'),
})