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
import { AssignRoleSchema } from '../data/assign-role-schema';
import { Button } from '@/components/custom/button';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Spinner } from '@/components/ui/spinner';

// typescripts
type Roles = {
    role_name: string, rcs_roleid: string, description: string, rcs_userid: string; role_id: string; is_assigned: boolean
}
export default function AssignRoleDialog({ rcsUserId, userId }: { rcsUserId?: string; userId: string }) {

    const [open, setOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false)

    // FETCH ALL ROLES
    const [isLoadingRoles, setIsLoadingRoles] = useState<boolean>(false)
    const [rolesData, setRolesData] = useState<Roles[]>()
    // get all roles with is_assigned custom field
    const fetchRoles = async () => {
        try {

            setIsLoadingRoles(true)
            const res = await fetch(`/api/admin/role/assign/${rcsUserId}`) // guid
            const data = await res.json()
            setRolesData(data?.data)

        } catch (error) {
            toast({
                title: 'Error',
                description: 'Something went wrong',
                variant: "default",
            })
        } finally {
            setIsLoadingRoles(false)
        }
    }

    // update role
    const onChangeHanlder = async ({ rcs_roleid, is_active, role_id }: { role_id: string; rcs_roleid: string; is_active: number }) => {
        try {
            setRolesData((prevRoles: any) =>
                prevRoles.map((role: any) =>
                    role.role_id === role_id
                        ? { ...role, is_assigned: !role.is_assigned }
                        : role
                )
            );
            setLoading(true)
            const res = await fetch('/api/admin/role/assign', {
                method: 'POST',
                body: JSON.stringify({ rcs_roleid, rcs_userid: rcsUserId, user_id: userId, role_id, is_active })
            })
            const data = res.json()
            setLoading(false)
        } catch (error) {
            toast({
                title: 'Error',
                description: 'Something went wrong',
                variant: "default",
            })
        } finally {
            fetchRoles()
        }
    }

    useEffect(() => {
        if (!open) {
            setRolesData(undefined)
            return
        }
        fetchRoles()
    }, [open])
    console.log("roleData", rolesData)
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <p>Assign role</p>
            </DialogTrigger>
            <DialogContent className='flex flex-col'>
                <DialogHeader className='flex items-start'>
                    <DialogTitle className='flex flex-row gap-2 items-center'>
                        <p>Assign Roles</p>
                        {
                            loading || isLoadingRoles ? <>
                                <Badge className='w-fit flex gap-2'>
                                    <Spinner data-icon="inline-start" /> Please wait
                                </Badge>
                            </> : <></>
                        }
                    </DialogTitle>
                    <DialogDescription><span>Select roles you want to assign to this user</span></DialogDescription>
                </DialogHeader>
                <div className='flex items-center gap-2 flex-wrap'>
                    {rolesData?.map(({ role_name, rcs_roleid, role_id, is_assigned }: Roles) => (
                        <Badge key={rcs_roleid} variant='secondary' className='relative gap-2 rounded-full px-3 py-1.5 overflow-hidden'>
                            <Checkbox
                                id={rcs_roleid}
                                checked={is_assigned}
                                onCheckedChange={checked => {
                                    onChangeHanlder({ rcs_roleid, role_id, is_active: checked ? 1 : 0 })
                                }
                                }
                                className={`rounded-full flex items-center justify-center transition-all duration-200 ease-in-out h-6 overflow-hidden
                                        ${is_assigned
                                        ? "w-6 translate-x-0"
                                        : "w-0 -translate-x-10 "
                                    }
                             `}
                            />
                            <label htmlFor={rcs_roleid} className='cursor-pointer select-none after:absolute after:inset-0 '>
                                {role_name}
                            </label>
                        </Badge>
                    ))}
                </div>
            </DialogContent>
        </Dialog>


    )
}

