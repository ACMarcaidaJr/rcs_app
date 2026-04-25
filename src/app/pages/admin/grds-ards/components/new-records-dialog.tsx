"use client"
import * as React from 'react';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from "@/components/custom/button";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { IconExclamationCircle, IconExclamationMark, IconImageInPicture, IconPlus } from "@tabler/icons-react";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { MultiCombobox, SingleCombobox } from '@/components/ui/combobox';

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { toast } from "@/components/ui/use-toast";

import { NewRecordSchema, NewSeriesSchema } from '../data/new-records-schema';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

export default function NewRecordDialog({ fetchData, className, office }: { fetchData?: () => void; className?: string; office: any }) {
    const recordsSeriesForm = useForm<z.infer<typeof NewSeriesSchema>>({
        resolver: zodResolver(NewSeriesSchema),
        defaultValues: {
            record_series_title: '',

        }
    })

    const seriesItemForm = useForm<z.infer<typeof NewRecordSchema>>({
        resolver: zodResolver(NewRecordSchema),
        defaultValues: {
            rcs_records_seriesid: '',
            series_item_title: '',
            restrictions: '',
            frequency_of_use: '',
            duplication: '',
            time_value: '',
            utility_value: [],
            retention_period_active: 0,
            retention_period_storage: 0,
            retention_period_total: 0,
            years_or_months: 'years',
            disposition_provision: '',
            is_nap_grds: false,
        }
    })

    const [open, setOpen] = React.useState<boolean>(false)

    const [loadingSubmitSeries, setLoadingSubmitSeries] = React.useState<boolean>(false)
    async function onSubmitSerriesTitle(values: z.infer<typeof NewSeriesSchema>) {
        console.log("values", values)
        if (!values) return
        setLoadingSubmitSeries(true)
        try {
            const res = await fetch('/api/admin/records-series-title', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ office_guid: office.id, ...values }),
            })
            const json_data = await res.json()

            if (!json_data?.error) {
                recordsSeriesForm.reset()
                toast({
                    title: json_data?.message_title || "Success",
                    description: json_data?.message,
                    variant: "default",
                })
            } else {
                toast({
                    title: json_data?.message_title || "Error",
                    description: json_data?.message,
                    variant: "destructive",
                })
            }
        } catch (error) {
            console.error("Submission Error:", error)
            toast({
                title: "Connection Error",
                description: "Failed to reach the server. Please try again later.",
                variant: "destructive",
            })
        } finally {
            await fetchRecordsSeries()
            setLoadingSubmitSeries(false)
        }
    }

    const [recordSeries, setRecordSeries] = React.useState<any[]>()
    const [loading, setLoading] = React.useState<boolean>(false)

    async function onSubmitNewSubSeriesItem(values: z.infer<typeof NewRecordSchema>) {
        console.log("Payload to API:", JSON.stringify(values, null, 2));
        if (!values) return

        setLoading(true)

        try {
            const res = await fetch('/api/admin/records-series-item', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ office_guid: office.id, ...values }),
            })
            const json_data = await res.json()
            if (!json_data?.error) {
                if (json_data.data) {
                    setRecordSeries(json_data.data)
                }
                seriesItemForm.reset()
                setOpen(false)
                toast({
                    title: json_data?.message_title || "Success",
                    description: json_data?.message,
                    variant: "default",
                })
            } else {
                toast({
                    title: json_data?.message_title || "Error",
                    description: json_data?.message,
                    variant: "destructive",
                })
            }
        } catch (error) {
            toast({
                title: "Submission Failed",
                description: "An unexpected error occurred while creating the record.",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
            if (fetchData) fetchData()
        }
    }

    // combobox
    const utility_value_options = [
        "Adm",
        "F",
        "L",
        "Arc",
    ] as const

    // GET SERIES TITLE
    const [recordSeriesTitle, setRecordSeriesTitle] = React.useState<{ id: string, label: string }[]>([])
    const [loadingSeries, setLoadingSeries] = React.useState<boolean>(false)

    const fetchRecordsSeries = async () => {
        setLoadingSeries(true)
        try {
            const res = await fetch(`/api/admin/records-series-title/as-option/${office.id}`)
            const json_data = await res.json()
            if (json_data?.data) {
                const formatted = json_data.data.map((item: any) => ({
                    id: item.rcs_record_series_titleid,
                    label: item.record_series_title
                }))
                setRecordSeriesTitle(formatted)
            }
        } catch (error) {
            console.error("Fetch Error:", error)
        } finally {
            setLoadingSeries(false)
        }
    }
    React.useEffect(() => {
        if (open) {
            fetchRecordsSeries()
        }
    }, [open])
    const watchTimeValue = seriesItemForm.watch("time_value");
    const watchActive = seriesItemForm.watch("retention_period_active");
    const watchStorage = seriesItemForm.watch("retention_period_storage");

    React.useEffect(() => {
        const total = (Number(watchActive) || 0) + (Number(watchStorage) || 0);
        seriesItemForm.setValue("retention_period_total", total);
    }, [watchActive, watchStorage, seriesItemForm]);

    React.useEffect(() => {
        if (watchTimeValue === "P") {
            seriesItemForm.setValue("retention_period_active", 0);
            seriesItemForm.setValue("retention_period_storage", 0);
            seriesItemForm.setValue("retention_period_total", 0);
            seriesItemForm.setValue("years_or_months", "permanent");
        } else if (seriesItemForm.getValues("years_or_months") === "permanent") {
            seriesItemForm.setValue("years_or_months", "years");
        }
    }, [watchTimeValue, seriesItemForm]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button onClick={() => setOpen(true)} className={cn('gap-2', className)} variant="default">
                    <IconPlus size={18} />
                    <span className="hidden sm:block">Record</span>
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-4xl w-full max-h-[95vh] flex flex-col p-0 overflow-hidden">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle className="text-2xl">Create New Record Series</DialogTitle>
                    <DialogDescription>
                        Manage and categorize record series for your office.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto px-6 py-2 space-y-8">
                    {/* SECTION 1: QUICK ADD SERIES TITLE */}
                    <section className="space-y-4">
                        <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
                            <IconPlus size={18} />
                            <span>Step 1: Define Series Category (Optional)</span>
                        </div>
                        <Form {...recordsSeriesForm}>
                            <form
                                onSubmit={recordsSeriesForm.handleSubmit(onSubmitSerriesTitle)}
                                className="flex items-end gap-3 p-4 bg-secondary/20 rounded-xl border border-secondary/50"
                            >
                                <FormField
                                    control={recordsSeriesForm.control}
                                    name="record_series_title"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel className="text-xs uppercase tracking-wider text-muted-foreground">New Series Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g. Administrative Records" className="bg-background" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button disabled={loadingSubmitSeries} type="submit" size="sm" variant="default">
                                    {loadingSubmitSeries ? <Spinner /> : "Create"}
                                </Button>
                            </form>
                        </Form>
                    </section>

                    <Separator />

                    {/* SECTION 2: SERIES ITEM DETAILS */}
                    <section className="space-y-6 pb-6">
                        <div className="flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
                            <IconExclamationCircle size={18} />
                            <span>Step 2: Record Item Specifications</span>
                        </div>

                        <Form {...seriesItemForm}>
                            <form onSubmit={seriesItemForm.handleSubmit(onSubmitNewSubSeriesItem)} className="space-y-6">

                                {/* Main Selection */}
                                <FormField
                                    control={seriesItemForm.control}
                                    name="rcs_records_seriesid"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Parent Record Series</FormLabel>
                                            <FormControl>
                                                <SingleCombobox
                                                    options={recordSeriesTitle}
                                                    value={field.value ?? ''}
                                                    onChange={field.onChange}
                                                    placeholder="Search and select a series category..."
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {/* Technical Info Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                                    <FormField
                                        control={seriesItemForm.control}
                                        name="series_item_title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Item Title</FormLabel>
                                                <FormControl><Input placeholder="Enter Title" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={seriesItemForm.control}
                                        name="restrictions"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Restriction</FormLabel>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Restriction" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="Open Access">Open Access</SelectItem>
                                                        <SelectItem value="Restricted">Restricted</SelectItem>
                                                        <SelectItem value="Top Secret">Top Secret</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={seriesItemForm.control}
                                        name="frequency_of_use"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Frequency of Use</FormLabel>
                                                <FormControl><Input placeholder="e.g. Daily" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={seriesItemForm.control}
                                        name="duplication"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Duplication / Office Location</FormLabel>
                                                <FormControl><Input placeholder="Enter Department" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Values Row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={seriesItemForm.control}
                                        name="time_value"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Time Value</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Value" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="T">Temporary</SelectItem>
                                                        <SelectItem value="P">Permanent</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={seriesItemForm.control}
                                        name="utility_value"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Utility Value</FormLabel>
                                                <FormControl>
                                                    <MultiCombobox
                                                        options={utility_value_options}
                                                        value={field.value || []}
                                                        onChange={(val) => {
                                                            field.onChange(val);
                                                        }}
                                                        placeholder="Select values"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                {/* Retention Period Card */}
                                <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
                                    <div className="bg-secondary/30 px-4 py-2 border-b">
                                        <span className="text-xs font-bold uppercase text-muted-foreground">
                                            Retention Period
                                        </span>
                                    </div>
                                    <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <FormField
                                            control={seriesItemForm.control}
                                            name="retention_period_active"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs">Active</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            disabled={watchTimeValue === "P"}
                                                            placeholder={watchTimeValue === "P" ? "N/A" : "0"}
                                                            {...field}
                                                            onChange={(e) => field.onChange(e.target.valueAsNumber || 0)} // Force number type
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={seriesItemForm.control}
                                            name="retention_period_storage"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs">Storage</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            disabled={watchTimeValue === "P"}
                                                            placeholder={watchTimeValue === "P" ? "N/A" : "0"}
                                                            {...field}
                                                            onChange={(e) => field.onChange(e.target.valueAsNumber || 0)} // Force number type
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={seriesItemForm.control}
                                            name="years_or_months"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-xs">Unit</FormLabel>
                                                    <Select onValueChange={field.onChange} value={watchTimeValue === "P" ? "permanent" : field.value} disabled={watchTimeValue === "P"}>
                                                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="years">Years</SelectItem>
                                                            <SelectItem value="months">Months</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    {watchTimeValue === "P" && (
                                        <div className="px-4 py-2 bg-blue-50 dark:bg-blue-950/30">
                                            <p className="text-[10px] text-blue-600 dark:text-blue-400 font-medium italic">
                                                * Permanent records do not require duration inputs.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <FormField
                                    control={seriesItemForm.control}
                                    name="disposition_provision"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Disposition Provision / Remarks</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Enter detailed remarks here..." className="min-h-[100px]" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={seriesItemForm.control}
                                    name="is_nap_grds"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-xl border p-4 bg-muted/30">
                                            <FormControl>
                                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                            </FormControl>
                                            <div className="space-y-1">
                                                <FormLabel className="font-semibold cursor-pointer">Follow NAP GRDS/ARDS</FormLabel>
                                                <p className="text-xs text-muted-foreground">Check if this series follows National Archives of the Philippines schedules.</p>
                                            </div>
                                        </FormItem>
                                    )}
                                />

                                {/* This hidden submit button is important to allow the "Enter" key to submit the form */}
                                <button type="submit" className="hidden" />
                            </form>
                        </Form>
                    </section>
                </div>

                <DialogFooter className="p-6 bg-background border-t">
                    <div className=" items-center gap-2">
                        <Button variant="ghost" type="button" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button
                            disabled={loading}
                            onClick={seriesItemForm.handleSubmit(onSubmitNewSubSeriesItem)}
                        >
                            {loading ? <><Spinner className="mr-2" /> Submitting...</> : "Save New Record"}
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}