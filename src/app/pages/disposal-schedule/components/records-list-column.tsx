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
    IconAlertTriangle
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

export type Forms = {
    records_series_title_and_description: string;
    date_period_from: string;
    date_period_to: string;
    volume: string;
    records_medium: string;
    restrictions: string;
    location_of_records: string;
    frequency_of_use: string;
    duplication: string; // Fixed typo
    time_value: string;
    utility_value: string; // Fixed typo
    retention_period_active: string;
    retention_period_storage: string;
    retention_period_total: string;
    disposition_provision: string;
    isGroupHeader?: boolean; // Added for type safety with grouping
}

export const columns: ColumnDef<Forms>[] = [
    {
        accessorKey: "records_series_title_and_description",
        header: ({ column }) => (
            <Button
                variant="ghost"
                className="hover:bg-transparent p-0 font-bold "
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Record Series
                <IconArrowsUpDown className="ml-2 h-3 w-3" />
            </Button>
        ),
        cell: ({ row }) => {
            const val = row.getValue("records_series_title_and_description") as string;
            return <p className="text-normal text-wrap capitalize">{val || "No Title"}</p>;
        }
    },
    {
        accessorKey: "date_period_from",
        header: "Inclusive Dates",
        cell: ({ row }) => {
            const from = row.original.date_period_from;
            const to = row.original.date_period_to;
            if (!from && !to) {
                return <span className="text-slate-400 italic text-[11px]">No dates set</span>;
            }
            return (
                <div className="flex items-center gap-1 text-sm">
                    <span>{from ? getYearUtil(from) : "---"}</span>
                    <span className="text-slate-400">to</span>
                    <span>{to ? getYearUtil(to) : "Present"}</span>
                </div>
            );
        }
    },
    {
        accessorKey: "retention_period_total",
        header: "Total Retention Period",
        cell: ({ row }) => <span>{row.getValue("retention_period_total") || "---"}</span>
    },
    {
        accessorKey: "volume",
        header: "Volume"
    },
    // {
    //     accessorKey: "time_value",
    //     header: "Time Value",
    //     cell: ({ row }) => {
    //         // IconFileInfinity
    //         const time_value = row.getValue("time_value") as string;
    //         return (
    //             <>
    //                 {
    //                     time_value == "P" ?
    //                         <div className="flex flex-col gap-1">
    //                             <div className="capitalize dark:bg-green-800 dark:text-green-100 bg-green-100 text-green-900 font-medium w-fit px-3 py-1 rounded-full flex flex-row gap-1 items-center w-fit">
    //                                 <IconFileInfinity size={12} />
    //                                 <p className='text-[12px]'>Permanent</p>
    //                             </div>
    //                         </div> :
    //                         <div className="flex flex-col gap-1">
    //                             <div className="capitalize dark:bg-orange-800 dark:text-orange-100 bg-orange-100 text-orange-900 font-medium w-fit px-3 py-1 rounded-full flex flex-row gap-1 items-center w-fit">
    //                                 <IconCalendarTime size={12} />
    //                                 <p className='text-[12px]'>Temporary</p>
    //                             </div>
    //                         </div>
    //                 }
    //             </>
    //         );
    //     }
    // },
    {
        accessorKey: "retention_status",
        header: "Retention Status",
        cell: ({ row }) => {
            const rowData = row.original;

            // 1. Use the utility for logic
            const { status, label, disposalYearStart, disposalYearEnd } = calculateRecordStatus(
                rowData.retention_period_total,
                rowData.date_period_from,
                rowData.date_period_to
            );

            // 2. Handle the "Pending" state early
            if (status === 'pending') {
                return <span className="text-slate-400 italic text-[11px]">{label}</span>;
            }

            // 3. Define UI Mapping (Colors & Icons)
            const config = {
                permanent: {
                    className: "border-green-400 dark:bg-green-950 dark:text-green-400 bg-green-50 text-green-700",
                    icon: <IconInfinity size={14} />,
                    text: label
                },
                overdue: {
                    className: "border-red-400 dark:bg-red-950 dark:text-red-400 bg-red-50 text-red-700",
                    icon: <IconCalendarOff size={14} />,
                    text: label
                },
                partial: {
                    className: "border-orange-500 dark:bg-orange-950 dark:text-orange-400 bg-orange-50 text-orange-700",
                    icon: <IconAlertTriangle size={14} />,
                    text: `${label} (${disposalYearStart} - ${disposalYearEnd})`
                },
                due: {
                    className: "border-yellow-500 dark:bg-yellow-950 dark:text-yellow-400 bg-yellow-50 text-yellow-700",
                    icon: <IconCalendarExclamation size={14} />,
                    text: label
                },
                active: {
                    className: "border-blue-400 dark:bg-blue-950 dark:text-blue-400 bg-blue-50 text-blue-700",
                    icon: <IconCalendarTime size={14} />,
                    text: label // You could also calculate yearsLeft here if needed
                }
            };

            const current = config[status as keyof typeof config];

            return (
                <Badge
                    variant="outline"
                    className={`${current.className} flex flex-row gap-1 items-center w-fit`}
                >
                    {current.icon}
                    <span>{current.text}</span>
                </Badge>
            );
        }
    },
    {
        accessorKey: "location_of_records",
        header: "Location Of Records",
        cell: ({ row }) => <span>{row.getValue("location_of_records") || "---"}</span>
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const form = row.original

            // If it's a group header row, we might want to hide actions or show different ones
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
                        <DropdownMenuItem className="hover:cursor-pointer flex gap-2">
                            <IconEye size={16} className="text-slate-500" />
                            View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="hover:cursor-pointer flex gap-2 text-blue-600">
                            <IconFileText size={16} />
                            Generate Report
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]