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
import AssignModuleDialog from "./assign-module-dialog"
export type Roles = {
    role_name: string;
    description: string;
    createdon: string;
    is_active: string;
    rcs_roleid: string;
}

export const getColumns = (
    changeStatus: (id: string | number, is_active: number) => void
): ColumnDef<Roles>[] => [
        {
            accessorKey: "role_name",
            header: "Role Name",
            cell: ({ row }) => {
                const form = row.original;
                return <p>{form.role_name}</p>
            }
        },
        {
            accessorKey: "description",
            header: "Description",
            cell: ({ row }) => {
                const form = row.original;
                return <p>{form.description}</p>
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
                const role = row.original;

                return (
                    <Switch
                        checked={Boolean(role.is_active === '1' ? true : false)}
                        onCheckedChange={(checked) =>
                            changeStatus(role.rcs_roleid, checked ? 1 : 0)
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
                            <DropdownMenuItem className="hover:cursor-pointer">Edit role</DropdownMenuItem>
                            <DropdownMenuItem onSelect={(e) => {
                                e.preventDefault()
                            }} className="hover:cursor-pointer">
                                <AssignModuleDialog rcsRoleId={form.rcs_roleid} />
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            }
        }
    ]