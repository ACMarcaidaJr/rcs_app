"use client"
import * as React from 'react';
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
import useDebounce from '@/hooks/use-debounce';
import { IconImageInPicture, IconPlus, IconUsers, IconSearch } from "@tabler/icons-react";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { addOfficeProfileSchema } from './data/office-form-schema';
import { Button } from '@/components/custom/button';
import { Input } from '@/components/ui/input';
import { toast } from "@/components/ui/use-toast"
import type {
    RelationGraphExpose,
    RGLine,
    RGLink,
    RGNode,
    RGNodeSlotProps,
    RGOptions,
    RGJsonData
} from "relation-graph-react"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput,
    InputGroupText,
    InputGroupTextarea,
} from "@/components/ui/input-group"
import { Switch } from '@/components/ui/switch';
import { Spinner } from '@/components/ui/spinner';
import { Badge } from '@/components/ui/badge';

// just confirmation buttons
// const ConfirmButton = ({ userId, setShowConfirmId }: { userId: string; setShowConfirmId: (any: any) => void | null; addStaff: () => void }) => {
//     return (
//         <div className='flex flex-row h-full'>
//             <p className='text-[10px] w-[50px] m-auto'>Continue?</p>
//             <div className='flex flex-row'>
//                 <div onClick={() => setShowConfirmId(null)} className='cursor-pointer w-[25px] bg-secondary h-full bg-red-600 text-white font-bold flex items-center justify-center'>
//                     <p className='text-[9px]'>No</p>
//                 </div>
//                 <div onClick={()=>addStaff()} className='cursor-pointer w-[25px] bg-secondary h-full bg-green-600 text-white font-bold flex items-center justify-center'>
//                     <p className='text-[9px]'>Yes</p>
//                 </div>
//             </div>
//         </div>
//     )
// }
export default function OfficeDetailsDialog({ node }: { node: any }) {
    const [open, setOpen] = React.useState<boolean>(false)
    const [searchLoading, setSearchLoading] = React.useState<boolean>(false)
    const [searchNewStaff, setSearchNewStaff] = React.useState<string>("")
    const [searchResult, setSearchResult] = React.useState<any[] | null>(null)
    const debouncedSearch = useDebounce(searchNewStaff, 500)
    const controllerRef = React.useRef<AbortController | null>(null);

    const fetchUsers = async (search: string, signal?: AbortSignal) => {
        const res = await fetch(
            `/api/admin/user/search/${encodeURIComponent(search)}`,
            { signal }
        );

        const resjson = await res.json();
        return resjson.data;
    };
    React.useEffect(() => {
        if (!debouncedSearch.trim()) {
            setSearchResult(null);
            return;
        }
        controllerRef.current?.abort();
        const controller = new AbortController();
        controllerRef.current = controller;
        setSearchLoading(true);
        fetchUsers(debouncedSearch, controller.signal)
            .then((data) => {
                setSearchResult(data);
            })
            .catch((err: any) => {
                if (err.name !== "AbortError") console.error(err);
            })
            .finally(() => {
                setSearchLoading(false);
            });

        return () => controller.abort();
    }, [debouncedSearch]);

    // ADD USER SUBMIT
    const [showConfirmId, setShowConfirmId] = React.useState<string | null>(null) // it will use for confirm button to show up or not.
    const [loadingAssign, setLoadingAssign] = React.useState(false)
    const addStaff = async (rcs_officeid: string, rcs_userid: string) => {
        const controller = new AbortController(); // for only fetching users
        try {
            setLoadingAssign(true)
            const res = await fetch('/api/admin/user-office', {
                method: 'POST',
                body: JSON.stringify({ rcs_officeid, rcs_userid, is_active: 1 })
            })
            const data = res.json()
        } catch (err: any) {
            toast({
                title: 'Error',
                description: 'Something went wrong',
                variant: "default",
            })
        } finally {
            setShowConfirmId(null)
            const data = await fetchUsers(searchNewStaff, controller.signal)
            setSearchResult(data)
            setLoadingAssign(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={(e) => {
            setOpen(e)
            setSearchResult(null)
            setSearchNewStaff("")
        }}>
            <DialogTrigger asChild>
                <div className="flex items-center justify-center w-full h-fit">
                    <Button variant="link" className="h-fit text-gray-900 break-all font-bold w-full text-wrap truncate">{node.text}</Button>
                </div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className='flex flex-row gap-3 items-center'><p className='text-nowrap'>Office details:</p> <Badge variant="secondary" className='text-[16px]'> {node.text} </Badge></DialogTitle>
                    <DialogDescription><span>Manage this office</span></DialogDescription>
                </DialogHeader>
                <div className='border-secondary  flex gap-2 flex-col'>
                    <p className='font-medium'>Add staff</p>
                    <InputGroup>
                        <InputGroupInput value={searchNewStaff} onChange={(e) => setSearchNewStaff(e.target.value)} placeholder="Find user" />
                        <InputGroupAddon>
                            <IconSearch size={12} className='' />
                        </InputGroupAddon>
                    </InputGroup>
                    <div className='flex flex-col gap-2 pl-2 border-l-[2px] border-secondary min-h-[20px]'>
                        {
                            !searchLoading && searchResult && searchResult?.map((item, i) => (
                                <div key={i} className='flex flex-row  items-center gap-2'>
                                    {
                                        showConfirmId === item?.rcs_userid ? <div className='flex flex-row h-full'>
                                            <p className='text-[10px] w-[50px] m-auto'>Continue?</p>
                                            <div className='flex flex-row'>
                                                {
                                                    loadingAssign ? <div className='w-[50px] h-full flex items-center justify-center' ><Spinner /></div> :
                                                        <div className="flex flex-row items-center">
                                                            <div onClick={() => setShowConfirmId(null)} className='cursor-pointer w-[25px] bg-secondary h-full bg-red-600 text-white font-bold flex items-center justify-center'>
                                                                <p className='text-[9px]'>No</p>
                                                            </div>
                                                            <div onClick={() => addStaff(node.id, item?.rcs_userid)} className='cursor-pointer w-[25px] bg-secondary h-full bg-green-600 text-white font-bold flex items-center justify-center'>
                                                                <p className='text-[9px]'>Yes</p>
                                                            </div>
                                                        </div>
                                                }
                                            </div>
                                        </div> : <Button
                                            disabled={item?.rcs_user_office_user_id_crc9f_rcs_user[0]?.office_id?.rcs_officeid === node.id
                                            }
                                            onClick={(e) => setShowConfirmId(item?.rcs_userid)}
                                            variant="ghost" className='px-3 py-[0px] h-[25px] rounded-full text-[11px] font-normal bg-blue-600 text-white hover:bg-blue-500 hover:text-white' >+ add</Button>
                                    }


                                    <div className='flex flex-row justify-between w-full gap-3'>
                                        <div>
                                            <p className='text-[13px]'>{item?.given_name} {item?.middle_name} {item?.family_name}</p>
                                            <p className='text-[10px]'>{item?.user_name}</p>
                                        </div>
                                        <div className='flex flex-col justify-between items-end'>
                                            <p className='text-[13px]'>Current Office:</p>
                                            <div className='text-[10px] mr-0 text-right'>{item?.rcs_user_office_user_id_crc9f_rcs_user[0]?.office_id?.name_of_office ?? <Badge className='text-[10px]' variant="outline">None</Badge>} </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }

                        {searchLoading &&
                            <Badge className='w-fit flex gap-2'>
                                <Spinner data-icon="inline-start" /> Searching...
                            </Badge>}
                    </div>
                </div>
                <div className='border-secondary  flex gap-2 flex-col'>
                    <p className='font-medium'>Current staff</p>
                    <InputGroup>
                        <InputGroupInput placeholder="Search..." />
                        <InputGroupAddon>
                            <IconSearch size={12} className='' />
                        </InputGroupAddon>
                    </InputGroup>
                    <div className='flex flex-col gap-2 pl-2 border-l-[2px] border-secondary'>
                        <div className='flex flex-row  items-center gap-2'>
                            <Switch className='h-4 w-8 [&>span]:h-3 [&>span]:w-3' />
                            <p className='text-[13px]'>Full Name 1</p>
                        </div>
                        <div className='flex flex-row  items-center gap-2'>
                            <Switch className='h-4 w-8 [&>span]:h-3 [&>span]:w-3' />
                            <p className='text-[13px]'>Full Name 10000000</p>
                        </div>
                        <div className='flex flex-row  items-center gap-2'>
                            <Switch className='h-4 w-8 [&>span]:h-3 [&>span]:w-3' />
                            <p className='text-[13px]'>Full Name 30000000</p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

// export default OfficeDetailsDialog