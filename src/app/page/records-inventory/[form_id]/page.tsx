
'use client'
import { Layout } from '@/components/custom/layout'
import { Button } from "@/components/custom/button";
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox';

import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";

import { EditGroupValue } from './components/edit-group-value';
import { useMemo } from 'react';
import { IconCheck, IconPlus, IconChevronLeft, IconPencil, IconX, IconDeviceFloppy } from "@tabler/icons-react"

import Link from 'next/link';
import * as React from 'react'
import { useReducer } from 'react';
import { cn } from '@/lib/utils';
import { MemoizedGroup } from './components/memo-group';
import { GroupItem, GroupItemFromDataverse, RecordItem } from './components/data/types';
import { initialItem, createInitialGroup } from './components/data/types';
import { use } from 'react'
import { toast } from '@/components/ui/use-toast';
import { pickOnlyRecordItemFields } from '@/lib/pickOnlyFieldsInRecordItem';
import { Skeleton } from '@/components/ui/skeleton';
type State = GroupItem[];

type Action =
    | { type: 'add_data_from_dataverse'; group: GroupItemFromDataverse[] }
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
        type: 'update_group_value_field';
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
    | { type: 'toggle_is_single_unit'; groupId: number; value: boolean }
    | { type: 'remove_group'; groupId: number }
    | { type: 'delete_item'; groupId: number; itemIndex: number };

