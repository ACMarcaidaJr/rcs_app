
"use client"
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
    deleteItemHandler:  (groupId: number, itemIdx: number) => void;
}


export const MemoizedGroup = React.memo(({ group, groupIdx, handleChange, inputHandlers, deleteItemHandler }: GroupProps) => {
    return (
        <>
            {group.items.map((item, itemIdx) => (
                <RecordItemForm
                    key={itemIdx}
                    item={item}
                    itemIdx={itemIdx}
                    groupId={group.id}
                    handleChange={handleChange}
                    inputHandlers={inputHandlers}
                    deleteItemHandler={deleteItemHandler}
                />

            ))}
        </>
    );
});