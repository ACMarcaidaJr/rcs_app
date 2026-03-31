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
import { UserSchema } from '../data/users-table-schema';
import { Skeleton } from '@/components/ui/skeleton';

export default function NewUsersDialog() {
    const [open, setOpen] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const form = useForm<z.infer<typeof UserSchema>>({
        resolver: zodResolver(UserSchema),
        defaultValues: {
            user_name: '',
            position_title: '',
            given_name: '',
            middle_name: '',
            family_name: '',
            suffix: '',
            sex: '',
        },
    })
    // check if the user is existing.

    async function onSubmit(values: z.infer<typeof UserSchema>) {
        if (!values) return
        setLoading(true)
        const is_user_exists_res = await fetch(`/api/admin/user/is-user-exist/${values.user_name}`)
        const is_user_exists_data = await is_user_exists_res.json()
        const is_user_exists = is_user_exists_data?.data.length;
        if (is_user_exists) {
            toast({
                title: is_user_exists_data?.message_title,
                description: is_user_exists_data?.message,
                variant: "destructive",
            })
            setLoading(false)
            return
        }
        const res = await fetch('/api/admin/user', {
            method: 'POST',
            body: JSON.stringify(values),
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

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button onClick={() => setOpen(true)} className="flex flex-row justify-between w-fit gap-2 hover:cursor-pointer" variant='outline'>
                    <IconPlus size={18} />
                    <p>New User</p>
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl w-full max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create A New User</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-3'>
                        <div className="grid gap-4 p-3 border rounded-lg border-secondary grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                            <FormField
                                control={form.control}
                                name="user_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>User Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="abc@tourism.gov.ph" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="position_title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Position Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter position title" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="given_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>First Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter first name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="middle_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Middle Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter middle name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="family_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Last Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter last name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="suffix"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Suffix</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter suffix" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="sex"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Sex</FormLabel>
                                        <FormControl>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Sex" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem key={1} value="Male">
                                                        Male
                                                    </SelectItem>
                                                    <SelectItem key={2} value="Female">
                                                        Female
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter className="pt-4">
                            <Button disabled={loading} type="submit">
                                {
                                    loading ? "Submitting" : "Submit"
                                }
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )

}
