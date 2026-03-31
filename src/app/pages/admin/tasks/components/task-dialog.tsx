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
import { TaskSchema } from '../data/task-schema';
import { Skeleton } from '@/components/ui/skeleton';

export default function NewTaskDialog() {
    const [open, setOpen] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const form = useForm<z.infer<typeof TaskSchema>>({
        resolver: zodResolver(TaskSchema),
        defaultValues: {
            task_title: '',
            rcs_roleid: '',
            task_description: '',
            deadline: '',
        },
    })
    async function onSubmit(values: z.infer<typeof TaskSchema>) {
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
        const res = await fetch('/api/admin/task', {
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
            const res = await fetch('/api/admin/role')
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

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button onClick={() => setOpen(true)} className='p-1 gap-2' variant='outline'>
                    <IconPlus size={18} />
                    <p>New Task</p>
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl w-full max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create New Task</DialogTitle>
                    <DialogDescription className='flex flex-row gap-3 items-center'>
                        Create a task or notice for a role.
                    </DialogDescription>
                </DialogHeader>
                {
                    isLoadingRoles ?
                        <div className='flex flex-col gap-5'>
                            <p>Please wait...</p>
                            <Skeleton className='h-[40px] min-w-[400px]rounded-lg' />
                            <Skeleton className='h-[40px] min-w-[400px]rounded-lg' />
                            <Skeleton className='h-[40px] min-w-[400px]rounded-lg' />
                        </div> :
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-3'>
                                <div className="grid gap-4 p-3 border rounded-lg border-secondary grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                                    <FormField
                                        control={form.control}
                                        name="task_title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Task Title</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter Title" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="task_description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Task Description</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter Description" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="deadline"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Deadline of Submission</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="date"
                                                        placeholder="Enter date"
                                                        {...field}
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