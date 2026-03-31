"use client"
import { IconDots, IconArrowsUpDown, IconEdit, IconEditCircle, IconUserPlus, IconCircle, IconCircleFilled, IconCheck, IconArrowLeft, IconArrowRight, IconEye } from "@tabler/icons-react"
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
import SubmitFormDialog from "./submit-form-dialog";
import * as React from 'react'
import SharingDialog from "./sharing-dialog"

export type Forms = {
    nap_form_one_header_id: number;
    rcs_nap_form_one_headerid: string;
    form_name: string;
    modifiedon: string;
    status: "draft" | "submitted" | "for revision" | "cancelled" | string
    nap_form_one_from_submitted_task: any[]
}

export const columns: ColumnDef<Forms>[] = [
    {
        accessorKey: "nap_form_one_header_id",
        sortingFn: "basic",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="hover:bg-transparent"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Edit
                    <IconArrowsUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: (({ row }) => {
            const form = row.original;
            return (
                <>
                    <Button disabled={!getFormStatus(form).isEditable} className=" hover:text-foreground" variant='link'>
                        <Link className="font-bold w-full " href={`/pages/records-inventory/${form.rcs_nap_form_one_headerid}`} >
                            <IconEdit />
                        </Link>
                    </Button>
                </>
            )
        })
    },
    {
        accessorKey: "form_name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="m-0 p-0 hover:bg-transparent"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Form Name
                    <IconArrowsUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    // {
    //     accessorKey: 'assisted_by',
    //     header: 'Assistance',
    //     id: 'assisted_by',
    //     cell: ({ row }) => {
    //         const form = row.original;
    //         return (
    //             <Button className="flex flex-row gap-1 px-2 py-0 border-gray-600 text-gray-600 dark:border-gray-500 dark:text-gray-300" variant="link">
    //                 <IconUserPlus size={13} />
    //                 <p className="text-[12px]">Assign</p>
    //             </Button>
    //         )
    //     }
    // },
    // {
    //     accessorKey: 'assisted_by',
    //     header: 'Approver',
    //     id: 'approved_by',
    //     cell: ({ row }) => {
    //         const form = row.original;
    //         return (
    //             <Button className="flex flex-row gap-1 px-2 py-0 border-gray-600 text-gray-600 dark:border-gray-500 dark:text-gray-300" variant="link">
    //                 <IconUserPlus size={13} />
    //                 <p className="text-[12px]">Assign</p>
    //             </Button>
    //         )
    //     }
    // },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const form = row.original
            const submissions = form.nap_form_one_from_submitted_task
            const status = !submissions.length ? 'draft' : submissions[0]?.approver_status ?? submissions[0]?.status

            if (status == 'draft') {
                return <div className="capitalize dark:bg-gray-800 dark:text-gray-100 bg-gray-100 text-gray-900 font-medium w-fit px-3 rounded-full flex flex-row gap-1 items-center">
                    <IconCircleFilled size={10} />
                    <p>{status}</p>
                </div>
            }
            if (status == 'submitted') {
                return <div className="capitalize dark:bg-blue-800 dark:text-blue-100 bg-blue-100 text-blue-900 font-medium w-fit px-3 rounded-full flex flex-row gap-1 items-center">
                    <IconArrowRight size={13} />
                    <p>{status}</p>
                </div>
            }
            if (status == 'received') {
                return <div className="capitalize dark:bg-green-800 dark:text-green-100 bg-green-100 text-green-900 font-medium w-fit px-3 rounded-full flex flex-row gap-1 items-center">
                    <IconCheck size={13} />
                    <p>{status}</p>
                </div>
            }
            if (status == 'returned') {
                return <div className="capitalize dark:bg-red-800 dark:text-red-100 bg-red-100 text-red-900 font-medium w-fit px-3 rounded-full flex flex-row gap-1 items-center">
                    <IconArrowLeft size={13} />
                    <p>{status}</p>
                </div>
            }

        }
    },
    {
        accessorKey: "Action",
        header: "Actions",
        id: "actions",
        cell: ({ row }) => {
            const form = row.original
            const submissions = form.nap_form_one_from_submitted_task
            const status = !submissions.length ? 'draft' : submissions[0]?.approver_status ?? submissions[0]?.status
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            {/* <span className="sr-only">Open menu</span> */}
                            <IconDots className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild className="hover:cursor-pointer">
                            <SharingDialog headerGuid={form.rcs_nap_form_one_headerid} />
                        </DropdownMenuItem>
                        {   
                            status == 'draft' || status === 'returned' ?
                                <DropdownMenuItem asChild className="">
                                    <SubmitFormDialog
                                        headerGuid={form.rcs_nap_form_one_headerid}
                                        headerId={`${form.nap_form_one_header_id}`}
                                    />
                                </DropdownMenuItem>
                                : null
                        }
                        <DropdownMenuItem className="hover:cursor-pointer " >
                            <Button
                                size="sm"
                                onClick={() => window.open(`/api/nap-form-one-output/${form.rcs_nap_form_one_headerid}`, '_blank')}
                                className="h-fit px-2 w-full flex flex-row justify-start items-center gap-2"
                                variant="ghost">
                                <IconEye size={18} />
                                <span>Preview</span>
                            </Button>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
export const getFormStatus = (form: any) => {
    const submissions = form.nap_form_one_from_submitted_task || [];
    const status = !submissions.length
        ? 'draft'
        : submissions[0]?.approver_status ?? submissions[0]?.status ?? 'draft';
    const isEditable = status === 'draft' || status === 'returned';
    return { status: status.toLowerCase(), isEditable };
};