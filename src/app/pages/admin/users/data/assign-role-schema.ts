'use client'

import { z } from "zod";

export const AssignRoleSchema = z.object({
    rcs_userid: z.string(),
    rcs_roleid: z.string()
});
