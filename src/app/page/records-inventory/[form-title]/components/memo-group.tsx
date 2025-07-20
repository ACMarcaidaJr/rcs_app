import React from 'react';
import { MemoInput } from './memo-input';
import { Label } from '@/components/ui/label';
import { GroupItem, RecordItem } from './data/types'; // adjust paths as needed

// ✅ Updated GroupProps with inputHandlers map
interface GroupProps {
  group: GroupItem;
  groupIdx: number;
  inputHandlers: Map<
    string,
    Record<string, (e: React.ChangeEvent<HTMLInputElement>) => void>
  >;
}

export const MemoizedGroup: React.FC<GroupProps> = React.memo(
  ({ group, groupIdx, inputHandlers }) => {
    return (
      <>
        {group.items.map((item: RecordItem, itemIdx: number) => {
          const handlers =
            inputHandlers.get(`${group.id}-${itemIdx}`) ?? {};

          return (
            <div
              key={itemIdx}
              className="rounded-lg border-solid border-[3px] overflow-clip"
            >
              <div className="p-3 bg-muted">
                <p className="text-foreground">Subunit: 01</p>
              </div>
              <div className="grid gap-4 p-3 [grid-template-columns:repeat(auto-fit,minmax(250px,1fr))]">
                <div className="flex flex-col gap-2">
                  <Label>Title and description</Label>
                  <MemoInput
                    value={item.title_and_description}
                    onChange={handlers.title_and_description}
                    placeholder="Enter"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Period Covered / Inclusive Dates</Label>
                  <MemoInput
                    value={item.period_covered_or_inclusive_dates}
                    onChange={handlers.period_covered_or_inclusive_dates}
                    placeholder="Enter"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Volume in cubic meter</Label>
                  <MemoInput
                    type="number"
                    value={item.volume}
                    onChange={handlers.volume}
                    placeholder="Number"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Records medium</Label>
                  <MemoInput
                    placeholder="Enter"
                    value={item.records_medium}
                    onChange={handlers.records_medium}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Restrictions</Label>
                  <MemoInput
                    placeholder="Enter"
                    value={item.restrictions}
                    onChange={handlers.restrictions}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Location of records</Label>
                  <MemoInput
                    placeholder="Enter"
                    value={item.location_of_records}
                    onChange={handlers.location_of_records}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Frequency of use</Label>
                  <MemoInput
                    placeholder="Frequency of use"
                    value={item.frequency_of_use}
                    onChange={handlers.frequency_of_use}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Duplication</Label>
                  <MemoInput
                    placeholder="Duplication"
                    value={item.duplication}
                    onChange={handlers.duplication}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Retention period (Active, Storage, Total)</Label>
                  <div className="flex flex-row gap-2">
                    <MemoInput
                      type="number"
                      placeholder="Year"
                      value={item.retention_period_active}
                      onChange={handlers.retention_period_active}
                    />
                    <MemoInput
                      type="number"
                      placeholder="Year"
                      value={item.retention_period_storage}
                      onChange={handlers.retention_period_storage}
                    />
                    <MemoInput
                      type="number"
                      placeholder="Year"
                      value={item.retention_period_total}
                      onChange={handlers.retention_period_total}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label>Disposition schedule</Label>
                  <MemoInput
                    type="number"
                    placeholder="Years"
                    value={item.disposition_provision}
                    onChange={handlers.disposition_provision}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </>
    );
  }
);
