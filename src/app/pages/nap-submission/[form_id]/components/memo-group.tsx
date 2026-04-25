"use client"

import { IconInfoCircle, IconLayersLinked } from "@tabler/icons-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

import React from 'react';
import { MemoInput } from './memo-input';
import { Label } from '@/components/ui/label';
import { GroupItem, RecordItem } from './data/types';
import { RecordItemForm } from './memo-record-item-form';
interface GroupProps {
    group: GroupItem;
    groupIdx: number;
    handleChange: (
        field: keyof RecordItem,
        groupId: number,
        itemIdx: number
    ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
    inputHandlers: Map<string, Record<string, (value: string) => void>>;
    deleteItemHandler: (groupId: number, itemIdx: number) => void;
}


export const MemoizedGroup = React.memo(({ group, groupIdx, handleChange, inputHandlers, deleteItemHandler }: GroupProps) => {
    return (
        <>
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    {/* Icon Container: Adjusts to a deep navy in dark mode */}
                    {/* <div className="bg-blue-50 dark:bg-blue-950/30 p-2.5 rounded-xl border border-blue-100 dark:border-blue-900/50">
                        <IconLayersLinked className="text-blue-600 dark:text-blue-400" size={24} />
                    </div> */}
                    <div className="flex gap-2 mt-1">
                        <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 text-[10px] font-semibold uppercase tracking-wider">
                            Series {groupIdx + 1} Entry
                        </Badge>
                        <Badge variant="outline" className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800">
                            NAP Form No. 1
                        </Badge>
                    </div>
                </div>

                {/* Alert: Shifts from light blue to a subtle dark blue glow */}
                <Alert className="bg-blue-50/40 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/50 shadow-sm">
                    <IconInfoCircle className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                    <AlertDescription className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                        <span className="block mt-1 font-medium text-slate-500 italic">
                            Changes made here only apply to this form and will not change the original inventory data.
                        </span>
                    </AlertDescription>
                </Alert>
            </div>

            <div className="relative mt-4">
                {/* Connector Line: Becomes darker to blend into the background */}
                {group.items.length > 0 && (
                    <div className="absolute left-[19px] top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-800 -z-10" />
                )}

                {group.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="relative flex flex-col gap-2">
                        <RecordItemForm
                            item={item}
                            itemIdx={itemIdx}
                            groupId={group.id}
                            handleChange={handleChange}
                            inputHandlers={inputHandlers}
                            deleteItemHandler={deleteItemHandler}
                        />
                    </div>
                ))}

                {/* Empty State: Darker background and border */}
                {group.items.length === 0 && (
                    <div className="text-center py-10 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
                        <p className="text-sm text-slate-400 dark:text-slate-600 italic">No subseries items added yet.</p>
                    </div>
                )}
            </div>
        </>
    );
});