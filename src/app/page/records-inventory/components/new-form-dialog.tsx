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


import { formSchema } from '../data/new-form-data-schema';
import { useFetch } from '@/hooks/use-fetch';
const ImageDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='ghost' className='text-blue-600'><IconImageInPicture /></Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Image of the Form</DialogTitle>
          <DialogDescription className='flex flex-row gap-3 items-center'>
            <span></span>
          </DialogDescription>
        </DialogHeader>
        <p>sample image here</p>
      </DialogContent>
    </Dialog >
  )
}

export default function NewFormDialog() {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      form_name: '',
      name_of_office: '',
      date_prepared: '',
      address: '',
      department_or_division: '',
      email_address: '',
      person_in_charge_of_files: '',
      section_or_unit: '',
      telephone_no: '',
    },
  })

  const [open, setOpen] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [data, setData] = useState<Object>()
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!values) return
    setLoading(true)
    const res = await fetch('/api/nap-forom-one-header', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    })
    const json_data = await res.json()
    setLoading(false)
    if (!json_data?.error) {
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

  // UI
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)} className="flex flex-row justify-between w-fit gap-2 hover:cursor-pointer" variant='outline'>
          <p>New Form</p>
          <IconPlus />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create new a Form</DialogTitle>
          <DialogDescription className='flex flex-row gap-3 items-center'><span>Add values to this part:</span>
            <ImageDialog />
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-3'>
            <div className="grid gap-4 p-3 border rounded-lg border-secondary grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
              <FormField
                control={form.control}
                name="form_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Form name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name_of_office"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name of office</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter name of office" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter name of address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date_prepared"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date prepared</FormLabel>
                    <FormControl>
                      <Input type='date' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="department_or_division"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department/Division</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Department/Division" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email_address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter email address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="person_in_charge_of_files"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Person-in-charge of files</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter person-in-charge of files" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="section_or_unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Section/Unit</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Section/Unit" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="telephone_no"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telephone No.</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter telephone no." {...field} />
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
        {/* <DialogFooter className="pt-4">
          <Button type="submit">Submit</Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog >
  );
}
