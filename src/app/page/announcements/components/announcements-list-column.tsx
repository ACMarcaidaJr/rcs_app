"use client"
import { IconDots, IconArrowsUpDown } from "@tabler/icons-react"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/custom/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
// import SubmitFormDialog from "./submit-form-dialog";
import * as React from 'react'

export type Announcements = {
    nap_form_one_compliance_notices_id: number;
    notice_title: string;
    notice_description: string;
    inclusive_year_start: string;
    inclusive_year_end: string;
    // supporting_document: File;
}

export const columns: ColumnDef<Announcements>[] = [
    // nap_form_one_compliance_notices_id
    {
        accessorKey: "announcement_notice_id",
        header: "ID",
    },
    {
        accessorKey: "notice_title",
        header: "Notice Title",
    },
    {
        accessorKey: "notice_description",
        header: "Notice Description",
    },
    {
        accessorKey: "inclusive_year_start",
        header: "Inclusive Year Start",
    },
    {
        accessorKey: "inclusive_year_end",
        header: "Inclusive Year End",
    },

]