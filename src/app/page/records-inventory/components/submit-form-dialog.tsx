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
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod"
import { unknown, z } from "zod"
import { toast } from "@/components/ui/use-toast"

import { Button } from '@/components/custom/button';
import { useForm } from 'react-hook-form';
import { submitFormSchema } from '../data/submit-form-schema';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function SubmitFormDialog() {

    const form = useForm<z.infer<typeof submitFormSchema>>({
        resolver: zodResolver(submitFormSchema),
        defaultValues: {
            remarks: '',
            office: '',
            signed_nap_form_1: undefined,

        }
    })


    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant='link'>Submit</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Submit a NAP Form No. 1</DialogTitle>
                    <DialogDescription><span>Submit for this year</span></DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form className='flex flex-col gap-3'>
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
                            name="office"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Office</FormLabel>
                                    <FormControl>
                                        <Input type='text' placeholder="Select office" {...field} />
                                        {/* it should be a searching method. */}
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="signed_nap_form_1"
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
                                                    form.setValue("signed_nap_form_1", file, {
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
                    </form>
                    <DialogFooter className="pt-4">
                        <Button type="submit">Submit</Button>
                    </DialogFooter>
                </Form>
            </DialogContent>
        </Dialog>
    )
}