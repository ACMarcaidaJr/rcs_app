'use client'
import { Layout } from "@/components/custom/layout"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Card,
    CardHeader,
    CardFooter,
    CardTitle,
    CardDescription,
    CardContent
} from '@/components/ui/card'
import { Badge, badgeVariants } from "@/components/ui/badge"
import React from "react"
import { IconFilter, IconPlus, IconMenu3, IconFilter2, IconSearch } from "@tabler/icons-react"
import { cn } from '@/lib/utils'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from "@/components/custom/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Search } from "@/components/search"
import Link from "next/link";
import NewFormDialog from "./components/new-form-dialog";


const form_data = [
    {
        id: 1001,
        form_name: 'name of the Form',
        edited: '17 June 2025',
        status: 'draft',
    },
    {
        id: 1002,
        form_name: 'Title of the Form',
        edited: '17 June 2025',
        status: 'draft',
    },
    {
        id: 1003,
        form_name: 'Title of the Form that can be so long t can be so long',
        edited: '27 June 2025',
        status: 'draft',
    },
    {
        id: 1004,
        form_name: 'Name of the Form',
        edited: '21 June 2025',
        status: 'draft',
    },
]

import { columns, Forms } from "./components/forms-list-column"
import { DataTable } from "./components/forms-data-table"
import { useFetch } from "@/hooks/use-fetch";


export default function Page() {

    // const { data, error, isLoading } = useFetch('/api/nap-form-one-edit')
    // console.log('data, error, isLoading', data, error, isLoading)
    const [isLoadingforms, setIsLoadingForms] = React.useState<boolean>(false)
    const [formData, setFormData] = React.useState<[]>()

    React.useEffect(() => {
        (async () => {
            try {
                setIsLoadingForms(true)
                const res = await fetch('/api/nap-form-one-edit')
                const data = await res.json()
                setFormData(data?.data)

            } catch (error) {
                console.log('error', error)
            } finally {
                setIsLoadingForms(false)
            }
        })()
    }, [])
    return (
        <Layout fixed className="bg-ghost">
            <Layout.Header sticky className="bg-ghost">
                <h1 className="text-lg font-bold">Records Inventory</h1>
            </Layout.Header>
            <Layout.Body className="">
                <div className="flex flex-col gap-5 border-solid border-green-400">
                    <Card className="w-full rounded-md mx-auto">
                        <CardHeader>
                            <CardTitle>Records Inventory Overview</CardTitle>
                            <CardDescription>Overview of ongoing submission</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">Submission of NAP Form No. 1</p>
                            <div className="">
                                <p><strong>Due Date:</strong> August 10, 2025</p>
                                <p><strong>Status:</strong> Ongoing</p>
                                <div className="flex flex-row gap-1"><strong>Submitted:</strong> <p className="italic ">You've no response yet</p></div>
                            </div>
                        </CardContent>
                    </Card>
                    <div className="flex flex-col gap-5 md:rounded-lg md:border md:border-secondary md:p-6" >
                        <DataTable isloading={isLoadingforms} columns={columns} data={formData ?? []} />
                    </div>
                </div>
            </Layout.Body>
        </Layout>
    )
}
