"use client"
import * as React from 'react'
import {
    IconDots,
    IconArrowsUpDown,
    IconEye,
    IconFileText,
    IconFileInfinity,
    IconCalendarTime,
    IconInfinity,
    IconCalendar,
    IconCalendarOff,
    IconCalendarExclamation,
    IconEditCircle,
    IconCheck
} from "@tabler/icons-react";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/custom/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge" // Optional: for status styling
import { formatDate, getYearUtil } from '@/lib/format-date';
import { calculateRecordStatus } from '@/lib/inclusive-dates-status';
import { EditSeriesItemDialog } from './edit-record-dialog';

export type Forms = {
    rcs_record_series_itemid: string;
    series_item_title: string; // Matches JSON
    retention_period_active: string | null;
    retention_period_storage: string | null;
    retention_period_total: string | null;
    time_value: string; // "T" for Temporary, "P" for Permanent
    years_or_months: string;
    is_nap_grds: number | boolean; // Matches JSON (1 or true)
    disposition_provision: string;
    isGroupHeader?: boolean;
}

export const columns: ColumnDef<Forms>[] = [
    {
        accessorKey: "series_item_title",
        header: ({ column }) => (
            <Button
                variant="ghost"
                className="hover:bg-transparent p-0 font-bold"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Record Series <IconArrowsUpDown className="ml-2 h-3 w-3" />
            </Button>
        ),
        cell: ({ row }) => {
            const isNap = row.original.is_nap_grds === 1 || row.original.is_nap_grds === true;
            return (
                <div className="flex flex-wrap items-center gap-1">
                    <span className="font-medium capitalize text-wrap">{row.getValue('series_item_title')}</span>
                    {isNap && (
                        <Badge variant="secondary" className="w-fit px-[1px] py-[2px] border-green-400 dark:bg-green-950 dark:text-green-400 bg-green-50 text-green-700 flex flex-row gap-1 items-center w-fit">
                            <IconCheck size={13} /> <span className='text-[7px]'>GRDS/ARDS</span>
                        </Badge>
                    )}
                </div>
            )
        }
    },
    {
        accessorKey: "retention_period_active",
        header: "Active",
        cell: ({ row }) => {
            const { time_value, retention_period_active, years_or_months } = row.original;
            if (time_value === "P") return <Badge variant="outline" className='flex flex-row gap-1 w-fit bg-blue-50 text-blue-700 border-blue-200 text-[10px] px-1 '><IconInfinity size={18} className="text-green-blue" /></Badge>;
            return <span>{retention_period_active ? `${retention_period_active} ${years_or_months}` : "---"}</span>;
        }
    },
    {
        accessorKey: "retention_period_storage",
        header: "Storage",
        cell: ({ row }) => {
            const { time_value, retention_period_storage, years_or_months } = row.original;
            if (time_value === "P") return <Badge variant="outline" className='flex flex-row gap-1 w-fit bg-blue-50 text-blue-700 border-blue-200 text-[10px] px-1 '><IconInfinity size={18} className="text-green-blue" /></Badge>;
            return <span>{retention_period_storage ? `${retention_period_storage} ${years_or_months}` : "---"}</span>;
        }
    },
    {
        accessorKey: "disposition_provision",
        header: "Disposition/Provision",
        cell: ({ row }) => (
            <span className="text-sm  text-wrap text-muted-foreground line-clamp-1 truncate max-w-[200px]">
                {row.getValue("disposition_provision") || "No remarks"}
            </span>
        )
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const form = row.original;
            if (form.isGroupHeader) return null;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <IconDots className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuLabel>Manage Record</DropdownMenuLabel>
                        <DropdownMenuItem asChild className="hover:cursor-pointer flex gap-2">
                            <EditSeriesItemDialog  item={form} />
                        </DropdownMenuItem>
                        {/* <DropdownMenuItem className="hover:cursor-pointer flex gap-2 text-blue-600">
                            <IconFileText size={16} />
                            Generate Report
                        </DropdownMenuItem> */}
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
]