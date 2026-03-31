"use client"

import { IconDots, IconArrowsUpDown, IconEdit, IconEditCircle, IconUser } from "@tabler/icons-react"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/custom/button"
import { Switch } from "@/components/ui/switch"
import * as React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import AssignRoleDialog from "./assign-role-dialog"
export type Users = {
    given_name: string;
    family_name: string;
    suffix: string;
    user_name: string;
    createdon: string;
    is_active: number;
    rcs_userid: string;
    user_id: string;
}

export const getColumns = (
    changeStatus: (id: string | number, is_active: number) => void
): ColumnDef<Users>[] => [
        {
            accessorKey: "user",
            header: "User",
            cell: ({ row }) => {
                const form = row.original;
                const fullname = `${form.given_name ?? ""} ${form.family_name ?? ""} ${form.suffix ?? ""}`
                return <p>{fullname}</p>
            }
        },
        {
            accessorKey: "user_name",
            header: "User Name",
            cell: ({ row }) => {
                const form = row.original;
                return <p>{form.user_name}</p>
            }
        },
        {
            accessorKey: "created_date",
            header: "Created Date",
            cell: ({ row }) => {
                const form = row.original;
                const date = new Date(form.createdon);
                const humanReadable = date.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                });
                return <p>{humanReadable}</p>
            }
        },
        {
            accessorKey: "is_active",
            header: "Active",
            cell: ({ row }) => {
                const user = row.original;
                return (
                    <Switch
                        checked={Boolean(user.is_active)}
                        onCheckedChange={(checked) =>
                            changeStatus(user.rcs_userid, checked ? 1 : 0)
                        }
                    />
                );
            },
        },
        {
            accessorKey: "Action",
            header: "Actions",
            id: "actions",
            cell: ({ row }) => {
                const form = row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <IconDots className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem className="hover:cursor-pointer">Edit user</DropdownMenuItem>
                             <DropdownMenuItem className="hover:cursor-pointer">Assign office</DropdownMenuItem>
                            <DropdownMenuItem onSelect={(e) => {
                                e.preventDefault()
                            }} className="hover:cursor-pointer">
                                <AssignRoleDialog rcsUserId={form.rcs_userid} userId={form.user_id} />
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            }
        }
    ]