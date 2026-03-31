"use client"
import React, { useState } from 'react';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select';
import { zodResolver } from "@hookform/resolvers/zod"
import { unknown, z } from "zod"
import { toast } from "@/components/ui/use-toast"
import { Badge } from '@/components/ui/badge'
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/custom/button';
import { useForm } from 'react-hook-form';
import { submitFormSchema } from '../data/submit-form-schema';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { IconArrowRight } from '@tabler/icons-react';

export default function SubmitFormDialog({ headerId, headerGuid }: { headerId?: string, headerGuid?: string }) {
    const [open, setOpen] = React.useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false)
    const [data, setData] = useState<Object>()

    const form = useForm<z.infer<typeof submitFormSchema>>({
        resolver: zodResolver(submitFormSchema),
        defaultValues: {
            rcs_nap_form_one_headerid: headerGuid,
            nap_form_one: undefined,
        }
    })

    async function onSubmit(values: z.infer<typeof submitFormSchema>) {
        if (!values) return
        setLoading(true)
        const formData = new FormData();
        for (const key in values) {
            const typedKey = key as keyof typeof values;
            const value = values[typedKey];
            if (value instanceof File) {
                formData.append(key, value);
            } else {
                formData.append(key, value as string);
            }
        }
        const res = await fetch('/api/submitted-task/creator-submit', {
            method: 'POST',
            body: formData,
        });
        const json_data = await res.json()
        setLoading(false)
        if (!json_data?.error) {
            form.reset()
            setOpen(false)
            toast({
                title: json_data?.message_title,
                description: json_data?.message,
                variant: "default",
            })
        }
        if (json_data?.error) {
            toast({
                title: json_data?.message_title,
                description: json_data?.message,
                variant: "destructive",
            })
        }
    }
    const [isLoadingOffices, setIsLoadingOffices] = React.useState<boolean>(false)
    const [officesData, setOfficesData] = React.useState<any[]>([])

    const fetchOffices = async () => {
        try {

            setIsLoadingOffices(true)
            const res = await fetch('/api/office/office-by-user')
            const data = await res.json()
            setOfficesData(data?.data)

        } catch (error) {
            console.log('error', error)
        } finally {
            setIsLoadingOffices(false)
        }
    }
    const [loadingTask, setLoadingTask] = React.useState<boolean>(false)
    const [taskData, setTaskData] = React.useState<[]>();
    const fetchTasks = async () => {
        try {
            try {
                setLoadingTask(true)
                const res = await fetch('/api/task/custodian')
                const data = await res.json()
                setTaskData(data?.data)

            } catch (error) {
                console.log('error', error)
            } finally {
                setLoadingTask(false)
            }
        } catch (error) {
        }
    }


    React.useEffect(() => {
        if (!open) {
            setTaskData(undefined)
            setOfficesData([])
            form.reset()
            return
        }
        fetchTasks()
        fetchOffices()
    }, [open])
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    className="w-full flex flex-row justify-start items-center gap-2"
                    variant="ghost"
                >
                    <IconArrowRight size={18} />
                    <span>Submit</span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Submit a NAP Form No. 1</DialogTitle>
                    <DialogDescription><span>Submit for this year</span></DialogDescription>
                </DialogHeader>

                {
                    isLoadingOffices && loadingTask ?
                        <div className='flex flex-col gap-5'>
                            <Badge className='w-fit flex gap-2 flex-row'>
                                <Spinner data-icon="inline-start" /> Please wait
                            </Badge>
                            <Skeleton className='h-[40px] min-w-[400px]rounded-lg' />
                            <Skeleton className='h-[40px] min-w-[400px]rounded-lg' />
                            <Skeleton className='h-[40px] min-w-[400px]rounded-lg' />
                        </div> : <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-3'>
                                <FormField
                                    control={form.control}
                                    name="creator_remarks"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Remarks</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Enter remarks" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="office_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Office</FormLabel>
                                            <FormControl>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Office" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {officesData?.map((office: any) => (
                                                            <SelectItem key={office.office_id.rcs_officeid} value={office.office_id.rcs_officeid}>
                                                                {office.office_id?.name_of_office}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="rcs_taskid"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Task</FormLabel>
                                            <FormControl>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select task" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {taskData?.map((a: any) => (
                                                            <SelectItem key={a.task_title} value={a.rcs_taskid}>
                                                                {a.task_title}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="nap_form_one"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Signed NAP Form 1</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="file"
                                                    accept="application/pdf"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) {
                                                            form.setValue("nap_form_one", file, {
                                                                shouldValidate: true,
                                                            });
                                                        }
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <DialogFooter className="pt-4">
                                    <Button disabled={loading} type="submit">Submit</Button>
                                </DialogFooter>
                            </form>

                        </Form>
                }
            </DialogContent>
        </Dialog>
    )
}