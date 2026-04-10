"use client"
import { RecordItem } from "./data/types";
import * as React from 'react';
import { Label } from "@/components/ui/label";
import { MemoInput } from "./memo-input";
import { MemoSelect } from "./memo-select";
import { SelectItem } from "@/components/ui/select";
import { Button } from "@/components/custom/button";
import { IconX } from "@tabler/icons-react";
import { MultiCombobox } from "@/components/ui/combobox";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

interface RecordItemFormProps {
    item: RecordItem;
    itemIdx: number;
    groupId: number;
    handleChange: (
        field: keyof RecordItem,
        groupId: number,
        itemIdx: number
    ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
    inputHandlers: Map<string, Record<string, (value: any) => void>>;
    deleteItemHandler: (groupId: number, itemIdx: number) => void;
}

export const RecordItemForm = React.memo(({ item, itemIdx, groupId, handleChange, inputHandlers, deleteItemHandler }: RecordItemFormProps) => {

    const isPermanent = item?.time_value === 'P';

    // Parse utility_value for display
    const currentUtilityArray = React.useMemo(() => {
        try {
            if (!item?.utility_value) return [];
            return typeof item.utility_value === 'string'
                ? JSON.parse(item.utility_value)
                : item.utility_value;
        } catch (e) {
            return item.utility_value ? [item.utility_value] : [];
        }
    }, [item?.utility_value]);

    const utility_value_options = [
        "Administrative",
        "Fiscal",
        "Legal",
        "Archival",
    ] as const;

    return (
        <div className='rounded-lg border-2 border-gray-200 dark:border-gray-800 overflow-clip mb-4 shadow-sm bg-white dark:bg-gray-950'>
            {/* Header Section */}
            <div className='p-2 px-3 bg-gray-100 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center'>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                    Subseries Item #{itemIdx + 1} (View Only Mode)
                </span>
                <Button
                    onClick={() => deleteItemHandler(groupId, itemIdx)}
                    className="h-8 w-8 p-0 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
                    variant='ghost'
                >
                    <IconX size={17} />
                </Button>
            </div>

            <div className='grid gap-4 p-4 [grid-template-columns:repeat(auto-fit,minmax(250px,1fr))]'>

                <div className='flex flex-col gap-2'>
                    <Label className="text-blue-700 dark:text-blue-400 font-semibold">Title and Description</Label>
                    <MemoInput
                        type="text"
                        value={item?.records_series_title_and_description}
                        onChange={handleChange('records_series_title_and_description', groupId, itemIdx)}
                    />
                </div>

                {/* EDITABLE: Date Range Group */}
                <div className="flex flex-col gap-3 w-full">
                    <div className="flex items-center justify-end gap-2 mb-1">
                        <Label htmlFor={`date-mode-${groupId}-${itemIdx}`} className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            {!!item?.is_full_date ? "Full Date Mode" : "Year Only Mode"}
                        </Label>
                        <Switch
                            id={`date-mode-${groupId}-${itemIdx}`}
                            checked={!!item?.is_full_date}
                            onCheckedChange={(checked) => {
                                handleChange('is_full_date', groupId, itemIdx)({
                                    target: {
                                        value: checked ? 1 : 0,
                                        name: 'is_full_date'
                                    }
                                } as any);
                            }}
                            className="data-[state=checked]:bg-blue-600"
                        />
                    </div>

                    <div className="flex flex-row gap-2 w-full">
                        <div className="flex flex-col gap-2 flex-1 min-w-0">
                            <Label className="text-blue-700 dark:text-blue-400 font-semibold text-xs">
                                {!!item?.is_full_date ? "Date From" : "Year From"}
                            </Label>
                            <MemoInput
                                className="w-full border-slate-200 dark:border-slate-800 focus:border-blue-400 dark:bg-slate-950"
                                value={item?.date_period_from ?? ""}
                                type={item?.is_full_date ? "date" : "text"}
                                onChange={handleChange('date_period_from', groupId, itemIdx)}
                                placeholder={item?.is_full_date ? "mm/dd/yyyy" : "YYYY"}
                            // Removed onWheel to resolve the TypeScript error
                            />
                        </div>

                        <div className="flex flex-col gap-2 flex-1 min-w-0">
                            <Label className="text-blue-700 dark:text-blue-400 font-semibold text-xs">
                                {!!item?.is_full_date ? "Date To" : "Year To"}
                            </Label>
                            <MemoInput
                                className="w-full border-slate-200 dark:border-slate-800 focus:border-blue-400 dark:bg-slate-950"
                                value={item?.date_period_to ?? ""}
                                type={!!item?.is_full_date ? "date" : "text"}
                                onChange={handleChange('date_period_to', groupId, itemIdx)}
                                placeholder={!!item?.is_full_date ? "mm/dd/yyyy" : "YYYY"}
                            />
                        </div>
                    </div>
                </div>

                {/* EDITABLE: Volume */}
                <div className="flex flex-col gap-2">
                    <Label className="text-blue-700 dark:text-blue-400 font-semibold">Volume (cu. m.)</Label>
                    <MemoInput
                        type="text"
                        value={item?.volume}
                        // className="border-gray-200 dark:border-gray-800 dark:bg-gray-950"
                        onChange={handleChange('volume', groupId, itemIdx)}
                        placeholder="0.000"
                    />
                </div>

                {/* EDITABLE: Records Medium */}
                <div className="flex flex-col gap-2">
                    <Label className="text-blue-700 dark:text-blue-400 font-semibold">Records Medium</Label>
                    <MemoInput
                        placeholder="e.g., Paper/Digital"
                        // className="border-gray-200 dark:border-gray-800 dark:bg-gray-950"
                        value={item?.records_medium}
                        onChange={handleChange('records_medium', groupId, itemIdx)}
                    />
                </div>

                {/* EDITABLE: Location of Records */}
                <div className="flex flex-col gap-2">
                    <Label className="text-blue-700 dark:text-blue-400 font-semibold">Location of Records</Label>
                    <MemoInput
                        placeholder="e.g., Room 101 / Cloud"
                        // className="border-gray-200 dark:border-gray-800 dark:bg-gray-950"
                        value={item?.location_of_records}
                        onChange={handleChange('location_of_records', groupId, itemIdx)}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <Label className="text-gray-500 dark:text-gray-400">Frequency of Use</Label>
                    <MemoInput
                        placeholder="e.g., Room 101 / Cloud"
                        is_disabled={true}
                        value={item?.frequency_of_use}
                        onChange={handleChange('frequency_of_use', groupId, itemIdx)}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <Label className="text-gray-500 dark:text-gray-400">Duplication</Label>
                    <MemoInput
                        placeholder="e.g., Room 101 / Cloud"
                        is_disabled={true}
                        value={item?.duplication}
                        onChange={handleChange('duplication', groupId, itemIdx)}
                    />
                </div>

                {/* READ ONLY: Time Value */}
                <div className='flex flex-col gap-2'>
                    <Label className="text-gray-500 dark:text-gray-400">Time Value (T/P)</Label>
                    <MemoSelect
                        value={item?.time_value}
                        onChange={() => { }}
                        placeholder="Select value"
                        disabled={true}
                    >
                        <SelectItem value="T">Temporary</SelectItem>
                        <SelectItem value="P">Permanent</SelectItem>
                    </MemoSelect>
                </div>

                {/* READ ONLY: Utility Value */}
                <div className='flex flex-col gap-2'>
                    <Label className="text-gray-500 dark:text-gray-400">Utility Value</Label>
                    <div className="flex flex-wrap gap-1.5 min-h-10 p-2 rounded-md border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30 border-dashed">
                        {currentUtilityArray.length > 0 ? (
                            currentUtilityArray.map((val: string) => (
                                <Badge
                                    key={val}
                                    variant="secondary"
                                    className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700"
                                >
                                    {val}
                                </Badge>
                            ))
                        ) : (
                            <span className="text-xs text-gray-400 dark:text-gray-600 italic">No utility values assigned</span>
                        )}
                    </div>
                </div>

                {/* READ ONLY: Retention Period */}
                <div className="flex flex-col gap-2">
                    <Label className="text-gray-500 dark:text-gray-400">Retention Period (Active / Storage / Total)</Label>
                    <div className="flex flex-row gap-2">
                        <MemoInput
                            is_disabled={true}
                            value={isPermanent ? "N/A" : item?.retention_period_active}
                            onChange={() => { }}
                        // className="bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-800"
                        />
                        <MemoInput
                            is_disabled={true}
                            value={isPermanent ? "N/A" : item?.retention_period_storage}
                            onChange={() => { }}
                        // className="bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-800"
                        />
                        <MemoInput
                            is_disabled={true}
                            value={isPermanent ? "PERM" : item?.retention_period_total}
                            onChange={() => { }}
                        // className="bg-gray-100 dark:bg-gray-900 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-800"
                        />
                    </div>
                </div>

                {/* EDITABLE: Disposition Provision */}
                <div className="flex flex-col gap-2">
                    <Label className="text-blue-700 dark:text-blue-400 font-semibold">Disposition Provision</Label>
                    <MemoInput
                        type="text"
                        placeholder="Official reference"
                        // className="border-gray-200 dark:border-gray-800 dark:bg-gray-950"
                        value={item?.disposition_provision}
                        onChange={handleChange('disposition_provision', groupId, itemIdx)}
                    />
                </div>
            </div>
        </div>
    );
});