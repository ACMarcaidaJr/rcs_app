"use client"

import { ColumnDef } from "@tanstack/react-table"

// import SubmitFormDialog from "./submit-form-dialog";
import * as React from 'react'

export type Announcements = {
    nap_form_one_compliance_notices_id: number;
    notice_title: string;
    notice_description: string;
    year_covered: string;
    deadline_of_submission: string;
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
        accessorKey: "year_covered",
        header: "Year Covered",
    },
    {
        accessorKey: "deadline_of_submission",
        header: "Deadline of Submission",
        cell: ({ row }) => {
            const form = row.original;
            const date = new Date(form.deadline_of_submission);
            const humanReadable = date.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
            });
            return <p>{humanReadable}</p>
        }
    },

]