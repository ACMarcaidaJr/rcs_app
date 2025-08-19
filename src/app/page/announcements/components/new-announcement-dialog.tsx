"use client"
import { useState, useEffect } from 'react';
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
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select';
import { Button } from "@/components/custom/button";
import { Input } from '@/components/ui/input';
import { IconImageInPicture, IconPlus } from "@tabler/icons-react";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { toast } from "@/components/ui/use-toast"
import { AnnouncementsSchema } from '../data/announcment-schema';
import { Skeleton } from '@/components/ui/skeleton';

export default function NewAnnouncementDialog() {
    const [open, setOpen] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)

    const form = useForm<z.infer<typeof AnnouncementsSchema>>({
        resolver: zodResolver(AnnouncementsSchema),
        defaultValues: {
            notice_title: '',
            rcs_roleid: '',
            notice_description: '',
            inclusive_year_start: '',
            inclusive_year_end: '',
        },
    })
    async function onSubmit(values: z.infer<typeof AnnouncementsSchema>) {
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
        const res = await fetch('/api/announcement-notice', {
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
            form.reset()
            toast({
                title: json_data?.message_title,
                description: json_data?.message,
                variant: "destructive",
            })
        }
    }
    const [isLoadingRoles, setIsLoadingRoles] = useState<boolean>(false)
    const [rolesData, setRolesData] = useState<[]>()

    const fetchRoles = async () => {
        try {

            setIsLoadingRoles(true)
            const res = await fetch('/api/role')
            const data = await res.json()
            setRolesData(data?.data)

        } catch (error) {
            console.log('error', error)
        } finally {
            setIsLoadingRoles(false)
        }
    }

    useEffect(() => {
        if (!open) {
            setRolesData(undefined)
            form.reset()
            return
        }
        fetchRoles()
    }, [open])
    console.log('rolesData',rolesData)
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button onClick={() => setOpen(true)} className="flex flex-row justify-between w-fit gap-2 hover:cursor-pointer" variant='outline'>
                    <p>New Announcement</p>
                    <IconPlus />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl w-full max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create New Annoucements</DialogTitle>
                    <DialogDescription className='flex flex-row gap-3 items-center'>
                        Create an announcement or notice for a role.
                    </DialogDescription>
                </DialogHeader>
                {
                    isLoadingRoles ?
                        <div className='flex flex-col gap-5'>
                            <p>Please wait...</p>
                            <Skeleton className='h-[40px] min-w-[400px]rounded-lg' />
                            <Skeleton className='h-[40px] min-w-[400px]rounded-lg' />
                            <Skeleton className='h-[40px] min-w-[400px]rounded-lg' />
                        </div> : <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-3'>
                                <div className="grid gap-4 p-3 border rounded-lg border-secondary grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                                    <FormField
                                        control={form.control}
                                        name="notice_title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Notice Title</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter Title" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="notice_description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Notice Description</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter Description" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="inclusive_year_start"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Inclusive Year Start</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="Enter Year"
                                                        min="1900"
                                                        max="2100"
                                                        onChange={(e) => {
                                                            const year = e.target.value.replace(/\D/g, '');
                                                            field.onChange(year);
                                                        }}
                                                        value={field.value || ""}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="inclusive_year_end"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Inclusive Year End</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="Enter Year"
                                                        min="1900"
                                                        max="2100"
                                                        onChange={(e) => {
                                                            const year = e.target.value.replace(/\D/g, '');
                                                            field.onChange(year);
                                                        }}
                                                        value={field.value || ""}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="supporting_document"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Supporting Document</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="file"
                                                        accept="application/pdf"
                                                        onChange={(e) => {
                                                            const file = e.target.files?.[0];
                                                            if (file) {
                                                                form.setValue("supporting_document", file, {
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
                          
                                    
                                    <FormField
                                        control={form.control}
                                        name="rcs_roleid"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Role</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        value={field.value}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select Role" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {rolesData?.map((role: any) => (
                                                                <SelectItem key={role.rcs_roleid} value={role.rcs_roleid}>
                                                                    {role.role_name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                </div>
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