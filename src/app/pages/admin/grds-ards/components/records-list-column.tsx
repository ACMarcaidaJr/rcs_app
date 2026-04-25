
"use client"
import * as React from 'react'
import {
    IconArrowsDown,
    IconDots,
} from "@tabler/icons-react";
import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/custom/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { EditSeriesItemDialog } from './edit-record-dialog';
import { cn } from '@/lib/utils';
import { RecordDetailsDrawer } from './record-details-drawer';

// Updated type to reflect your new nested/grouped structure
export type Forms = {
    is_group: boolean;
    record_series_title?: string; // Only if is_group is true
    series_item_title?: string;   // Only if is_group is false or inside subseries
    subseries?: Forms[];
    rcs_record_series_itemid: string;
    retention_period_active: string | null;
    retention_period_storage: string | null;
    time_value: string;
    years_or_months: string | null;
    disposition_provision: string;
    retention_period_total: string;
    is_subseries?: boolean; // Helper flag if needed
    record_series_title_id: string;
}

export const columns: ColumnDef<any>[] = [
    {
        accessorKey: "series_item_title",
        cell: ({ row }) => {
            const item = row.original as any;

            if (item.rowType === 'OFFICE') {
                return (
                    <div className="w-full flex flex-row gap-2 items-center justify-center text-center py-2">
                        <IconArrowsDown size={16} />
                        <span className="text-xs uppercase underline font-bold italic">
                            {item.title}
                        </span>
                    </div>
                );
            }

            if (item.rowType === 'SERIES_HEADER') {
                return <span className="font-medium block ">{item.title}</span>;
            }

            return (
                <div className={cn(
                    "text-sm leading-tight",
                    item.isSubItem ? "ml-12" : "ml-4"
                )}>
                    {item.series_item_title}
                </div>
            );
        }
    },
    {
        accessorKey: "retention_period_active",
        cell: ({ row }) => {
            const item = row.original;
            if (item.rowType !== 'ITEM') return null;
            const unit = item.years_or_months || "";
            return <div className="text-center capitalize">{item.retention_period_active === 0 ? "" : item.retention_period_active} {unit}</div>;
        }
    },
    {
        accessorKey: "retention_period_storage",
        cell: ({ row }) => {
            const item = row.original;
            if (item.rowType !== 'ITEM') return null;
            const unit = item.years_or_months || "";
            return <div className="text-center capitalize">{item.retention_period_storage === 0 ? "" : item.retention_period_storage} {unit}</div>;
        }
    },
    {
        accessorKey: "retention_period_total",
        cell: ({ row }) => {
            const item = row.original;
            if (item.rowType !== 'ITEM') return null;
            const unit = item.years_or_months || "";
            return <div className="text-center capitalize">{item.retention_period_total === 0 ? "" : item.retention_period_total} {unit}</div>;
        }
    },
    {
        accessorKey: "disposition_provision",
        cell: ({ row }) => {
            const item = row.original as any;
            if (item.rowType !== 'ITEM') return null;
            return <div className="text-xs capitalize italic ">{item.disposition_provision}</div>;
        }
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {

            const item = row.original;
            if (item.isGroupHeader) return null;
            if (item.rowType !== 'ITEM') return null;

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
                        <EditSeriesItemDialog item={item as any} />
                        {/* <RecordDetailsDrawer data={item} /> */}
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];