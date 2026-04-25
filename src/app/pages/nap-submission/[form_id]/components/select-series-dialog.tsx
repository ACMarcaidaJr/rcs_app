"use client"

import * as React from 'react';
import { Button } from "@/components/custom/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IconDatabaseImport, IconSearch, IconFolder, IconFileText, IconLock, IconPlus } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';

export const SelectSeriesDialog = ({
    onImport,
    currentGroups
}: {
    onImport: (groups: any[]) => void,
    currentGroups: any[]
}) => {
    const [open, setOpen] = React.useState(false)
    const [searchTerm, setSearchTerm] = React.useState("");
    const [selections, setSelections] = React.useState<Record<string, string[]>>({});

    const [seriesData, setSeriesData] = React.useState<any[]>([])
    const [seriesLoading, setSeriesLoading] = React.useState(false)

    React.useEffect(() => {
        if (open) {
            (async () => {
                setSeriesLoading(true)
                try {
                    const res = await fetch(`/api/records-series-title`)
                    const json = await res.json()

                    const rawSeries = json.data.series || [];
                    const rawSingleUnits = json.data.singleUnit || [];

                    // Transform Series into a unified group format
                    const formattedSeries = rawSeries.map((s: any) => ({
                        id: s.rcs_record_series_titleid,
                        group_title: s.record_series_title,
                        is_single_unit: false,
                        items: s.record_series_title_to_item || []
                    }));

                    // Transform Single Units into unified groups (one item per group)
                    const formattedSingleUnits = rawSingleUnits.map((item: any) => ({
                        id: item.rcs_record_series_itemid,
                        group_title: item.series_item_title,
                        is_single_unit: true,
                        items: [item]
                    }));

                    setSeriesData([...formattedSeries, ...formattedSingleUnits])
                } catch (error) {
                    console.error("Fetch error:", error)
                } finally {
                    setSeriesLoading(false)
                }
            })()
        }
    }, [open])

    // Pre-populate selections logic
    React.useEffect(() => {
        if (open && currentGroups && seriesData.length > 0) {
            const initialSelections: Record<string, string[]> = {};

            currentGroups.forEach(group => {
                // Use String() to ensure comparison works regardless of types
                const matchingGroup = seriesData.find(s =>
                    String(s.id) === String(group.rcs_group_id) ||
                    s.group_title === group.group_title
                );

                if (matchingGroup) {
                    const selectedIds = group.items
                        .map((item: any) => item.record_series_item_id)
                        .filter(Boolean)
                        .map((id: any) => String(id)); // Force to string

                    initialSelections[matchingGroup.id] = selectedIds;
                }
            });
            setSelections(initialSelections);
        }
    }, [open, seriesData, currentGroups]);

    const handleToggleItem = (groupId: string, itemId: string) => {
        setSelections(prev => {
            const currentItems = prev[groupId] || [];
            const isSelected = currentItems.includes(itemId);
            const newItems = isSelected ? currentItems.filter(id => id !== itemId) : [...currentItems, itemId];

            if (newItems.length === 0) {
                const { [groupId]: _, ...rest } = prev;
                return rest;
            }
            return { ...prev, [groupId]: newItems };
        });
    };

    const handleImport = () => {
        // 1. Create a map of existing items to preserve their edited values
        const existingItemsMap = new Map();
        currentGroups.forEach(group => {
            group.items.forEach((item: any) => {
                existingItemsMap.set(item.record_series_item_id, item);
            });
        });

        const mappedGroups = seriesData
            .filter(group => selections[group.id])
            .map((group, index) => {
                const selectedItemIds = selections[group.id];

                const mappedItems = group.items
                    .filter((item: any) => selectedItemIds.includes(item.rcs_record_series_itemid))
                    .map((item: any) => {
                        const itemId = item.rcs_record_series_itemid;

                        // 2. Check if this item already exists in our form
                        if (existingItemsMap.has(itemId)) {
                            return existingItemsMap.get(itemId); // RETURN THE EDITED VERSION
                        }

                        // 3. Otherwise, return the fresh "Empty" template for a new item
                        return {
                            record_series_item_id: itemId,
                            records_series_title_and_description: item.series_item_title || '',
                            retention_period_active: item.retention_period_active || '0',
                            retention_period_storage: item.retention_period_storage || '0',
                            retention_period_total: (Number(item.retention_period_active) + Number(item.retention_period_storage)).toString(),
                            disposition_provision: item.disposition_provision || '',
                            restrictions: item.restrictions || 'None',
                            is_nap_grds: item.is_nap_grds === 1,
                            years_or_months: item.years_or_months || 'Years',
                            frequency_of_use: item.frequency_of_use || '',
                            time_value: item.time_value || '',
                            utility_value: item.utility_value || '',
                            duplication: item.duplication || '',
                            // Form placeholders for NEW items only
                            date_period_from: null,
                            date_period_to: null,
                            volume: '',
                            records_medium: '',
                            location_of_records: '',
                        };
                    });

                // 4. Find if the group already exists to keep its unique ID
                const existingGroup = currentGroups.find(g => g.rcs_group_id === group.id);

                return {
                    id: existingGroup ? existingGroup.id : Date.now() + index,
                    rcs_group_id: group.id,
                    group_title: group.group_title,
                    is_editing: false,
                    is_single_unit: group.is_single_unit,
                    items: mappedItems,
                };
            });

        onImport(mappedGroups);
        setOpen(false);
    };
    const totalSelected = Object.values(selections).flat().length;

    const filteredData = seriesData.filter(group =>
        group.group_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.items.some((item: any) =>
            item.series_item_title.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className='w-full border-dashed border-2 flex gap-2 py-6' variant='outline'>
                    <IconPlus size={16} />
                    <span>Import Records Series</span>
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-5xl w-full max-h-[90vh] overflow-y-auto">
                <DialogHeader className="p-6 pb-2 flex-none flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-lg text-primary">
                            <IconDatabaseImport size={22} />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold">Import from Inventory</DialogTitle>
                            <DialogDescription>Choose from established series or standalone items.</DialogDescription>
                        </div>
                    </div>
                    <div className="relative mt-4">
                        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        <Input
                            placeholder="Search titles or items..."
                            className="pl-9 bg-slate-50"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </DialogHeader>

                <ScrollArea className="flex-1 border-y border-slate-100 px-6 bg-slate-50/20">
                    <div className="py-6 space-y-8">
                        {seriesLoading ? (
                            <div className="p-12 text-center">
                                <div className="animate-pulse text-muted-foreground text-sm font-medium italic">Syncing with RCS Inventory...</div>
                            </div>
                        ) : filteredData.length === 0 ? (
                            <div className="p-12 text-center border-2 border-dashed rounded-xl">
                                <p className="text-muted-foreground text-sm">No records found matching your search.</p>
                            </div>
                        ) : filteredData.map((group) => (
                            <div key={group.id} className="space-y-4">
                                {/* Group Header */}
                                <div className="flex items-center gap-3 sticky top-0 bg-white/95 backdrop-blur-md py-3 z-10 px-2 rounded-t-lg border-b border-slate-100 shadow-sm">
                                    <div className={`${group.is_single_unit ? 'bg-blue-500' : 'bg-amber-500'} p-1.5 rounded text-white`}>
                                        {group.is_single_unit ? <IconFileText size={16} /> : <IconFolder size={16} />}
                                    </div>
                                    <h3 className="font-black text-slate-800 uppercase tracking-wider text-[11px]">
                                        {group.group_title}
                                        {group.is_single_unit && <span className="ml-2 text-[9px] text-blue-500 normal-case font-bold bg-blue-50 px-2 py-0.5 rounded-full">Single Unit</span>}
                                    </h3>
                                </div>

                                {/* Items List */}
                                <div className={`ml-4 space-y-4 border-l-2 ${group.is_single_unit ? 'border-blue-200' : 'border-slate-200'} pl-6`}>
                                    {group.items.map((item: any) => {
                                        const isChecked = selections[group.id]?.includes(item.rcs_record_series_itemid);
                                        return (
                                            <div
                                                key={item.rcs_record_series_itemid}
                                                onClick={() => handleToggleItem(group.id, item.rcs_record_series_itemid)}
                                                className={`group relative bg-white border rounded-xl p-5 transition-all cursor-pointer hover:border-primary/50 shadow-sm hover:shadow-md 
                                    ${isChecked ? 'border-primary ring-2 ring-primary/10 bg-primary/[0.01]' : 'border-slate-200'}`}
                                            >
                                                <div className="flex items-start gap-5">
                                                    <div className="pt-1">
                                                        <Checkbox checked={isChecked} onCheckedChange={() => { }} className="h-5 w-5 border-slate-300" />
                                                    </div>

                                                    <div className="flex-1 space-y-4">
                                                        {/* Main Title and Badges */}
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <h4 className="text-base font-bold text-slate-900 leading-tight mb-1">{item.series_item_title}</h4>
                                                                <div className="flex gap-2">
                                                                    <Badge variant="secondary" className="text-[10px] px-2 py-0 bg-slate-100 text-slate-600 border-none uppercase">{item.years_or_months}</Badge>
                                                                    {item.is_nap_grds === 1 && (
                                                                        <Badge className="text-[10px] px-2 py-0 bg-emerald-50 text-emerald-700 border-emerald-100 uppercase">NAP GRDS</Badge>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-tighter">Security Class</span>
                                                                <div className="flex items-center justify-end gap-1 font-bold text-slate-700 uppercase text-xs">
                                                                    <IconLock size={12} className={item.restrictions?.toLowerCase().includes('restricted') ? 'text-red-500' : 'text-emerald-500'} />
                                                                    {item.restrictions || 'Open'}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Technical Metadata Grid */}
                                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-3 gap-x-6 pt-3 border-t border-slate-50">
                                                            <DataField label="Retention (Active/Storage)" value={`${item.retention_period_active || 0} / ${item.retention_period_storage || 0} ${item.years_or_months}`} />
                                                            <DataField label="Total Retention" value={`${item.retention_period_total || 0} ${item.years_or_months}`} />
                                                            <DataField label="Frequency of Use" value={item.frequency_of_use} />
                                                            <DataField label="Medium" value={item.records_medium} />
                                                            <DataField label="Utility Value" value={item.utility_value} />
                                                            <DataField label="Time Value" value={item.time_value} />
                                                            <DataField label="Duplication" value={item.duplication} />
                                                            <DataField label="Disposition Provision" value={item.disposition_provision} className="col-span-2 md:col-span-1" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>

                <DialogFooter className="p-4 bg-white border-t flex items-center justify-between flex-none">
                    <p className="text-xs font-bold text-primary">
                        {totalSelected} records selected
                    </p>
                    <div className="flex gap-2">
                        <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button className="px-8" disabled={totalSelected === 0} onClick={handleImport}>
                            Add to Form
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const DataField = ({ label, value, className = "" }: { label: string, value: string | number, className?: string }) => (
    <div className={`flex flex-col gap-0.5 ${className}`}>
        {/* The Label: Tiny, Bold, Gray */}
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-wide leading-none">
            {label}
        </span>
        {/* The Value: Small, Darker, Bold */}
        <span className="text-xs font-semibold text-slate-700 truncate">
            {value || '---'}
        </span>
    </div>
);