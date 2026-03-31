'use client'

import { z } from "zod";

export const assignAccessSchema = z.object({
    user: z.string().nonempty("The User is required"),
    access_type: z.string().nonempty("The Access Type is required"), // enum "view", "edit", "download", "assistance", "approver"
});
