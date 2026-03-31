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

import { Button } from "@/components/custom/button"
import { IconDesk, } from "@tabler/icons-react"
import { Skeleton } from "@/components/ui/skeleton"
import OfficeOrgChart from "./components/office-organizational-chart"

export default function Page() {
    const [officesCountData, setOfficesCountData] = React.useState<{ total_offices: number, active_offices: number, inactive_offices: number }>()
    const [isLoadingOfficesCount, setIsLoadingOfficesData] = React.useState<boolean>(false)
    const fetchOfficesCountData = async () => {
        try {
            setIsLoadingOfficesData(true)
            const res = await fetch(`/api/admin/office/count`)
            const data = await res.json()
            setOfficesCountData(data?.totals)
        } catch (error) {
            console.log('error', error)
        } finally {
            setIsLoadingOfficesData(false)
        }
    }
    console.log("officesCountData", officesCountData)
        React.useEffect(() => {
            fetchOfficesCountData()
        }, [])
    return (
        <Layout fixed className="bg-ghost">
            <Layout.Header sticky className="bg-ghost">
                <h1 className="text-lg font-bold">Office management</h1>
            </Layout.Header>
            <Layout.Body className="flex flex-col gap-4">
                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="flex items-start justify-between border rounded-md p-2">
                        <div>
                            <p className="font-normal text-[12px]">Total Offices</p>
                            <div className="text-[32px] font-bold">
                                {
                                    isLoadingOfficesCount ? <Skeleton className='h-[45px] w-[50px]  rounded-lg' /> : <>{officesCountData?.total_offices}</>
                                }
                            </div>
                        </div>
                        <div className="bg-secondary p-1 rounded-lg">
                            <IconDesk size={20} />
                        </div>
                    </div>

                    <div className="flex items-start justify-between border rounded-md p-2">
                        <div>
                            <p className="font-normal text-[12px]">Active</p>
                            <div className="text-[32px] font-bold">
                                {
                                    isLoadingOfficesCount ? <Skeleton className='h-[45px] w-[50px]  rounded-lg' /> : <>{officesCountData?.active_offices}</>
                                }
                            </div>
                        </div>
                        <div className="bg-secondary p-1 rounded-lg">
                            <IconDesk size={20} />
                        </div>
                    </div>

                    <div className="flex items-start justify-between border rounded-md p-2">
                        <div>
                            <p className="font-normal text-[12px]">Disabled</p>
                            <div className="text-[32px] font-bold">
                                {
                                    isLoadingOfficesCount ? <Skeleton className='h-[45px] w-[50px]  rounded-lg' /> : <>{officesCountData?.inactive_offices}</>
                                }</div>
                        </div>
                        <div className="bg-secondary p-1 rounded-lg">
                            <IconDesk size={20} />
                        </div>
                    </div>
                </div>
                <OfficeOrgChart  />
            </Layout.Body>
        </Layout>
    )
}