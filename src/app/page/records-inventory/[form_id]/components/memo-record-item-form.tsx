"use client"
import { RecordItem } from "./data/types";
import * as React from 'react';
import { Label } from "@/components/ui/label";
import { MemoInput } from "./memo-input";
import { MemoSelect } from "./memo-select";
import { SelectItem } from "@/components/ui/select";
import { Button } from "@/components/custom/button";
import { IconX } from "@tabler/icons-react";
interface RecordItemFormProps {
    item: RecordItem;
    itemIdx: number;
    groupId: number;
    handleChange: (
        field: keyof RecordItem,
        groupId: number,
        itemIdx: number
    ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
    inputHandlers: Map<string, Record<string, (value: string) => void>>;
    deleteItemHandler: (groupId: number, itemIdx: number) => void;
}


export const RecordItemForm = React.memo(({ item, itemIdx, groupId, handleChange, inputHandlers, deleteItemHandler }: RecordItemFormProps) => {

    return (
        <div className='rounded-lg border-solid border-[3px] overflow-clip'>
            <div className='p-1 md:p-3 bg-muted'>
                <Button onClick={() => deleteItemHandler(groupId, itemIdx)} className="p-2" variant='ghost'>
                    <IconX size={17} />
                </Button>
            </div>
            <div className='grid gap-4 p-3 [grid-template-columns:repeat(auto-fit,minmax(250px,1fr))]'>
                <div className='flex flex-col gap-2'>
                    <Label>Title and description</Label>
                    <MemoInput
                        value={item.records_series_title_and_description}
                        onChange={handleChange('records_series_title_and_description', groupId, itemIdx)}
                        placeholder="Enter"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <Label>Period Covered / Inclusive Dates</Label>
                    <MemoInput
                        value={item.period_covered_or_inclusive_dates}
                        onChange={handleChange('period_covered_or_inclusive_dates', groupId, itemIdx)}
                        placeholder="Enter"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <Label>Volume in cubic meter</Label>
                    <MemoInput
                        type="number"
                        value={item.volume}
                        onChange={handleChange('volume', groupId, itemIdx)}
                        placeholder="Number"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <Label>Records medium</Label>
                    <MemoInput
                        placeholder="Enter"
                        value={item.records_medium}
                        onChange={handleChange('records_medium', groupId, itemIdx)}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <Label>Restrictions</Label>
                    <MemoInput
                        placeholder="Enter"
                        value={item.restrictions}
                        onChange={handleChange('restrictions', groupId, itemIdx)}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <Label>Location of records</Label>
                    <MemoInput
                        placeholder="Enter"
                        value={item.location_of_records}
                        onChange={handleChange('location_of_records', groupId, itemIdx)}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <Label>Frequency of use</Label>
                    <MemoInput
                        placeholder="Frequency of use"
                        value={item.frequency_of_use}
                        onChange={handleChange('frequency_of_use', groupId, itemIdx)}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <Label>Duplication</Label>
                    <MemoInput
                        placeholder="Duplication"
                        value={item.duplication}
                        onChange={handleChange('duplication', groupId, itemIdx)}
                    />
                </div>
                <div className='flex flex-col gap-2'>
                    <Label>Time value (T/P)</Label>
                    <MemoSelect
                        value={item.time_value}
                        onChange={inputHandlers.get(`${groupId}-${itemIdx}`)?.time_value ?? (() => { })}
                        placeholder="Choose one..."
                    >
                        <SelectItem value="_">None</SelectItem>
                        <SelectItem value="T">Temporary</SelectItem>
                        <SelectItem value="P">Permanent</SelectItem>
                    </MemoSelect>
                </div>
                <div className='flex flex-col gap-2'>
                    <Label>Utility value</Label>
                    <MemoSelect
                        value={item.utility_value}
                        onChange={inputHandlers.get(`${groupId}-${itemIdx}`)?.utility_value ?? (() => { })}
                        placeholder="Choose one..."
                    >
                        <SelectItem value="Adm">Administrative</SelectItem>
                        <SelectItem value="F">Fiscal</SelectItem>
                        <SelectItem value="L">Legal</SelectItem>
                        <SelectItem value="Arc">Archival</SelectItem>
                    </MemoSelect>
                </div>
                <div className="flex flex-col gap-2">
                    <Label>Retention period (Active, Storage, Total)</Label>
                    <div className="flex flex-row gap-2">
                        <MemoInput
                            is_disabled={item.time_value == 'P' ? true : false}
                            type="text"
                            placeholder="Active"
                            value={item.retention_period_active}
                            onChange={handleChange('retention_period_active', groupId, itemIdx)}
                        />
                        <MemoInput
                            is_disabled={item.time_value == 'P' ? true : false}
                            type="text"
                            placeholder="Storage"
                            value={item.retention_period_storage}
                            onChange={handleChange('retention_period_storage', groupId, itemIdx)}
                        />
                        <MemoInput
                            is_disabled={item.time_value == 'P' ? true : false}
                            type="text"
                            placeholder="Total"
                            value={item.retention_period_total}
                            onChange={handleChange('retention_period_total', groupId, itemIdx)}
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <Label>Disposition schedule</Label>
                    <MemoInput
                        type="text"
                        placeholder="Enter"
                        value={item.disposition_provision}
                        onChange={handleChange('disposition_provision', groupId, itemIdx)}
                    />
                </div>

            </div>
        </div>
    );
});
