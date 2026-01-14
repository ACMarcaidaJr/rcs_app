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

import { Button } from '@/components/custom/button';
import { useForm } from 'react-hook-form';
import { submitFormSchema } from '../data/submit-form-schema';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';


export default function SubmitFormDialog({ headerId, headerGuid }: { headerId?: string, headerGuid?: string }) {
    const [open, setOpen] = React.useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false)
    const [data, setData] = useState<Object>()

    const form = useForm<z.infer<typeof submitFormSchema>>({
        resolver: zodResolver(submitFormSchema),
        defaultValues: {
            nap_form_one_header_id: headerId,
            rcs_nap_form_one_headerid: headerGuid,
            signed_nap_form_one_file: undefined,
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
        const res = await fetch('/api/submit-signed-nap-form-one', {
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
    const [officesData, setOfficesData] = React.useState<[]>()

    const fetchForms = async () => {
        try {

            setIsLoadingOffices(true)
            const res = await fetch('/api/account-office')
            const data = await res.json()
            setOfficesData(data?.data)

        } catch (error) {
            console.log('error', error)
        } finally {
            setIsLoadingOffices(false)
        }
    }
    const [isLoadingAnnouncements, setIsLoadingAnnouncements] = React.useState<boolean>(false)
    const [announcementsData, setAnnouncementsData] = React.useState<[]>();

    const fetchAnnouncements = async () => {
        try {
            try {
                setIsLoadingAnnouncements(true)
                const res = await fetch('/api/announcement-notice')
                const data = await res.json()
                setAnnouncementsData(data?.data)

            } catch (error) {
                console.log('error', error)
            } finally {
                setIsLoadingAnnouncements(false)
            }
        } catch (error) {
        }
    }


    React.useEffect(() => {
        if (!open) {
            setAnnouncementsData(undefined)
            setOfficesData(undefined)
            form.reset()
            return
        }
        fetchAnnouncements()
        fetchForms()
    }, [open])
    console.log("announcementsData", announcementsData)
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" className='h-full w-full flex items-start justify-start rounded-sm font-normal p-2'>Submit</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Submit a NAP Form No. 1</DialogTitle>
                    <DialogDescription><span>Submit for this year</span></DialogDescription>
                </DialogHeader>

                {
                    isLoadingOffices && isLoadingAnnouncements ?
                        <div className='flex flex-col gap-5'>
                            <p>Please wait...</p>
                            <Skeleton className='h-[40px] min-w-[400px]rounded-lg' />
                            <Skeleton className='h-[40px] min-w-[400px]rounded-lg' />
                            <Skeleton className='h-[40px] min-w-[400px]rounded-lg' />
                        </div> : <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-3'>
                                <FormField
                                    control={form.control}
                                    name="remarks"
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
                                                            <SelectItem key={office.office_id} value={office.office_id}>
                                                                {office.name_of_office}
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
                                    name="rcs_announcement_noticeid"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Compliance Notice</FormLabel>
                                            <FormControl>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Notice" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {announcementsData?.map((ann: any) => (
                                                            <SelectItem key={ann.rcs_announcement_noticeid} value={ann.rcs_announcement_noticeid}>
                                                                {ann.notice_title}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {/* rcs_announcement_notices_id */}
                                {/* <FormField
                                    control={form.control}
                                    name="announcement_notice_id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Compliance Notice</FormLabel>
                                            <FormControl>
                                                <Select
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Notice" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {announcementsData?.map((announcement: any) => (
                                                            <SelectItem key={announcement.rcs_announcement_notices_id} value={announcement.rcs_announcement_notices_id}>
                                                                {announcement.notice_title}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                /> */}

                                <FormField
                                    control={form.control}
                                    name="signed_nap_form_one_file"
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
                                                            form.setValue("signed_nap_form_one_file", file, {
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