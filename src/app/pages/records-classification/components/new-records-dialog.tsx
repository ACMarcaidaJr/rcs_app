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


export default function NewRecordDialog({ fetchData }: { fetchData?: () => void; }) {
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
            retention_period_active: '',
            retention_period_storage: '',
            retention_period_total: '',
            years_or_months: '',
            disposition_provision: '',
            is_nap_grds: false,
        }
    })

    const [open, setOpen] = React.useState<boolean>(false)

    const [loadingSubmitSeries, setLoadingSubmitSeries] = React.useState<boolean>(false)
    async function onSubmitSerriesTitle(values: z.infer<typeof NewSeriesSchema>) {
        if (!values) return
        setLoadingSubmitSeries(true)
        try {
            const res = await fetch('/api/records-series-title', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
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
        console.log('VALUES', values)
        if (!values) return

        setLoading(true)

        try {
            const res = await fetch('/api/records-series-item', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
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
        "Administrative",
        "Fiscal",
        "Legal",
        "Archival",
    ] as const

    // GET SERIES TITLE
    const [recordSeriesTitle, setRecordSeriesTitle] = React.useState<{ id: string, label: string }[]>([])
    const [loadingSeries, setLoadingSeries] = React.useState<boolean>(false)

    const fetchRecordsSeries = async () => {
        setLoadingSeries(true)
        try {
            const res = await fetch('/api/records-series-title/as-option')
            const json_data = await res.json()
            console.log("Raw Dataverse Data:", json_data)
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
    React.useEffect(() => {
        if (watchTimeValue === "P") {
            seriesItemForm.setValue("retention_period_active", "");
            seriesItemForm.setValue("retention_period_storage", "");
            seriesItemForm.setValue("years_or_months", "permanent");
        }
    }, [watchTimeValue, seriesItemForm]);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button onClick={() => setOpen(true)} className="flex flex-row justify-between w-fit gap-2 hover:cursor-pointer" variant='default'>
                    <IconPlus size={18} />
                    <p>Record</p>
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl w-full max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create new Record Series</DialogTitle>
                    <DialogDescription className='flex flex-row gap-3 items-center'>
                        <span>Create Record Series for your office</span>
                    </DialogDescription>
                </DialogHeader>
                <Form {...recordsSeriesForm}>
                    <form onSubmit={recordsSeriesForm.handleSubmit(onSubmitSerriesTitle)} className='flex flex-col gap-3'>
                        <div className="flex flex-col gap-2 p-3 border rounded-lg border-secondary rounded-lg">
                            <div className="flex items-center gap-2 text-muted-foreground italic">
                                <IconExclamationCircle size={16} className="" />
                                <span>Add Record Series Title</span>
                            </div>
                            <div className='flex flex-row gap-2 items-end w-full'>
                                <FormField
                                    control={recordsSeriesForm.control}
                                    name="record_series_title"
                                    render={({ field }) => (
                                        <FormItem className="flex-1">
                                            <FormLabel>Records Series Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter Record Series Title" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button disabled={loadingSubmitSeries} type="submit">
                                    {
                                        loadingSubmitSeries ? <div className='flex flex-row gap-2'> <Spinner /> <span>Adding...</span></div> : <span>Add</span>
                                    }
                                </Button>
                            </div>
                        </div>
                    </form>
                </Form>
                <Form {...seriesItemForm}>
                    <form onSubmit={seriesItemForm.handleSubmit(onSubmitNewSubSeriesItem)} className='flex flex-col gap-3'>
                        <div className="flex flex-col gap-2 p-3 border rounded-lg border-secondary rounded-lg">
                            <div className="flex items-center gap-2 text-muted-foreground italic">
                                <IconExclamationCircle size={16} className="" />
                                <span>Select if it includes in a series</span>
                            </div>
                            <FormField
                                control={seriesItemForm.control}
                                name="rcs_records_seriesid"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Record Series Title</FormLabel>
                                        <FormControl>
                                            <SingleCombobox
                                                options={recordSeriesTitle}
                                                value={field.value}
                                                onChange={field.onChange}
                                                placeholder="Search and select a series..."
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex flex-col gap-2 p-3 border rounded-lg border-secondary rounded-lg">
                            <div className="flex items-center gap-2 text-muted-foreground italic">
                                <IconExclamationCircle size={16} className="" />
                                <span>Record Series Item Title and Description</span>
                            </div>
                            <div className="grid gap-4 p-3  grid-cols-1 md:grid-cols-2 xl:grid-cols-2">
                                <FormField
                                    control={seriesItemForm.control}
                                    name="series_item_title"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Series Item Title</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter Title" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={seriesItemForm.control}
                                    name="restrictions"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Restrictions</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter Restriction Details" {...field} />
                                            </FormControl>
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
                                            <FormControl>
                                                <Input placeholder='Frequency of Use' type='text' {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={seriesItemForm.control}
                                    name="duplication"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Duplication</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter Department/Division" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={seriesItemForm.control}
                                    name="time_value"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Time Value</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Time Value" />
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
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Utility Value</FormLabel>
                                            <FormControl>
                                                <MultiCombobox
                                                    options={utility_value_options}
                                                    value={field.value || []}
                                                    onChange={field.onChange}
                                                    placeholder="Select utility values"
                                                />
                                            </FormControl>
                                            {/* <FormDescription>
                                                Select all applicable values for this record.
                                            </FormDescription> */}
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex flex-col gap-2 p-3 border rounded-lg border-secondary">
                                    <div className="flex items-center gap-2 text-muted-foreground italic">
                                        <IconExclamationCircle size={16} />
                                        <span>Retention Period (Classification Phase)</span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border rounded-md overflow-hidden">
                                        {/* Active Period */}
                                        <FormField
                                            control={seriesItemForm.control}
                                            name="retention_period_active"
                                            render={({ field }) => (
                                                <FormItem className="space-y-0 border-r last:border-r-0">
                                                    <FormLabel className="px-3 py-2 text-xs font-semibold bg-secondary/30 block">Active</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type='number'
                                                            placeholder={watchTimeValue === "P" ? "N/A" : "Years/Months"}
                                                            className="border-0 rounded-none focus-visible:ring-0 disabled:bg-slate-50 disabled:cursor-not-allowed"
                                                            disabled={watchTimeValue === "P"}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage className="p-2" />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Storage Period */}
                                        <FormField
                                            control={seriesItemForm.control}
                                            name="retention_period_storage"
                                            render={({ field }) => (
                                                <FormItem className="space-y-0 border-r last:border-r-0">
                                                    <FormLabel className="px-3 py-2 text-xs font-semibold bg-secondary/30 block">Storage</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type='number'
                                                            placeholder={watchTimeValue === "P" ? "N/A" : "Years/Months"}
                                                            className="border-0 rounded-none focus-visible:ring-0 disabled:bg-slate-50 disabled:cursor-not-allowed"
                                                            disabled={watchTimeValue === "P"}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage className="p-2" />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Duration Type / Unit Selector */}
                                        <FormField
                                            control={seriesItemForm.control}
                                            name="years_or_months"
                                            render={({ field }) => (
                                                <FormItem className="space-y-0">
                                                    <FormLabel className="px-3 py-2 text-xs font-semibold bg-secondary/30 block">Duration Unit</FormLabel>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        value={watchTimeValue === "P" ? "permanent" : field.value}
                                                        disabled={watchTimeValue === "P"}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className="border-0 rounded-none shadow-none focus:ring-0 disabled:opacity-100 disabled:bg-slate-50">
                                                                <SelectValue placeholder="Select Unit" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="years">Years</SelectItem>
                                                            <SelectItem value="months">Months</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage className="p-2" />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    {watchTimeValue === "P" && (
                                        <p className="text-[10px] text-blue-600 font-medium px-1">
                                            *Permanent records do not require active or storage durations.
                                        </p>
                                    )}
                                </div>
                                <FormField
                                    control={seriesItemForm.control}
                                    name="disposition_provision"
                                    render={({ field }) => (
                                        <FormItem className=''>
                                            <FormLabel>Disposition Provision / Remarks</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Enter number" {...field} />
                                                {/* <Input placeholder="Enter number" {...field} /> */}
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={seriesItemForm.control}
                                    name="is_nap_grds"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel className="text-sm font-medium">
                                                    NAP GRDS/ARDS
                                                </FormLabel>
                                                <p className="text-[10px] text-muted-foreground">
                                                    Check if this series follows the National Archives of the Philippines General/Agency Records Disposition Schedule.
                                                </p>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <DialogFooter className="pt-4 flex flex-row gap-2">
                            <Button disabled={loading} type="submit">{
                                loading ? <div className='flex flex-row gap-2'> <Spinner /> <span>Submitting...</span></div> : <span>Submit</span>
                            }</Button>
                            <Button variant="outline" type='button' onClick={() => setOpen(false)} >Cancel</Button>
                        </DialogFooter>

                    </form>
                </Form>
            </DialogContent>
        </Dialog >
    );
}