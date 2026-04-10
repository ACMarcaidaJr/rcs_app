'use client'
import React, { useEffect, useState } from "react"
import { Layout } from "@/components/custom/layout"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { IconFileInfinity, IconCalendarExclamation, IconCheck, IconCircle, IconFile, IconCalendarTime, IconCalendarOff, IconAlertTriangle } from "@tabler/icons-react"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { DataTable } from "./components/records-data-table"
import { columns, Forms } from "./components/records-list-column"

import { Button } from '@/components/custom/button';
import { Badge } from "@/components/ui/badge"
import StatCard from "@/components/statcard";




export default function Page() {
    const [isLoadingRecords, setIsLoadingRecords] = useState<boolean>(false)
    const [recordsData, setRecordsData] = useState<Forms[]>([]) // Use typed array
    const [nextLink, setNextLink] = useState<string | null>(null)
    const [previousLinks, setPreviousLinks] = useState<string[]>([])

    const fetchRecords = async (link?: string) => {
        try {
            setIsLoadingRecords(true)
            const url = link
                ? `/api/nap-form-one-header/disposal-schedule?nextLink=${encodeURIComponent(link)}`
                : `/api/nap-form-one-header/disposal-schedule`

            const res = await fetch(url)
            const data = await res.json()
            setRecordsData(data?.data || [])
            setNextLink(data?.nextLink ?? null)
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoadingRecords(false)
        }
    }


    // counts

    const [recordsCountData, setRecordsCountData] = useState<any>(null)
    const [loadingRecordsCount, setLoadingRecordsCount] = useState<boolean>(false)
    const fetchCountRecords = async () => {
        try {
            setLoadingRecordsCount(true)
            const res = await fetch('/api/nap-form-one-row/count')
            const data = await res.json()
            setRecordsCountData(data?.data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoadingRecordsCount(false)
        }
    };

    // handle table functions
    const handleNext = () => {
        if (!nextLink) return
        setPreviousLinks(prev => [...prev, nextLink])
        fetchRecords(nextLink)
    }

    const handlePrevious = () => {
        const prevLinksCopy = [...previousLinks]
        prevLinksCopy.pop() // Remove current page
        setPreviousLinks(prevLinksCopy)

        // If no links left, fetch the original first page
        const targetLink = prevLinksCopy.length === 0 ? undefined : prevLinksCopy[prevLinksCopy.length - 1]
        fetchRecords(targetLink)
    }
    React.useEffect(() => {
        fetchRecords()
        fetchCountRecords()
    }, [])

    return (
        <Layout>
            <Layout.Header sticky className="bg-ghost border-b">
                <div className="flex flex-row gap-2">
                    <div className="flex items-center justify-center px-3 py-2 bg-secondary rounded-md">
                        <IconCalendarTime size={18} />
                    </div>
                    <div className="">
                        <div className='flex flex-row gap-1 items-center'>
                            <h1 className="text-lg font-bold text-wrap">Disposal Schedule</h1>
                            <Badge variant="outline" className='rounded-full'>NAP Form no. 1</Badge>
                        </div>
                        <p className="text-[12px] text-muted-foreground">Department of Tourism — Records Section</p>
                    </div>
                </div>
            </Layout.Header>
            {/* ===== Main ===== */}
            <Layout.Body className="">
                <div className="flex flex-col gap-6 rounded-lg border p-4 ">
                    <div className="grid gap-3 grid-cols-2 sm:grid-cols-3  md:grid-cols-3 lg:grid-cols-4 xl:lg:grid-cols-5 ">
                        <StatCard
                            label="Total Series"
                            value={recordsCountData?.total_records}
                            loading={loadingRecordsCount}
                            icon={IconFile}
                            className="dark:bg-gray-800 dark:text-gray-100 bg-gray-100/50 text-gray-700"
                        />

                        <StatCard
                            label="Overdue Disposals"
                            value={recordsCountData?.overdue}
                            loading={loadingRecordsCount}
                            icon={IconCalendarOff}
                            className="dark:bg-red-800 dark:text-red-100 bg-red-100/50 text-red-700"
                        />
                        <StatCard
                            label="Partial Disposal"
                            value={recordsCountData?.partial_disposal}
                            loading={loadingRecordsCount}
                            icon={IconAlertTriangle}
                            className="dark:bg-orange-800 dark:text-orange-100 bg-orange-100/50 text-orange-700"
                        />
                        <StatCard
                            label="Due This Year"
                            value={recordsCountData?.due_this_year}
                            loading={loadingRecordsCount}
                            icon={IconCalendarExclamation}
                            className="dark:bg-yellow-800 dark:text-yellow-100 bg-yellow-100/50 text-yellow-700"
                        />
                        <StatCard
                            label="Permanent"
                            value={recordsCountData?.permanent}
                            loading={loadingRecordsCount}
                            icon={IconFileInfinity}
                            className="dark:bg-green-800 dark:text-green-100 bg-green-100/50 text-green-700"
                        />
                    </div>
                    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                        <DataTable
                            hasNextPage={!!nextLink}
                            hasPreviousPage={previousLinks.length > 0}
                            onNext={handleNext}
                            onPrevious={handlePrevious}
                            fetchRecords={() => {
                                fetchRecords()
                                fetchCountRecords()
                            }}
                            isloading={isLoadingRecords}
                            columns={columns}
                            data={recordsData}
                            totalForms={recordsCountData?.total_records ?? '--'}
                        />
                    </div>
                </div>
            </Layout.Body>
        </Layout>
    )
}

