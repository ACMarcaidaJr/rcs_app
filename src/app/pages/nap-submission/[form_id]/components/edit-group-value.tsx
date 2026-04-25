"use client"

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { IconAlertCircle, IconRelationOneToMany, IconLayoutRows } from "@tabler/icons-react";
import { RecordItem } from "./data/types";
import * as React from 'react';
import { Label } from "@/components/ui/label";
import { MemoInput } from "./memo-input";
import { MemoSelect } from "./memo-select";
import { SelectItem } from "@/components/ui/select";
import { Button } from "@/components/custom/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IconX } from "@tabler/icons-react";
import { epochToDate } from '@/lib/format-date';

interface RecordItemFormProps {
  group_value: RecordItem;
  groupId: number;
  handleChange: (
    field: keyof RecordItem,
    groupId: number,
    itemIdx: number
  ) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  inputHandlers: Map<string, Record<string, (value: string) => void>>;
  isEditing?: boolean;
  items: RecordItem[];
}


export const EditGroupValue = React.memo(({ isEditing, group_value, groupId, handleChange, inputHandlers, items }: RecordItemFormProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={!isEditing || items.length <= 1} className="h-7 text-[11px] gap-1 px-2" variant="outline">
          <IconLayoutRows size={18} />
          Set for Subseries
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Subseries Values</DialogTitle>
          <DialogDescription>
            <div className='flex flex-row gap-2 items-center'>
              <IconAlertCircle />
              <span>Add a default value for its subunit</span>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className=''>
          <div className='grid gap-4 p-3 [grid-template-columns:repeat(auto-fit,minmax(250px,1fr))]'>
            <div className='flex flex-col gap-2'>
              <Label>Title and description</Label>
              <MemoInput
                value={group_value?.records_series_title_and_description}
                onChange={handleChange('records_series_title_and_description', groupId, 0)}
                placeholder="Enter"
              />
            </div>
            <div className="flex flex-row gap-2 w-full">

              <div className="flex flex-col gap-2 flex-1 min-w-0">
                <Label>Date from</Label>
                <MemoInput
                  className="w-full"
                  value={group_value?.date_period_from ?? ""}
                  type="date"
                  onChange={handleChange('date_period_from', groupId, 0)}
                />
              </div>
              <div className="flex flex-col gap-2 flex-1 min-w-0">
                <Label>Date to</Label>
                <MemoInput
                  className="w-full"
                  value={group_value?.date_period_to ?? ""}
                  type="date"
                  onChange={handleChange('date_period_to', groupId, 0)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Volume in cubic meter</Label>
              <MemoInput
                type="number"
                value={group_value?.volume}
                onChange={handleChange('volume', groupId, 0)}
                placeholder="Number"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Records medium</Label>
              <MemoInput
                placeholder="Enter"
                value={group_value?.records_medium}
                onChange={handleChange('records_medium', groupId, 0)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Restrictions</Label>
              <MemoInput
                placeholder="Enter"
                value={group_value?.restrictions}
                onChange={handleChange('restrictions', groupId, 0)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Location of records</Label>
              <MemoInput
                placeholder="Enter"
                value={group_value?.location_of_records}
                onChange={handleChange('location_of_records', groupId, 0)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Frequency of use</Label>
              <MemoInput
                placeholder="Frequency of use"
                value={group_value?.frequency_of_use}
                onChange={handleChange('frequency_of_use', groupId, 0)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Duplication</Label>
              <MemoInput
                placeholder="Duplication"
                value={group_value?.duplication}
                onChange={handleChange('duplication', groupId, 0)}
              />
            </div>
            <div className='flex flex-col gap-2'>
              <Label>Time value (T/P)</Label>
              <MemoSelect
                value={group_value?.time_value}
                onChange={inputHandlers.get(`${groupId}-${0}`)?.time_value ?? (() => { })}
                placeholder="Choose one..."
              >
                <SelectItem value="T">Temporary</SelectItem>
                <SelectItem value="P">Permanent</SelectItem>
              </MemoSelect>
            </div>
            <div className='flex flex-col gap-2'>
              <Label>Utility value</Label>
              <MemoSelect
                value={group_value?.utility_value}
                onChange={inputHandlers.get(`${groupId}-${0}`)?.utility_value ?? (() => { })}
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
                  is_disabled={group_value?.time_value == 'P' ? true : false}
                  type="text"
                  placeholder="Active"
                  value={group_value?.retention_period_active}
                  onChange={handleChange('retention_period_active', groupId, 0)}
                />
                <MemoInput
                  is_disabled={group_value?.time_value == 'P' ? true : false}
                  type="text"
                  placeholder="Storage"
                  value={group_value?.retention_period_storage}
                  onChange={handleChange('retention_period_storage', groupId, 0)}

                />
                <MemoInput
                  is_disabled={group_value?.time_value == 'P' ? true : false}
                  type="text"
                  placeholder="Total"
                  value={group_value?.retention_period_total}
                  onChange={handleChange('retention_period_total', groupId, 0)}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label>Disposition provision</Label>
              <MemoInput
                type="text"
                placeholder="Enter"
                value={group_value?.disposition_provision}
                onChange={handleChange('disposition_provision', groupId, 0)}
              />
            </div>

          </div>
        </div>
        <DialogFooter className="pt-4">
          <DialogTrigger asChild>
            <Button variant='outline'>
              Done
            </Button>
          </DialogTrigger>

        </DialogFooter>
      </DialogContent>
    </Dialog >
  );
});
