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
// This type is used to define the shape of our data.

export type Forms = {
    nap_form_one_header_id: number
    form_name: string
    modifiedon: string 
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
                    className="m-0 p-0"
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
                <Button variant='link' >
                    {/* <Link href={`/page/records-inventory/${form.id}`}>{form.id}</Link> */}
                    <Link className="font-bold w-full text-blue-500" href={`/page/records-inventory/${form.nap_form_one_header_id}`} >{form.nap_form_one_header_id}</Link>

                </Button>
            )
        })
    },
    {
        accessorKey: "form_name",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    className="m-0 p-0"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Form Name
                    <IconArrowsUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "modifiedon",
        header: "Edited",
    },
    {
        accessorKey: "status",
        header: "Status",
    },
    {
        accessorKey: "actions",
        header: "Actions",
        id: "actions",
        cell: ({ row }) => {
            const form = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <IconDots className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem className="hover:cursor-pointer">Clone header only</DropdownMenuItem>
                        <DropdownMenuItem className="hover:cursor-pointer">Clone this from</DropdownMenuItem>
                        <DropdownMenuItem className="hover:cursor-pointer">Preview</DropdownMenuItem>

                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]