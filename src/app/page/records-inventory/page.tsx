'use client'
import { Layout } from "@/components/custom/layout"
import {
    Card,
    CardHeader,
    CardFooter,
    CardTitle,
    CardDescription,
    CardContent
} from '@/components/ui/card'

import React from "react"


import { columns, Forms } from "./components/forms-list-column"
import { DataTable } from "./components/forms-data-table"
import SubmitFormDialog from "./components/submit-form-dialog";

export default function Page() {

    // const { data, error, isLoading } = useFetch('/api/nap-form-one-edit')
    // console.log('data, error, isLoading', data, error, isLoading)
    const [isLoadingforms, setIsLoadingForms] = React.useState<boolean>(false)
    const [formData, setFormData] = React.useState<[]>()

    const fetchForms = async () => {
        try {
            console.log('fetching forms')
            setIsLoadingForms(true)
            const res = await fetch('/api/nap-form-one-header')
            const data = await res.json()
            setFormData(data?.data)

        } catch (error) {
            console.log('error', error)
        } finally {
            setIsLoadingForms(false)
        }
    }


    React.useEffect(() => {
        fetchForms()
    }, [])
    console.log('formData',formData)
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
                                <div className="flex flex-row items-center gap-1 h-fit"><strong>Submitted:</strong>
                                    {/* <SubmitFormDialog /> */}
                                </div>  
                            </div>
                        </CardContent>
                    </Card>
                    <div className="flex flex-col gap-5 md:rounded-lg md:border md:border-secondary md:p-6" >
                        <DataTable fetchForms={fetchForms} isloading={isLoadingforms} columns={columns} data={formData ?? []} />
                    </div>
                </div>
            </Layout.Body>
        </Layout>
    )
}
// 