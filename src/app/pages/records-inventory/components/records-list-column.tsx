"use client"
import * as React from 'react'
import {
    IconArrowsUpDown,
    IconDots,
    IconInfinity,
    IconCalendarExclamation,
    IconCalendarCheck,
    IconCheck,
    IconFileSettings,
} from "@tabler/icons-react";
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/custom/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { EditSeriesItemDialog } from './edit-record-dialog';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { RecordDetailsDrawer } from './record-details-drawer';

export type Forms = {
    rcs_nap_form_one_rowid: string;
    records_series_title_and_description: string;
    retention_period_active: string | null;
    retention_period_storage: string | null;
    time_value: string;
    years_or_months: string | null;
    disposition_provision: string;
    accumulatedRange: string;
    isPermanent: boolean;
    isDueThisYear: string;
    overdue: string;
    volume: string;
    isGroupHeader?: boolean;
    totalVolumeList: []
    is_nap_grds: number;
}

export const columns: ColumnDef<Forms>[] = [
    {
        accessorKey: "records_series_title_and_description",
        header: ({ column }) => (
            <Button
                variant="ghost"
                className="hover:bg-transparent p-0 font-bold text-left"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Record Series <IconArrowsUpDown className="ml-2 h-3 w-3" />
            </Button>
        ),
        cell: ({ row }) => {
            // Destructuring directly from original to bypass potential accessorKey mismatches
            const { records_series_title_and_description, accumulatedRange, isPermanent } = row.original;

            return (
                <div className="flex flex-col gap-1 max-w-[300px]">
                    <span className="font-semibold text-sm leading-tight capitalize text-wrap">
                        {records_series_title_and_description || "Untitled Record"}
                    </span>
                    <div className="flex items-center gap-2">
                        <span className="text-[11px] text-muted-foreground font-mono">
                            Range: {accumulatedRange || "N/A"}
                        </span>
                    </div>
                </div>
            )
        }
    },
    {
        accessorKey: "retention_period_active",
        header: "Active/Storage",
        cell: ({ row }) => {
            const { time_value, retention_period_active, retention_period_storage } = row.original;
            if (time_value === "P") return <span className="text-xs font-bold text-blue-600">Permanent</span>;
            return (
                <div className="text-xs">
                    <span className="font-medium">{retention_period_active || 0}y</span>
                    <span className="text-muted-foreground mx-1">/</span>
                    <span className="font-medium">{retention_period_storage || 0}y</span>
                </div>
            );
        }
    },
    {
        id: "status",
        header: "Disposal Status",
        cell: ({ row }) => {
            const { overdue, isDueThisYear, isPermanent } = row.original;
            if (isPermanent) return <span className="text-muted-foreground text-xs italic">N/A</span>;

            return (
                <div className="flex flex-col gap-1.5">
                    {overdue ? (
                        <div className="flex items-center gap-2 p-1.5 rounded-md   w-fit">
                            <IconCalendarExclamation size={16} className="text-red-600 shrink-0" />
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase font-black text-red-600 leading-none">
                                    Ready for Disposal
                                </span>
                                <span className="text-[11px] font-semibold text-red-700">
                                    Covers: {overdue}
                                </span>
                            </div>
                        </div>
                    ) : null}

                    {isDueThisYear ? (
                        <div className="flex items-center gap-2 p-1.5 rounded-md   w-fit">
                            <IconCalendarCheck size={16} className="text-amber-600 shrink-0" />
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase font-black text-amber-600 leading-none">
                                    Due this Year ({new Date().getFullYear()})
                                </span>
                                <span className="text-[11px] font-semibold text-amber-700">
                                    Covers: {isDueThisYear}
                                </span>
                            </div>
                        </div>
                    ) : null}
                    {!overdue && !isDueThisYear && (
                        <span className="text-xs text-muted-foreground italic">Current</span>
                    )}
                </div>
            )
        }
    },

    // {
    //     accessorKey: "volume",
    //     header: "Total Volume",
    //     cell: ({ row }) => {
    //         const volume = row.original.volume;
    //         const { totalVolumeList } = row.original

    //         return (
    //             <div className='flex flex-wrap gap-1'>
    //                 {
    //                     totalVolumeList?.map((volume, i) => (
    //                         <Badge variant="secondary" key={i}>{volume}</Badge>
    //                     ))
    //                 }
    //             </div>
    //         );
    //     }
    // },
    {
        accessorKey: "is_nap_grds",
        header: "GRDS/ARDS",
        cell: ({ row }) => {
            const isNapGrds = !!row.original.is_nap_grds;

            return (
                <div className="flex items-center justify-start">
                    {isNapGrds ? (
                        <Badge
                            variant="secondary"
                            className={cn(
                                "rounded-full p-2 transition-colors",
                                "bg-green-50 text-green-700 border-green-200 hover:bg-green-100",
                                "dark:bg-green-900/30 dark:text-green-400 dark:border-green-800 dark:hover:bg-green-900/50"
                            )}
                        >
                            <IconCheck size={12} stroke={3} />
                        </Badge>
                    ) : null}
                </div>
            );
        }
    },
    // is_nap_grds
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const form = row.original;
            if (form.isGroupHeader) return null;
            const [isOpen, setIsOpen] = React.useState(false)
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <IconDots className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuLabel>Manage Record</DropdownMenuLabel>
                        <EditSeriesItemDialog item={form as any} />
                        <RecordDetailsDrawer data={form} />
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
]