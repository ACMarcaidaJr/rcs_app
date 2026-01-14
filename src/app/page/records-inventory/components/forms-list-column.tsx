"use client"
import { IconDots, IconArrowsUpDown, IconEdit, IconEditCircle, IconUser } from "@tabler/icons-react"
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

export type Forms = {
    nap_form_one_header_id: number;
    rcs_nap_form_one_headerid: string;
    form_name: string;
    modifiedon: string;
    assisted_by: string;
    approved_by: string;
    status: "draft" | "submitted" | "for revision" | "cancelled" | string
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
                    ID
                    <IconArrowsUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: (({ row }) => {
            const form = row.original;
            return (
                <>
                    {
                        form?.status == 'draft' ?
                            <div className="flex flex-row gap-3 items-center">
                                <Button className="" variant='link'>
                                    <Link className="font-bold w-full text-blue-600" href={`/page/records-inventory/${form.nap_form_one_header_id}`} >
                                        <IconEdit />
                                    </Link>
                                </Button>
                                <p>{form.nap_form_one_header_id}</p>
                            </div>
                            : <div className="flex flex-row gap-3 items-center">
                                <Button disabled className="" variant='link'>
                                    <Link className="font-bold w-full text-blue-500" href={`/page/records-inventory/${form.nap_form_one_header_id}`} >
                                        <IconEdit />
                                    </Link>
                                </Button>
                                <p>{form.nap_form_one_header_id}</p>
                            </div>
                    }
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
    {
        accessorKey: "status",
        header: "Status",
    },
    {
        accessorKey: 'assisted_by',
        header: 'Assistance',
        id: 'assisted_by',
        cell: ({ row }) => {
            const form = row.original;
            return (
                <Button className="flex flex-row gap-1 px-2 py-0" variant='outline'>
                    <IconUser size={15} />
                    <p className="text-[12px]">Assign</p>
                </Button>
            )
        }
    },
    {
        accessorKey: 'assisted_by',
        header: 'Approver',
        id: 'approved_by',
        cell: ({ row }) => {
            const form = row.original;
            return (
                <Button className="flex flex-row gap-1 px-2 py-0" variant='outline'>
                    <IconUser size={15} />
                    <p className="text-[12px]">Assign</p>
                </Button>
            )
        }
    },
    {
        accessorKey: "Action",
        header: "Actions",
        id: "actions",
        cell: ({ row }) => {
            const form = row.original
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
                        <DropdownMenuItem className="hover:cursor-pointer">Copy header</DropdownMenuItem>
                        {
                            form.status == 'draft' ?
                                <DropdownMenuItem asChild className="">
                                    <SubmitFormDialog
                                        headerGuid={form.rcs_nap_form_one_headerid}
                                        headerId={`${form.nap_form_one_header_id}`}
                                    />
                                </DropdownMenuItem>

                                : null
                        }
                        <DropdownMenuItem className="hover:cursor-pointer" onClick={() => window.open(`/api/nap-form-one-output/${form.nap_form_one_header_id}`, '_blank')}>Preview</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]