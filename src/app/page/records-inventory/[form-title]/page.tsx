
'use client'
import { Layout } from '@/components/custom/layout'
import { Button } from "@/components/custom/button";
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";

import EditGroupValue from './components/edit-group-value';
import { useMemo } from 'react';
import { IconFilter, IconCheck, IconPlus, IconMenu3, IconFilter2, IconSearch, IconChevronLeft, IconEdit, IconPencil, IconCornerRightDown, IconRelationOneToMany } from "@tabler/icons-react"

import Link from 'next/link';
import * as React from 'react'
import { useReducer } from 'react';
import { cn } from '@/lib/utils';
import { MemoInput } from './components/memo-input';
import { useCallback } from 'react';
import { MemoizedGroup } from './components/memo-group';
import { GroupItem, RecordItem } from './components/data/types';



type State = GroupItem[];

type Action =
    | { type: 'add_group' }
    | { type: 'add_item'; groupId: number }
    | { type: 'toggle_edit_group'; groupId: number }
    | {
        type: 'update_field';
        groupId: number;
        itemIndex: number;
        field: keyof RecordItem;
        value: string;
    }
    | {
        type: 'update_group_title';
        groupId: number;
        value: string;
    }
    ;



export default function Page() {

    function reducer(state: State, action: Action): State {
        switch (action.type) {
            case 'add_item': {
                return state.map(group =>
                    group.id === action.groupId
                        ? {
                            ...group,
                            items: [
                                ...group.items,
                                {
                                    title_and_description: '',
                                    period_covered_or_inclusive_dates: '',
                                    volume: '',
                                    records_medium: '',
                                    restrictions: '',
                                    location_of_records: '',
                                    frequency_of_use: '',
                                    duplication: '',
                                    time_value: '',
                                    utility_value: '',
                                    retention_period_active: '',
                                    retention_period_storage: '',
                                    retention_period_total: '',
                                    disposition_provision: '',
                                },
                            ],
                        }
                        : group
                );
            }
            case 'update_field': {
                const groupIndex = state.findIndex(group => group.id === action.groupId);
                if (groupIndex === -1) return state;

                const group = state[groupIndex];
                const item = group.items[action.itemIndex];

                if (item[action.field] === action.value) {
                    return state;
                }

                const updatedItems = group.items.map((it, i) =>
                    i === action.itemIndex
                        ? { ...it, [action.field]: action.value }
                        : it
                );

                const updatedGroup = { ...group, items: updatedItems };
                const updatedState = [...state];
                updatedState[groupIndex] = updatedGroup;
                return updatedState;
            }

            case 'update_group_title': {
                return state.map(group =>
                    group.id === action.groupId
                        ? { ...group, group_title: action.value }
                        : group
                );
            }
            case 'toggle_edit_group':
                const clickedGroup = state.find(group => group.id === action.groupId)
                const willEdit = !clickedGroup?.isEditing
                return state.map(group => ({
                    ...group,
                    isEditing: group.id === action.groupId ? willEdit : false,
                }))


            case 'add_group':
                return [
                    ...state,
                    {
                        id: Date.now(),
                        group_title: '',
                        isEditing: false,
                        items: [
                            {
                                title_and_description: '',
                                period_covered_or_inclusive_dates: '',
                                volume: '',
                                records_medium: '',
                                restrictions: '',
                                location_of_records: '',
                                frequency_of_use: '',
                                duplication: '',
                                time_value: '',
                                utility_value: '',
                                retention_period_active: '',
                                retention_period_storage: '',
                                retention_period_total: '',
                                disposition_provision: '',
                            },
                        ],
                    },
                ];

            default:
                throw new Error('Unknown action');
        }
    }

    const [state, dispatch] = useReducer(reducer, [
        {
            id: Date.now(),
            group_title: "Basta Title ito",
            isEditing: false,
            items: [
                {
                    title_and_description: "",
                    period_covered_or_inclusive_dates: "",
                    volume: '',
                    records_medium: '',
                    restrictions: '',
                    location_of_records: '',
                    frequency_of_use: '',
                    duplication: '',
                    time_value: '',
                    utility_value: '',
                    retention_period_active: '',
                    retention_period_storage: '',
                    retention_period_total: '',
                    disposition_provision: '',
                }
            ]
        }
    ]);


    // const handleChange = useCallback(
    //     (field: keyof RecordItem, groupId: number, itemIdx: number) =>
    //         (e: React.ChangeEvent<HTMLInputElement>) => {
    //             dispatch({
    //                 type: 'update_field',
    //                 groupId,
    //                 itemIndex: itemIdx,
    //                 field,
    //                 value: e.target.value,
    //             });
    //         },
    //     [dispatch]
    // );

    const inputHandlers = useMemo(() => {
        const handlerMap = new Map<string, Record<string, (e: React.ChangeEvent<HTMLInputElement>) => void>>();

        state.forEach((group) => {
            group.items.forEach((item, itemIdx) => {
                const key = `${group.id}-${itemIdx}`;
                handlerMap.set(key, {
                    title_and_description: (e) =>
                        dispatch({ type: 'update_field', groupId: group.id, itemIndex: itemIdx, field: 'title_and_description', value: e.target.value }),
                    volume: (e) =>
                        dispatch({ type: 'update_field', groupId: group.id, itemIndex: itemIdx, field: 'volume', value: e.target.value }),
                    period_covered_or_inclusive_dates: (e) =>
                        dispatch({ type: 'update_field', groupId: group.id, itemIndex: itemIdx, field: 'period_covered_or_inclusive_dates', value: e.target.value }),
                    records_medium: (e) =>
                        dispatch({ type: 'update_field', groupId: group.id, itemIndex: itemIdx, field: 'records_medium', value: e.target.value }),
                    restrictions: (e) =>
                        dispatch({ type: 'update_field', groupId: group.id, itemIndex: itemIdx, field: 'restrictions', value: e.target.value }),
                    location_of_records: (e) =>
                        dispatch({ type: 'update_field', groupId: group.id, itemIndex: itemIdx, field: 'location_of_records', value: e.target.value }),
                    frequency_of_use: (e) =>
                        dispatch({ type: 'update_field', groupId: group.id, itemIndex: itemIdx, field: 'frequency_of_use', value: e.target.value }),
                    duplication: (e) =>
                        dispatch({ type: 'update_field', groupId: group.id, itemIndex: itemIdx, field: 'duplication', value: e.target.value }),
                    retention_period_active: (e) =>
                        dispatch({ type: 'update_field', groupId: group.id, itemIndex: itemIdx, field: 'retention_period_active', value: e.target.value }),
                    retention_period_storage: (e) =>
                        dispatch({ type: 'update_field', groupId: group.id, itemIndex: itemIdx, field: 'retention_period_storage', value: e.target.value }),
                    retention_period_total: (e) =>
                        dispatch({ type: 'update_field', groupId: group.id, itemIndex: itemIdx, field: 'retention_period_total', value: e.target.value }),
                    disposition_provision: (e) =>
                        dispatch({ type: 'update_field', groupId: group.id, itemIndex: itemIdx, field: 'disposition_provision', value: e.target.value }),
                });
            });
        });

        return handlerMap;
    }, [state]);

    return (
        <Layout fixed className="flex flex-col min-h-[100vh]">
            {/* <Layout.Header sticky className="bg-ghost">
                <h1 className="text-lg font-bold">Editing a Form</h1>
            </Layout.Header> */}

            <Layout.Body className=" flex  flex-1 flex-row overflow-hidden">

                <ResizablePanelGroup
                    direction="horizontal"
                    className="flex w-full min-h-[100dvh] rounded-lg pr-5"
                >
                    <ResizablePanel className='py-5 ' defaultSize={25}>
                        <div className='flex flex-col gap-5 min-w-fit'>
                            <div>
                                <Button className='' variant='ghost'>
                                    <Link className='flex flex-row gap-2' href='/page/records-inventory' >
                                        <IconChevronLeft size={18} />
                                        <p>Done editing</p></Link>
                                </Button>
                            </div>
                            <div className="flex flex-row gap-3 items-start justify-start border-solid border-bottom border-blue-500 ">
                                <div>
                                    <h1 className="text-nowrap">
                                        <span className='font-bold'>Editing: </span>
                                        <span className='italic'>Form Title can be long</span>
                                    </h1>
                                </div>
                            </div>

                            {
                                state && state.map(({ group_title, id, isEditing }, idx) => (
                                    <div key={idx} className={cn(isEditing && 'border-primary', 'flex flex-col gap-3 p-3 rounded-lg border-solid border border-solid border-[2px]  mr-3 min-w-[140px]')}>
                                        <div className='w-full flex flex-row gap-2 items-center'>


                                            <Input
                                                onChange={(e) =>
                                                    dispatch({
                                                        type: 'update_group_title',
                                                        groupId: id,
                                                        value: e.target.value,
                                                    })
                                                }
                                                value={group_title}
                                                className=''
                                                placeholder='Records Series Title & Description' />
                                            <Button
                                                size='sm'
                                                onClick={() =>
                                                    dispatch({ type: 'toggle_edit_group', groupId: id })
                                                }
                                                className='' variant='ghost'>
                                                {
                                                    isEditing ? <IconCheck /> : <IconPencil />
                                                }

                                            </Button>
                                        </div>
                                        <div className='flex flex-row justify-around gap-2 '>
                                            <div className='flex items-center flex-row gap-2 text-[13px]'>
                                                <Checkbox />
                                                <span className='text-nowrap '>Single Unit</span>
                                            </div>
                                            <EditGroupValue />
                                            <Button size='sm' onClick={() => dispatch({ type: 'add_item', groupId: id })} className='rounded-lg w-fit flex flex-row gap-2' variant='ghost'>
                                                Add item
                                                <IconPlus size={16} />
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            }

                            <div className='flex flex-col gap-3  mr-3 min-w-[140px]'>
                                <Button onClick={() => dispatch({ type: 'add_group' })} className='rounded-sm w-full flex flex-row gap-2' variant='outline'>
                                    Add group
                                    <IconPlus size={16} />
                                </Button>
                            </div>
                        </div>
                    </ResizablePanel>
                    <ResizableHandle withHandle />
                    <ResizablePanel className='py-3 pl-3 ' defaultSize={75}>
                        <div className='flex flex-col gap-3 '>
                            {state.map((group: GroupItem, groupIdx: number) =>
                                group.isEditing ? (
                                    <MemoizedGroup
                                        key={group.id}
                                        group={group}
                                        groupIdx={groupIdx}
                                        inputHandlers={inputHandlers}
                                    />

                                ) : null
                            )}

                        </div>
                    </ResizablePanel>

                </ResizablePanelGroup>
            </Layout.Body>
        </Layout>

    )
}