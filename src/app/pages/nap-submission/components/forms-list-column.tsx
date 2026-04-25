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
import * as React from 'react'

import SharingDialog from "./sharing-dialog"
import SubmitFormDialog from "./submit-form-dialog";
import { Badge } from "@/components/ui/badge"

export type Forms = {
    nap_form_one_header_id: number;
    rcs_nap_form_one_headerid: string;
    form_name: string;
    createdon: string;
    modifiedon: string;
    date_prepared: string;
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
                        <Link className="font-bold w-full " href={`/pages/nap-submission/${form.rcs_nap_form_one_headerid}`} >
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
        cell: ({ row }) => {
            const form = row.original;
            const readableDate = new Date(form?.date_prepared).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
            return (
                <>
                    <div>
                        <p className="">{form.form_name}</p>
                        <p className="text-[12px] text-muted-foreground">Created: {form.date_prepared && readableDate}</p>
                    </div>
                </>
            )
        }
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

            const rawDate = submissions[0]?.createdon ? submissions[0]?.createdon : submissions[0]?.modifiedon;
            const readableDate = new Date(rawDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
            if (status == 'draft') {
                return (
                    <div className="flex flex-col gap-1">
                        <Badge variant="outline" className="capitalize border-gray-400 dark:bg-gray-950 dark:text-gray-400 bg-gray-50 text-gray-700 flex flex-row gap-1 items-center w-fit">
                            <IconCircleFilled size={14} />
                            <p>{status}</p>
                        </Badge>
                        <p className="text-[12px] text-muted-foreground">{rawDate && readableDate}</p>

                    </div>
                )
            }
            if (status == 'submitted') {
                return (
                    <div className="flex flex-col gap-1">
                        <Badge variant="outline" className="capitalize border-blue-400 dark:bg-blue-950 dark:text-blue-400 bg-blue-50 text-blue-700 flex flex-row gap-1 items-center w-fit">
                            <IconArrowRight size={14} />
                            <p>{status}</p>
                        </Badge>
                        <p className="text-[12px] text-muted-foreground">{rawDate && readableDate}</p>
                    </div>
                )

            }
            if (status == 'received') {
                return (
                    <div className="flex flex-col gap-1">
                        <Badge variant="outline" className="capitalize border-green-400 dark:bg-green-950 dark:text-green-400 bg-green-50 text-green-700 flex flex-row gap-1 items-center w-fit">
                            <IconCheck size={14} />
                            <p>{status}</p>
                        </Badge>
                        <p className="text-[12px] text-muted-foreground">{rawDate && readableDate}</p>
                    </div>
                )
            }
            if (status == 'returned') {
                return (
                    <div className="flex flex-col gap-1">
                        <Badge variant="outline" className="capitalize border-red-400 dark:bg-red-950 dark:text-red-400 bg-red-50 text-red-700 flex flex-row gap-1 items-center w-fit">
                            <IconArrowLeft size={14} />
                            <p>{status}</p>
                        </Badge>
                        <p className="text-[12px] text-muted-foreground">{rawDate && readableDate}</p>
                    </div>
                )
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