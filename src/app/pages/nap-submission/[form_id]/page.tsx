
'use client'
import { Layout } from '@/components/custom/layout'
import { Button } from "@/components/custom/button";
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox';
import { IconClipboardList, IconClock, IconFileText, IconFolder, IconSearch } from "@tabler/icons-react"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import { dateToEpoch } from '@/lib/format-date';

import { EditGroupValue } from './components/edit-group-value';
import { useMemo } from 'react';
import { IconCheck, IconPlus, IconChevronLeft, IconPencil, IconX, IconDeviceFloppy, IconRefresh, IconFileTypePdf } from "@tabler/icons-react"

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
import PreviewNapFormOneDialog from '../components/preview-nap-form-one';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { sanitizeNapFormData } from '@/lib/sanitize-nap-form-data';
import { Textarea } from '@/components/ui/textarea';
import { SelectSeriesDialog } from './components/select-series-dialog';
type State = GroupItem[];

type Action =
    | { type: 'add_data_from_dataverse'; groups: GroupItemFromDataverse[] }
    | { type: 'add_multiple_groups_from_rcs'; groups: GroupItem[] }
    | { type: 'add_group' }
    | { type: 'add_item'; groupId: number }
    | { type: 'toggle_edit_group'; groupId: number }
    | {
        type: 'update_field';
        groupId: number;
        itemIndex: number;
        field: keyof RecordItem;
        value: string | number | null;
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
    // createInitialGroup(1, true)
    const [state, dispatch] = useReducer(reducer, []);
    function reducer(state: State, action: Action): State {
        switch (action.type) {
            case 'add_multiple_groups_from_rcs':
                return action.groups;

            case 'add_data_from_dataverse':
                return action.groups.map((group: GroupItemFromDataverse) => ({
                    ...group,
                    items: group.items.map(pickOnlyRecordItemFields),
                }));


            case 'add_item': {
                return state.map(group =>
                    group.id === action.groupId
                        ? {
                            ...group,
                            items: [
                                ...group.items,
                            ],
                            // ...group,
                            // items: [
                            //     ...group.items,
                            //     { ...group.group_values[0] } // Spread here to create a new object reference
                            // ],
                            group_title: group.items.length > 1 ? group.group_title : '',
                            is_single_unit: group.items.length > 2 ? false : true,
                        }
                        : group
                );
            }
            case 'update_field': {
                const { groupId, itemIndex, field, value } = action;
                return state.map((group) =>
                    group.id === groupId
                        ? {
                            ...group,
                            items: group.items.map((item, idx) =>
                                idx === itemIndex
                                    ? {
                                        ...item,
                                        [field]: value,
                                        ...(field === 'time_value' && value === "P"
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
                                    }
                                    : item
                            ),
                        }
                        : group
                );
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
                            group_title: group.items.length > 2 ? group.group_title : '',
                            is_single_unit: group.items.length > 2 ? false : true
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
                    date_period_from: (value) =>
                        dispatch({ type: 'update_field', groupId: group.id, itemIndex: itemIdx, field: 'date_period_from', value }),
                    date_period_to: (value) =>
                        dispatch({ type: 'update_field', groupId: group.id, itemIndex: itemIdx, field: 'date_period_to', value }),
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
                    is_full_date: (value) =>
                        dispatch({ type: 'update_field', groupId: group.id, itemIndex: itemIdx, field: 'is_full_date', value }),
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
                dispatch({ type: 'add_data_from_dataverse', groups: res_data.groups })
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
    console.log('formData from database>>>>', formData)


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
    const [isChanges, setIsChanges] = React.useState<boolean>(false)
    // detect changes
    React.useEffect(() => {
        setIsChanges(JSON.stringify(state ?? "").length !== JSON.stringify(formData ?? "").length)
    }, [state, formData])

    const downloadAsPDF = async () => {
        window.open(`/api/nap-form-one-output/${form_id}`, '_blank');
    }
    return (
        <Layout className='relative h-screen flex flex-col'>
            <Layout.Header sticky className="flex flex-wrap h-fit items-center justify-between px-4 border-b bg-background">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/pages/nap-submission">nap-form-one</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage className="font-mono">{form_id}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <div className="flex flex-row items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                        <Link className="flex flex-row gap-2 items-center" href="/pages/nap-submission">
                            <IconChevronLeft size={14} />
                            <span>Back</span>
                        </Link>
                    </Button>
                    <div className="w-[1px] h-6 bg-border mx-1" />
                    <Button
                        size="sm"
                        variant='outline'
                        className="gap-2"
                        disabled={!isChanges}
                        onClick={fetchFormDataFromDataverse}>
                        <IconRefresh size={14} /> <span>Refresh</span>
                    </Button>
                    <Button
                        size="sm"
                        variant='outline'
                        className="gap-2"
                        disabled={isLoadingFormData}
                        onClick={downloadAsPDF}>
                        <IconFileTypePdf size={14} className="text-destructive" /> <span>Preview</span>
                    </Button>
                    <Button
                        size="sm"
                        disabled={isLoadingFormData}
                        className="gap-2 bg-primary text-primary-foreground"
                        onClick={submitForm}>
                        <IconDeviceFloppy size={14} />
                        <span>Save</span>
                    </Button>
                </div>
            </Layout.Header>

            <Layout.Body className="p-0 overflow-hidden bg-background">
                <ResizablePanelGroup direction="horizontal" className="min-h-[90vh]">

                    {/* --- SIDEBAR: SERIES LIST --- */}
                    <ResizablePanel defaultSize={35} minSize={5} maxSize={75} className="bg-muted/30">
                        <div className="flex flex-col h-full border-r border-border min-w-fit">
                            <div className="p-4 border-b bg-card flex flex-row justify-between items-center">
                                <p className='font-bold text-sm tracking-tight text-foreground'>Records Series Title</p>
                                {isLoadingFormData && <Badge variant="secondary" className="animate-pulse">Loading...</Badge>}
                            </div>

                            <div className="flex-1 overflow-y-auto p-3 space-y-3">
                                {!isLoadingFormData ? (
                                    <>
                                        {state && state.map((group, idx) => (
                                            <div
                                                key={group.id}
                                                className={cn(
                                                    'flex flex-col gap-3 p-3 rounded-lg border-2 transition-all',
                                                    group.is_editing
                                                        ? 'border-primary bg-card shadow-sm'
                                                        : 'border-border bg-card/50 text-muted-foreground',
                                                    !group.items?.length && 'border-destructive/50'
                                                )}>
                                                <div className='w-full flex flex-row gap-2 items-start'>
                                                    <Button
                                                        size='sm'
                                                        variant='ghost'
                                                        className={cn("h-8 w-8 p-0", group.is_editing ? "text-primary" : "text-muted-foreground/60")}
                                                        onClick={() => dispatch({ type: 'toggle_edit_group', groupId: group.id })}>
                                                        {group.is_editing ? <IconCheck size={18} /> : <IconPencil size={18} />}
                                                    </Button>

                                                    <div className="flex flex-col gap-3 flex-1">
                                                        <div className="flex items-center gap-2">
                                                            {/* <Label className="text-nowrap text-[11px] uppercase text-muted-foreground font-bold tracking-wider">
                                                                Series Title
                                                            </Label> */}

                                                            {group.is_single_unit ? (
                                                                <Badge
                                                                    variant="outline"
                                                                    className="h-5 text-nowrap text-[9px] px-2 bg-amber-500/10 text-amber-600 border-amber-500/20 font-bold uppercase tracking-tight"
                                                                >
                                                                    Single Series
                                                                </Badge>
                                                            ) : (
                                                                <Badge
                                                                    variant="outline"
                                                                    className="h-5 text-nowrap text-[9px] px-2 bg-blue-500/10 text-blue-600 border-blue-500/20 font-bold uppercase tracking-tight"
                                                                >
                                                                    Series / Subseries
                                                                </Badge>
                                                            )}
                                                            <Badge
                                                                variant="secondary"
                                                                className="h-5 text-[10px] px-2 font-medium text-nowrap"
                                                            >
                                                                {group.items?.length || 0} {group.items?.length === 1 ? 'Item' : 'Items'}
                                                            </Badge>
                                                        </div>

                                                        <div
                                                            className={cn(
                                                                "relative flex items-center min-h-11 w-full rounded-md border px-3 py-2 transition-colors",
                                                                group.is_single_unit
                                                                    ? "bg-amber-500/5 border-amber-500/20 border-l-4 border-l-amber-500"
                                                                    : "bg-blue-500/5 border-blue-500/20 border-l-4 border-l-blue-500"
                                                            )}
                                                        >
                                                            <div className="mr-3">
                                                                {group.is_single_unit ? (
                                                                    <IconFileText size={18} className="text-amber-500" />
                                                                ) : (
                                                                    <IconFolder size={18} className="text-blue-500" />
                                                                )}
                                                            </div>

                                                            <span className={cn(
                                                                "text-sm text-wrap font-semibold",
                                                                group.is_single_unit ? "text-amber-700 dark:text-amber-400" : "text-blue-700 dark:text-blue-400"
                                                            )}>
                                                                {group.group_title || "Untitled Record"}
                                                            </span>

                                                            <div className="ml-auto flex flex-col items-center ">
                                                                <span className="p-0 text-[9px] font-medium text-muted-foreground/50 uppercase italic text-nowrap">
                                                                    Read Only
                                                                </span>
                                                                <IconClock size={15} className="text-muted-foreground/40 p-0" />
                                                            </div>
                                                        </div>
                                                        <p className="text-[11px] text-muted-foreground/70 italic">
                                                            {group.is_single_unit
                                                                ? "This is a standalone record unit."
                                                                : "This series contains multiple subseries items or folders."}
                                                        </p>
                                                    </div>
                                                    <Button
                                                        variant='ghost'
                                                        className='h-8 w-8 p-0 text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10'
                                                        onClick={() => dispatch({ type: 'remove_group', groupId: group.id })}>
                                                        <IconX size={16} />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                        <SelectSeriesDialog
                                            onImport={(importedGroups) => {
                                                dispatch({ type: 'add_multiple_groups_from_rcs', groups: importedGroups });
                                            }}
                                            currentGroups={state}
                                        />
                                    </>
                                ) : (
                                    <div className='flex flex-col gap-3'>
                                        <div className="h-20 w-full bg-muted animate-pulse rounded-lg" />
                                        <div className="h-20 w-full bg-muted animate-pulse rounded-lg" />
                                        <div className="h-20 w-full bg-muted animate-pulse rounded-lg" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </ResizablePanel>

                    <ResizableHandle withHandle />

                    {/* --- MAIN CONTENT: DETAIL EDITOR --- */}
                    <ResizablePanel defaultSize={65} minSize={25} className="bg-background">
                        <div className="h-full overflow-y-auto p-6">
                            {!isLoadingFormData ? (
                                <div className='max-w-4xl mx-auto'>
                                    {state.some(g => g.is_editing) ? (
                                        <div className="flex flex-col gap-6">
                                            {state.map((group, groupIdx) =>
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
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground border-2 border-dashed border-border rounded-xl mt-10">
                                            <IconPencil size={48} className="mb-4 text-muted-foreground/50" />
                                            <p className="text-sm">Select a Records Series from the sidebar to begin editing.</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className='max-w-4xl mx-auto flex flex-col gap-4'>
                                    <div className="h-10 w-48 bg-muted animate-pulse rounded" />
                                    <div className="h-[400px] w-full bg-muted/50 animate-pulse rounded-xl" />
                                </div>
                            )}
                        </div>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </Layout.Body>
        </Layout>
    )
}