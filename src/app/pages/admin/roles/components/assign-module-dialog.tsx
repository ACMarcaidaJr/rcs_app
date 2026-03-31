"use client"
import { useEffect, useState } from 'react'
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge'      
import { Checkbox } from '@/components/ui/checkbox'
import { Spinner } from '@/components/ui/spinner'; 

type Module = {
    title: string; rcs_moduleid: string; module_id: string; is_assigned: boolean;
}

export default function AssignModuleDialog({ rcsRoleId }: { rcsRoleId: string }) {
    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false)
    const [isLoadingModules, setIsLoadingModule] = useState<boolean>(false)
    const [modulesData, setModuleData] = useState<Module[]>()

    const fetchModules = async () => {
        try {
            setIsLoadingModule(true)
            const res = await fetch(`/api/admin/module/assign/${rcsRoleId}`)
            const data = await res.json()
            setModuleData(data?.data)

        } catch (error) {
            toast({
                title: 'Error',
                description: 'Something went wrong',
                variant: "default",
            })
        } finally {
            setIsLoadingModule(false)
        }
    }
    const onChangeHanlder = async ({ rcs_moduleid, is_active, module_id }: { rcs_moduleid: string; is_active: number, module_id: string }) => {
        try {
            setModuleData((prevMod: any) =>
                prevMod.map((module: any) =>
                    module.module_id === module_id
                        ? { ...module, is_assigned: !module.is_assigned }
                        : module
                )
            );
            setLoading(true)
            const res = await fetch('/api/admin/module/assign', {
                method: 'POST',
                body: JSON.stringify({ rcs_moduleid, rcs_roleid: rcsRoleId, is_active })
            })
            const data = res.json()
            setLoading(false)
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Something went wrong',
                variant: "default",
            })
        }finally{
            fetchModules()
        }
    }
    useEffect(() => {
        if (!open) {
            setModuleData(undefined)
            return
        }
        fetchModules()
    }, [open])
    console.log("roleData", modulesData)
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <p>Assign module</p>
            </DialogTrigger>
            <DialogContent className='flex flex-col'>
                <DialogHeader className='flex items-start'>
                    <DialogTitle className='flex flex-row gap-2 items-center'>
                        <p>Assign Modules</p>
                        {
                            loading || isLoadingModules ? <>
                                <Badge className='w-fit flex gap-2'>
                                    <Spinner data-icon="inline-start" /> Please wait
                                </Badge>
                            </> : <></>
                        }
                    </DialogTitle>
                    <DialogDescription><span>Select module you want to assign to this role</span></DialogDescription>
                </DialogHeader>
                <div className='flex items-center gap-2 flex-wrap'>
                    {modulesData?.map(({ title, rcs_moduleid, module_id, is_assigned }: Module) => (
                        <Badge key={rcs_moduleid} variant='secondary' className='relative gap-2 rounded-full px-3 py-1.5 overflow-hidden'>
                            <Checkbox
                                id={rcs_moduleid}
                                checked={is_assigned}
                                onCheckedChange={checked => {
                                    onChangeHanlder({ rcs_moduleid, module_id, is_active: checked ? 1 : 0 })
                                }
                                }
                                className={`rounded-full flex items-center justify-center transition-all duration-200 ease-in-out h-6 overflow-hidden
                                        ${is_assigned
                                        ? "w-6 translate-x-0"
                                        : "w-0 -translate-x-10 "
                                    }
                             `}
                            />
                            <label htmlFor={rcs_moduleid} className='cursor-pointer select-none after:absolute after:inset-0 '>
                                {title}
                            </label>
                        </Badge>
                    ))}
                </div>
            </DialogContent>
        </Dialog>


    )
}

