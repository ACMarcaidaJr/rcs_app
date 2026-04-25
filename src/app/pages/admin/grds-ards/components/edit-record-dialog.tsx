"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "@/components/ui/use-toast";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/custom/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { IconDeviceFloppy, IconEditCircle, IconAlertCircle, IconFolder, IconFileText } from "@tabler/icons-react"
import { NewRecordSchema } from "../data/new-records-schema"
import * as z from "zod"

interface EditSeriesItemDialogProps {
    item: any | null
    // refreshData?: () => void;
    onSuccess?: () => void
}

type EditFormValues = z.infer<typeof NewRecordSchema>

const UTILITY_OPTIONS = ["Adm", "L", "F", "Arc"];

export function EditSeriesItemDialog({ item, onSuccess }: EditSeriesItemDialogProps) {
    const [open, setOpen] = React.useState<boolean>(false)
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    const form = useForm<EditFormValues>({
        resolver: zodResolver(NewRecordSchema),
        defaultValues: {
            rcs_records_seriesid: null,
            series_item_title: '',
            restrictions: '',
            frequency_of_use: '',
            duplication: '',
            time_value: '',
            utility_value: [],
            retention_period_active: 0,
            retention_period_storage: 0,
            retention_period_total: 0,
            years_or_months: '',
            disposition_provision: '',
            is_nap_grds: false,
        }
    })

    React.useEffect(() => {
        if (item && open) {
            form.reset({
                ...item,
                rcs_records_seriesid: item.record_series_id?.rcs_record_series_titleid,
                series_item_title: item.series_item_title ?? '',
                restrictions: item.restrictions ?? '',
                frequency_of_use: item.frequency_of_use ?? '',
                duplication: item.duplication ?? '',
                time_value: item.time_value ?? '',
                retention_period_active: item.retention_period_active ?? 0,
                retention_period_storage: item.retention_period_storage ?? 0,
                retention_period_total: item.retention_period_total ?? 0,
                years_or_months: item.years_or_months ?? '',
                disposition_provision: item.disposition_provision ?? '',
                is_nap_grds: item.is_nap_grds === 1 || item.is_nap_grds === true,
                utility_value: typeof item.utility_value === 'string'
                    ? JSON.parse(item.utility_value)
                    : item.utility_value || [],
            })
        }
    }, [item, open, form])

    const watchTimeValue = form.watch("time_value")
    React.useEffect(() => {
        if (watchTimeValue === "P") {
            form.setValue("retention_period_active", 0)
            form.setValue("retention_period_storage", 0)
            form.setValue("years_or_months", "permanent")
        } else if (watchTimeValue === "T" && form.getValues("years_or_months") === "permanent") {
            form.setValue("years_or_months", "years")
        }
    }, [watchTimeValue, form])

    async function onSubmit(values: EditFormValues) {
        setIsSubmitting(true)
        try {
            const response = await fetch(`/api/records-series-item/${item.rcs_record_series_itemid}`, {
                method: "PATCH",
                body: JSON.stringify(values),
            })

            if (!response.ok) throw new Error("Update failed")
            toast({ title: "Success", description: "Record updated successfully" })
            if (onSuccess) onSuccess()
            setOpen(false)
        } catch (error) {
            toast({ title: "Error", description: "Failed to update record details", variant: "destructive" })
        } finally {
            setIsSubmitting(false)
        }
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-full flex justify-start gap-2" variant="ghost">
                    <IconEditCircle size={18} />
                    <span>Edit View</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Series Item</DialogTitle>
                    <DialogDescription>Edit the details of this record.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Hidden field to satisfy Zod validation */}
                        <input type="hidden" {...form.register("rcs_records_seriesid")} />
                        {/* subseries */}
                        <div className="flex flex-col">
                            {item.record_series_id?.record_series_title &&
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-md bg-amber-100 dark:bg-amber-900/40">
                                        <IconFolder size={18} className="text-amber-600 dark:text-amber-500" />
                                    </div>
                                    <div className="flex flex-col justify-start">
                                        <span className="text-[11px] font-medium text-muted-foreground uppercase text-start">Record Series</span>
                                        <span className="text-base font-semibold text-foreground">
                                            {item.record_series_id?.record_series_title}
                                        </span>
                                    </div>
                                </div>
                            }
                            {/* subseries */}
                            {item.record_series_id?.record_series_title &&

                                <div className="flex items-start">
                                    <div className="ml-0 flex flex-col items-center">
                                        <div className="w-[2px] h-6 bg-border " />
                                        <div className="w-4 ml-3 h-px bg-border rounded-full" />
                                    </div>
                                </div>
                            }
                            <div className="ml-0 flex-1 p-3 rounded-lg border bg-card flex flex-col gap-4">
                                <div className="flex flex-row gap-2 items-center font-medium mb-2">
                                    <div className="p-2 rounded-md bg-blue-100 dark:bg-blue-900/40 w-fit">
                                        <IconFileText size={18} className="text-blue-600" />
                                    </div>
                                    <span className="text-[11px] font-medium text-muted-foreground uppercase text-start">{item.record_series_id?.record_series_title? 'subseries' : 'single item series'}</span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="series_item_title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Series Item Title</FormLabel>
                                                <FormControl><Input {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="time_value"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Time Value</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select type" />
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
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                                    <FormField
                                        control={form.control}
                                        name="is_nap_grds"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                                                <FormControl>
                                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                                <div className="leading-none">
                                                    <FormLabel>NAP GRDS/ARDS</FormLabel>
                                                    <p className="text-[10px] text-muted-foreground">National Archives Compliant</p>
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="restrictions"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Restrictions</FormLabel>
                                                <FormControl><Input {...field} placeholder="e.g. Confidential" /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="frequency_of_use"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Frequency of Use</FormLabel>
                                                <FormControl><Input {...field} placeholder="Daily, Weekly, etc." /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="duplication"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Duplication</FormLabel>
                                                <FormControl><Input {...field} placeholder="Copy location/medium" /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="utility_value"
                                    render={() => (
                                        <FormItem>
                                            <FormLabel>Utility Value</FormLabel>
                                            <div className="flex flex-wrap gap-4 p-3 border rounded-md">
                                                {UTILITY_OPTIONS.map((option) => (
                                                    <FormField
                                                        key={option}
                                                        control={form.control}
                                                        name="utility_value"
                                                        render={({ field }) => (
                                                            <FormItem key={option} className="flex items-center space-x-2 space-y-0">
                                                                <FormControl>
                                                                    <Checkbox
                                                                        checked={field.value?.includes(option)}
                                                                        onCheckedChange={(checked) => {
                                                                            return checked
                                                                                ? field.onChange([...field.value, option])
                                                                                : field.onChange(field.value?.filter((value) => value !== option))
                                                                        }}
                                                                    />
                                                                </FormControl>
                                                                <FormLabel className="font-normal">{option}</FormLabel>
                                                            </FormItem>
                                                        )}
                                                    />
                                                ))}
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="bg-slate-50 p-4 rounded-lg space-y-4 border border-dashed">
                                    <div className="flex items-center gap-2 text-slate-600 font-semibold text-sm">
                                        <IconAlertCircle size={16} />
                                        Retention Period Details
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="retention_period_active"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Active</FormLabel>
                                                    <FormControl><Input {...field} disabled={watchTimeValue === "P"} /></FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="retention_period_storage"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Storage</FormLabel>
                                                    <FormControl><Input {...field} disabled={watchTimeValue === "P"} /></FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="years_or_months"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Unit</FormLabel>
                                                    <Select onValueChange={field.onChange} value={field.value} disabled={watchTimeValue === "P"}>
                                                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="years">Years</SelectItem>
                                                            <SelectItem value="months">Months</SelectItem>
                                                            <SelectItem value="permanent" disabled>Permanent</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                <FormField
                                    control={form.control}
                                    name="disposition_provision"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Disposition Provision / Remarks</FormLabel>
                                            <FormControl><Textarea {...field} rows={3} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        {/* value={form.getValues('rcs_records_seriesid') || null}  */}
                        {/* 1. Basic Info Section */}
                        <DialogFooter className="sticky bottom-0 bg-white border-t pt-4">
                            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                            <Button type="submit" loading={isSubmitting}>
                                <IconDeviceFloppy className="mr-2 h-4 w-4" />
                                Update Record
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}