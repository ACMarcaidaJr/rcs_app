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
import { Textarea } from "@/components/ui/textarea"
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
import { RoleSchema } from '../data/roles-table-schema';
import { Skeleton } from '@/components/ui/skeleton';


export default function NewRoleDialog() {
    const [open, setOpen] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const form = useForm<z.infer<typeof RoleSchema>>({
        resolver: zodResolver(RoleSchema),
        defaultValues: {
            role_name: '',
            description: '',
        },
    })
    async function onSubmit(values: z.infer<typeof RoleSchema>) {
        if (!values) return
        setLoading(true)
        const res = await fetch('/api/admin/role', {
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
                    <p>New Role</p>
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create A New Role</DialogTitle>
                </DialogHeader>
                <Form {...form} >
                    <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-3'>
                        <div className="grid gap-4 p-3 border rounded-lg border-secondary grid-cols-1">
                            <FormField

                                control={form.control}
                                name="role_name"
                                render={({ field }) => (
                                    <FormItem className='w-full' >
                                        <FormLabel>Role Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Abc" className='w-auto' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField

                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Enter description" className='w-auto'  {...field} />
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
