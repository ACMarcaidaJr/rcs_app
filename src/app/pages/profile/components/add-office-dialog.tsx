"use client"
import { useState } from 'react';
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
} from "@/components/ui/form"
import { IconImageInPicture, IconPlus, IconUsers } from "@tabler/icons-react";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { addOfficeProfileSchema } from './data/office-form-schema';
import { Button } from '@/components/custom/button';
import { Input } from '@/components/ui/input';
import { toast } from "@/components/ui/use-toast"

export default function AddOfficeDialog() {
    const form = useForm<z.infer<typeof addOfficeProfileSchema>>({
        resolver: zodResolver(addOfficeProfileSchema),
        defaultValues: {
            name_of_office: '',
            address: '',
            department_or_division: '',
            section_or_unit: '',
            telephone_no: '', // trunklne in the UI.
            local_no: ''
        }
    })

    const [open, setOpen] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [data, setData] = useState<Object>()

    async function onSubmit(values: z.infer<typeof addOfficeProfileSchema>) {
        if (!values) return
        setLoading(true)
        const res = await fetch('/api/office', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
        })
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

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-fit" variant='outline'>Add an offce</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Off ice</DialogTitle>
                    <DialogDescription><span>Please add an office to your account profile</span></DialogDescription>
                </DialogHeader>
                <Form {...form} >
                    <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-3'>
                        <FormField
                            control={form.control}
                            name='name_of_office'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name of office</FormLabel>
                                    <FormControl>
                                        <Input type='text' placeholder='Example: GSD-Records and Communication Section' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='address'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address</FormLabel>
                                    <FormControl>
                                        <Input type='text' placeholder='Full Address' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='department_or_division'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Department/Division</FormLabel>
                                    <FormControl>
                                        <Input type='text' placeholder='Department/Division' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='section_or_unit'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Section/Unit</FormLabel>
                                    <FormControl>
                                        <Input type='text' placeholder='Section/Unit' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='telephone_no'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Trunkline</FormLabel>
                                    <FormControl>
                                        <Input type='text' placeholder='Trunkline' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='local_no'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Local No.</FormLabel>
                                    <FormControl>
                                        <Input type='text' placeholder='Local No.' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter className="pt-4">
                            <DialogFooter className="pt-4">
                                <Button disabled={loading} type="submit">Submit</Button>
                            </DialogFooter>
                        </DialogFooter>
                    </form>

                </Form>
            </DialogContent>
        </Dialog>
    )
}