export default function Page({ params }: {
    params: Promise<{ form_id: string }>
}) {
    const { form_id } = use(params)

    const [state, dispatch] = useReducer(reducer, [createInitialGroup(1, true)]);

    function reducer(state: State, action: Action): State {
        switch (action.type) {
            case 'add_data_from_dataverse':
                return action.group.map((group: GroupItemFromDataverse) => ({
                    ...group,
                    group_values: group.group_values.map(pickOnlyRecordItemFields),
                    items: group.items.map(pickOnlyRecordItemFields),
                }));

            case 'add_item': {
                return state.map(group =>
                    group.id === action.groupId
                        ? {
                            ...group,
                            items: [
                                ...group.items,
                                group.group_values[0]
                            ],
                        }
                        : group
                );
            }
            case 'update_field': {
                const { groupId, itemIndex, field, value } = action;
                console.log('field', field)
                return state.map((group) =>
                    group.id === groupId
                        ? {
                            ...group,
                            items: group.items.map((item, idx) =>
                                idx === itemIndex
                                    ? {
                                        ...item,
                                        [field]: value,
                                        ...(field === 'time_value' && value === 'P'
                                            ? {
                                                retention_period_total: 'Permanent',
                                                retention_period_active: 'Permanent',
                                                retention_period_storage: 'Permanent    '
                                            }
                                            : {
                                            }),
                                    }
                                    : item
                            ),
                        }
                        : group
                );
            }
  
            case 'update_group_value_field': {
                const { groupId, itemIndex, field, value } = action;

                return state.map((group) => {
                    if (group.id !== groupId) return group;

                    // Updated group_values
                    const updatedGroupValues = group.group_values.map((item, idx) => {
                        if (idx !== itemIndex) return item;

                        const updatedItem = {
                            ...item,
                            [field]: value,
                            ...(field === 'time_value' && value === 'P'
                                ? {
                                    retention_period_total: 'Permanent',
                                    retention_period_active: 'Permanent',
                                    retention_period_storage: 'Permanent',
                                }
                                : field === 'time_value'
                                    ? {
                                        retention_period_total: '',
                                        retention_period_active: '',
                                        retention_period_storage: '',
                                    }
                                    : {}),
                        };

                        return updatedItem;
                    });

                    // Updated items — only update the field if value is not empty string
                    const updatedItems = group.items.map((item) => {
                        // if (value === '') return item; // Do not overwrite with empty string
                        return {
                            ...item,
                            [field]: value,
                        };
                    });

                    return {
                        ...group,
                        group_values: updatedGroupValues,
                        items: updatedItems,
                    };
                });
            }


            // case 'update_group_value_field':{
            //         return state.map(group =>
            //             group.id === action.groupId
            //                 ? {
            //                     ...group,
            //                     group_values: group.group_values.map((gv, i) =>
            //                         i === action.itemIndex ? { ...gv, [action.field]: action.value } : gv
            //                     ),
            //                 }
            //                 : group
            //         );
            //     }

            case 'update_group_title': {
                return state.map(group =>
                    group.id === action.groupId
                        ? { ...group, group_title: action.value }
                        : group
                );
            }
            case 'toggle_edit_group':
                const clickedGroup = state.find(group => group.id === action.groupId)
                const willEdit = !clickedGroup?.is_editing
                return state.map(group => ({
                    ...group,
                    is_editing: group.id === action.groupId ? willEdit : false,
                }))


            case 'add_group': {
                const nextId = Math.max(0, ...state.map(g => g.id)) + 1;
                const newState = [...state, createInitialGroup(nextId)]
                const clickedGroup = newState.find(group => group.id === nextId)
                const willEdit = !clickedGroup?.is_editing
                return newState.map(group => ({
                    ...group,
                    is_editing: group.id === nextId ? willEdit : false,
                }));
            }
            case 'toggle_is_single_unit': {
                return state.map(group =>
                    group.id === action.groupId
                        ? { ...group, is_single_unit: action.value }
                        : group
                );
            }
            case 'remove_group': {
                return state.filter(group => group.id !== action.groupId);
            }
            case 'delete_item': {
                return state.map(group => {
                    if (group.id === action.groupId) {
                        return {
                            ...group,
                            items: group.items.filter((_, idx) => idx !== action.itemIndex),
                        };
                    }
                    return group;
                });
            }
            default:
                throw new Error('Unknown action');
        }
    }


    type InputChangeHandler = (value: string) => void;

    const inputHandlers = useMemo(() => {
        const handlerMap = new Map<string, Record<string, InputChangeHandler>>();
        state.forEach((group) => {
            group.items.forEach((item, itemIdx) => {
                const key = `${group.id}-${itemIdx}`;
                handlerMap.set(key, {
                    records_series_title_and_description: (value) =>
                        dispatch({ type: 'update_field', groupId: group.id, itemIndex: itemIdx, field: 'records_series_title_and_description', value }),
                    volume: (value) =>
                        dispatch({ type: 'update_field', groupId: group.id, itemIndex: itemIdx, field: 'volume', value }),
                    period_covered_or_inclusive_dates: (value) =>
                        dispatch({ type: 'update_field', groupId: group.id, itemIndex: itemIdx, field: 'period_covered_or_inclusive_dates', value }),
                    records_medium: (value) =>
                        dispatch({ type: 'update_field', groupId: group.id, itemIndex: itemIdx, field: 'records_medium', value }),
                    restrictions: (value) =>
                        dispatch({ type: 'update_field', groupId: group.id, itemIndex: itemIdx, field: 'restrictions', value }),
                    location_of_records: (value) =>
                        dispatch({ type: 'update_field', groupId: group.id, itemIndex: itemIdx, field: 'location_of_records', value }),
                    frequency_of_use: (value) =>
                        dispatch({ type: 'update_field', groupId: group.id, itemIndex: itemIdx, field: 'frequency_of_use', value }),
                    duplication: (value) =>
                        dispatch({ type: 'update_field', groupId: group.id, itemIndex: itemIdx, field: 'duplication', value }),
                    time_value: (value) =>
                        dispatch({ type: 'update_field', groupId: group.id, itemIndex: itemIdx, field: 'time_value', value }),
                    utility_value: (value) =>
                        dispatch({ type: 'update_field', groupId: group.id, itemIndex: itemIdx, field: 'utility_value', value }),
                    retention_period_active: (value) =>
                        dispatch({ type: 'update_field', groupId: group.id, itemIndex: itemIdx, field: 'retention_period_active', value }),
                    retention_period_storage: (value) =>
                        dispatch({ type: 'update_field', groupId: group.id, itemIndex: itemIdx, field: 'retention_period_storage', value }),
                    retention_period_total: (value) =>
                        dispatch({ type: 'update_field', groupId: group.id, itemIndex: itemIdx, field: 'retention_period_total', value }),
                    disposition_provision: (value) =>
                        dispatch({ type: 'update_field', groupId: group.id, itemIndex: itemIdx, field: 'disposition_provision', value }),
                });
            });
        });

        return handlerMap;
    }, [state]);

    const getInputHandler = (field: keyof RecordItem, groupId: number, itemIdx: number) => {
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            const handler = inputHandlers.get(`${groupId}-${itemIdx}`)?.[field];
            if (handler) {
                handler(e.target.value);
            }
        };
    };

    // for group value
    const groupValueInputHandlers = useMemo(() => {
        const handlerMap = new Map<string, Record<string, InputChangeHandler>>();
        state.forEach((group) => {
            group.group_values.forEach((item, itemIdx) => {
                const key = `${group.id}-${itemIdx}`;
                handlerMap.set(key, {
                    records_series_title_and_description: (value) =>
                        dispatch({ type: 'update_group_value_field', groupId: group.id, itemIndex: itemIdx, field: 'records_series_title_and_description', value }),
                    volume: (value) =>
                        dispatch({ type: 'update_group_value_field', groupId: group.id, itemIndex: itemIdx, field: 'volume', value }),
                    period_covered_or_inclusive_dates: (value) =>
                        dispatch({ type: 'update_group_value_field', groupId: group.id, itemIndex: itemIdx, field: 'period_covered_or_inclusive_dates', value }),
                    records_medium: (value) =>
                        dispatch({ type: 'update_group_value_field', groupId: group.id, itemIndex: itemIdx, field: 'records_medium', value }),
                    restrictions: (value) =>
                        dispatch({ type: 'update_group_value_field', groupId: group.id, itemIndex: itemIdx, field: 'restrictions', value }),
                    location_of_records: (value) =>
                        dispatch({ type: 'update_group_value_field', groupId: group.id, itemIndex: itemIdx, field: 'location_of_records', value }),
                    frequency_of_use: (value) =>
                        dispatch({ type: 'update_group_value_field', groupId: group.id, itemIndex: itemIdx, field: 'frequency_of_use', value }),
                    duplication: (value) =>
                        dispatch({ type: 'update_group_value_field', groupId: group.id, itemIndex: itemIdx, field: 'duplication', value }),
                    time_value: (value) =>
                        dispatch({ type: 'update_group_value_field', groupId: group.id, itemIndex: itemIdx, field: 'time_value', value }),
                    utility_value: (value) =>
                        dispatch({ type: 'update_group_value_field', groupId: group.id, itemIndex: itemIdx, field: 'utility_value', value }),
                    retention_period_active: (value) =>
                        dispatch({ type: 'update_group_value_field', groupId: group.id, itemIndex: itemIdx, field: 'retention_period_active', value }),
                    retention_period_storage: (value) =>
                        dispatch({ type: 'update_group_value_field', groupId: group.id, itemIndex: itemIdx, field: 'retention_period_storage', value }),
                    retention_period_total: (value) =>
                        dispatch({ type: 'update_group_value_field', groupId: group.id, itemIndex: itemIdx, field: 'retention_period_total', value }),
                    disposition_provision: (value) =>
                        dispatch({ type: 'update_group_value_field', groupId: group.id, itemIndex: itemIdx, field: 'disposition_provision', value }),
                });
            });
        });

        return handlerMap;
    }, [state]);

    const groupValueGetInputHandler = (field: keyof RecordItem, groupId: number, itemIdx: number) => {
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            const handler = groupValueInputHandlers.get(`${groupId}-${itemIdx}`)?.[field];
            if (handler) {
                handler(e.target.value);
            }
        };
    };

    // get data for this form
    const fetchFormDataFromDataverse = async () => {
        try {
            if (!form_id) return
            setIsLoadingFormData(true)
            const res = await fetch(`/api/nap-form-one-data/${form_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            const res_data = await res.json()
            if (res_data?.groups?.length) {
                dispatch({ type: 'add_data_from_dataverse', group: res_data.groups })
            }
            setFormData(res_data.groups)
            return res_data;
        } catch (error) {
            console.log('ERROR', error)
        } finally {
            setIsLoadingFormData(false)

        }
    }
    const [isLoadingFormData, setIsLoadingFormData] = React.useState<boolean>(false)
    const [formData, setFormData] = React.useState<[]>()
    React.useEffect(() => {
        (async () => {
            await fetchFormDataFromDataverse()
        })()

    }, [])
    console.log('formData', formData)


    const deleteItemHandler = (id: number, itemIdx: number) => {
        dispatch({ type: 'delete_item', groupId: id, itemIndex: itemIdx })
    }



    const submitForm = async () => {
        try {
            setIsLoadingFormData(true)
            const res = await fetch('/api/nap-form-one-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    {
                        form_id: form_id,
                        groups: state
                    }
                )
            })
            const res_data = await res.json();
            console.log('res_data', res_data)
            if (res_data.success) {
                await fetchFormDataFromDataverse()
                toast({
                    title: 'Successfully Saved',
                    description: 'Your data is now saved',
                    variant: 'default'
                })
            } else {
                toast({
                    title: 'Failed to save',
                    description: 'Please try again',
                    variant: 'destructive'
                })
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsLoadingFormData(false)
        }

    }
    console.log('state>>>>>>>>>>', state)
    return (
        <Layout fixed className="flex flex-col overflow-auto">
            <Layout.Header sticky className="bg-ghost border-solid border-b-[1px]">
                <div className="flex flex-row justify-between gap-5 p-2">
                    <Button className="w-full" variant="outline">
                        <Link className="flex flex-row gap-2" href="/page/records-inventory">
                            <IconChevronLeft size={18} />
                            <p>Done editing</p>
                        </Link>
                    </Button>
                    <Button
                        disabled={isLoadingFormData}
                        className="w-full flex flex-row gap-1"
                        variant="outline"
                        onClick={submitForm}
                    >
                        <IconDeviceFloppy size={15} /> <span>Save</span>
                    </Button>
                </div>
            </Layout.Header>
            <Layout.Body className=" flex flex-1 flex-row">

                <ResizablePanelGroup
                    direction="horizontal"
                    className="flex w-full min-h-[90dvh] rounded-lg "
                >
                    <ResizablePanel className="py-3 pr-2 overflow-y-auto" defaultSize={25}>
                        <div className="flex flex-col gap-5 min-w-fit ">
                            <div className="flex flex-row gap-3 items-start justify-start border-solid border-bottom border-blue-500 ">
                                <div>
                                    <h1 className="text-nowrap">
                                        <span className='font-bold'>Editing NAP Form: </span>
                                        <span className='italic'>{form_id}</span>
                                    </h1>
                                </div>
                            </div>
                            {
                                !isLoadingFormData ? <> {
                                    state && state.map(({ group_title, group_values, id, is_editing, is_single_unit, items }, idx) => (
                                        <div key={idx} className={cn(is_editing && items?.length && 'border-primary', items?.length ? '' : 'border-destructive', 'flex flex-col gap-3 p-3 rounded-lg border-solid border border-solid border-[2px]  mr-3 min-w-[140px]')}>
                                            <div className='w-full flex flex-row gap-2 items-center'>
                                                <Button
                                                    size='sm'
                                                    onClick={() =>
                                                        dispatch({ type: 'toggle_edit_group', groupId: id })
                                                    }
                                                    className='' variant='ghost'>
                                                    {
                                                        is_editing ? <IconCheck /> : <IconPencil />
                                                    }

                                                </Button>
                                                <Input
                                                    disabled={is_single_unit || !is_editing}
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
                                                <Button className='px-0' variant='ghost'
                                                    onClick={() => dispatch({ type: 'remove_group', groupId: id })}>
                                                    <IconX />
                                                </Button>
                                            </div>
                                            <div className='flex flex-row justify-around gap-2 '>
                                                <div className='flex items-center flex-row gap-2 text-[13px]'>
                                                    <Checkbox
                                                        disabled={items?.length != 1 || !is_editing}
                                                        checked={is_single_unit}
                                                        onCheckedChange={(val: boolean) =>
                                                            dispatch({ type: 'toggle_is_single_unit', groupId: id, value: val })
                                                        } />
                                                    {items?.length != 1 || !is_editing ? <span className='text-nowrap font-medium text-gray-400 dark:text-gray-500'>Single Unit</span> : <span className='text-nowrap font-medium'>Single Unit</span>}
                                                </div>
                                                <EditGroupValue
                                                    key={idx}
                                                    group_value={group_values[0]}
                                                    groupId={id}
                                                    handleChange={groupValueGetInputHandler}
                                                    inputHandlers={groupValueInputHandlers}
                                                    isEditing={is_editing} />
                                                <Button disabled={is_single_unit || !is_editing}
                                                    size='sm' onClick={() => dispatch({ type: 'add_item', groupId: id })} className='rounded-lg w-fit flex flex-row gap-2' variant='ghost'>
                                                    <IconPlus size={16} />
                                                    <span>{items?.length} item/s</span>
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                }
                                    <div className='flex flex-col gap-3  mr-3 min-w-[140px]'>
                                        <Button onClick={() => dispatch({ type: 'add_group' })} className='rounded-sm w-full flex flex-row gap-2' variant='outline'>
                                            <IconPlus size={16} />
                                            <span>Add group</span>
                                        </Button>
                                    </div></> :
                                    <div className='flex flex-col gap-3'>
                                        <Skeleton className='h-[80px] w-full rounded-lg' />
                                        <Skeleton className='h-[80px] w-full rounded-lg' />
                                        <Skeleton className='h-[80px] w-full rounded-lg' />
                                    </div>
                            }

                        </div>
                    </ResizablePanel >
                    <ResizableHandle className='' withHandle />
                    <ResizablePanel className='py-3 pl-3 ' defaultSize={75}>
                        {
                            !isLoadingFormData ? <div className='flex flex-col gap-3 '>
                                {state.map((group: GroupItem, groupIdx: number) =>
                                    group.is_editing ? (
                                        <MemoizedGroup
                                            key={group.id}
                                            group={group}
                                            groupIdx={groupIdx}
                                            handleChange={getInputHandler}
                                            inputHandlers={inputHandlers}
                                            deleteItemHandler={deleteItemHandler}
                                        />

                                    ) : null
                                )}

                            </div> :
                                <div className='flex flex-col gap-3'>
                                    <Skeleton className='h-[300px] w-full rounded-lg' />
                                </div>
                        }
                    </ResizablePanel>

                </ResizablePanelGroup>
            </Layout.Body>
        </Layout>

    )
}