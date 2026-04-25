'use client'
import React, { useEffect, useState } from "react"
import { Layout } from "@/components/custom/layout"
import {
    IconObjectScan,
    IconFileText,
    IconPlus,
    IconDownload,
    IconArchive,
    IconClock,
    IconFileInfinity,
    IconRefresh
} from "@tabler/icons-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { DataTable } from "./components/records-data-table"
import { columns, Forms } from "./components/records-list-column"
import { Button } from '@/components/custom/button';
import { Badge } from "@/components/ui/badge"
import StatCard from "@/components/statcard";
import NewRecordDialog from "./components/new-records-dialog"

export default function RecordsClassificationPage() {
    const [isLoadingRecords, setIsLoadingRecords] = useState<boolean>(false)
    const [recordsData, setRecordsData] = useState<Forms[]>([])
    const [recordsCountData, setRecordsCountData] = useState<any>(null)
    const [loadingRecordsCount, setLoadingRecordsCount] = useState<boolean>(false)
    const [nextLink, setNextLink] = useState<string | null>(null)
    const [previousLinks, setPreviousLinks] = useState<string[]>([])

    const fetchData = async (link?: string) => {
        setIsLoadingRecords(true);
        try {
            // We pass the full encoded nextLink to our API
            const url = link
                ? `/api/records-series-item/table?nextLink=${encodeURIComponent(link)}`
                : `/api/records-series-item/table`;

            const res = await fetch(url);
            const data = await res.json();

            setRecordsData(data?.data || []);

            // IMPORTANT: Replace the old nextLink with the fresh one from the new page
            setNextLink(data?.nextLink || null);

        } catch (e) {
            console.error(e);
        } finally {
            setIsLoadingRecords(false);
        }
    };

    const fetchCounts = async () => {
        setLoadingRecordsCount(true)
        try {
            const res = await fetch('/api/records-series-item/count')
            const data = await res.json()
            setRecordsCountData(data?.stats)
        } catch (e) { console.error(e) }
        finally { setLoadingRecordsCount(false) }
    }
    const handleNext = () => {
        if (!nextLink) return;
        setPreviousLinks(prev => [...prev, nextLink]);
        fetchData(nextLink);
    };
    const handlePrevious = () => {
        const prevLinksCopy = [...previousLinks];
        prevLinksCopy.pop();
        setPreviousLinks(prevLinksCopy);

        if (prevLinksCopy.length === 0) {
            fetchData();
        } else {
            fetchData(prevLinksCopy[prevLinksCopy.length - 1]);
        }
    };

    useEffect(() => {
        fetchData()
        fetchCounts()
    }, [])

    return (
        <Layout>
            <Layout.Header sticky className="border-b bg-background/95 backdrop-blur px-4 flex items-center">
                <div className="flex items-center justify-between w-full ">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="hidden sm:flex p-2 bg-gray-600/10 text-gray-600 rounded-lg">
                            <IconObjectScan size={20} />
                        </div>
                        <div>
                            <h1 className="text-base sm:text-xl font-bold tracking-tight">Records Inventory</h1>
                            <p className="hidden sm:block text-xs text-muted-foreground">Identify and list all current office records.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="md:flex">
                            <IconDownload size={16} className=" " />
                            <span className="hidden sm:block ml-2">Export</span>
                        </Button>
                        <Button onClick={() => {
                            fetchData()
                            fetchCounts()
                        }} variant="outline" size="sm" className="md:flex">

                            <IconRefresh size={16} className="" />
                            <span className="hidden sm:block ml-2">Refresh</span>

                        </Button>
                        <NewRecordDialog fetchData={() => {
                            fetchData()
                            fetchCounts()
                        }} />
                    </div>
                </div>
            </Layout.Header>

            <Layout.Body className="space-y-6 p-4 sm:p-6">
                <div className="flex flex-col gap-6 rounded-lg border p-4 ">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                        <StatCard
                            label="Active Series"
                            value={recordsCountData?.total}
                            loading={loadingRecordsCount}
                            icon={IconFileText}
                            className="bg-background border shadow-sm"
                        />
                        <StatCard
                            label="Permanent Records"
                            value={recordsCountData?.permanent}
                            loading={loadingRecordsCount}
                            icon={IconFileInfinity}
                            className="bg-blue-50/50 dark:bg-blue-950/20 text-blue-700 border-blue-100/50"
                        />
                        <StatCard
                            label="Temporary (Timed)"
                            value={recordsCountData?.temporary}
                            loading={loadingRecordsCount}
                            icon={IconClock}
                            className="bg-slate-50/50 dark:bg-slate-950/20 text-slate-700 border-slate-100/50"
                        />
                        <StatCard
                            label="NAP Validated"
                            value={recordsCountData?.nap_validated ?? 0}
                            loading={loadingRecordsCount}
                            icon={IconArchive}
                            className="bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 border-emerald-100/50"
                        />
                    </div>

                    {/* 2. Main Classification Table */}
                    <div className="m-0 border rounded-xl bg-card shadow-sm overflow-hidden">
                        <DataTable
                            hasNextPage={!!nextLink}
                            hasPreviousPage={previousLinks.length > 0}
                            onNext={handleNext}
                            onPrevious={handlePrevious}
                            fetchData={() => {
                                fetchData()
                                fetchCounts()
                            }}
                            isloading={isLoadingRecords}
                            columns={columns}
                            data={recordsData}
                            totalRecords={recordsCountData?.total ?? '--'}
                        />
                    </div>
                </div>
                <div className="rounded-lg bg-gray-50/30 dark:bg-gray-950/10 p-4 border border-gray-100/50 flex items-start gap-4">
                    <div className="p-2 bg-gray-600 text-white rounded-md shrink-0">
                        <IconArchive size={18} />
                    </div>
                    <div>
                        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Classification Phase</h4>
                        <p className="text-xs text-gray-700/80 dark:text-gray-300/80 mt-1 leading-relaxed">
                            You are currently defining the <strong>Records Series Titles</strong> and their respective <strong>Retention Periods</strong>.
                            Inventory details (Inclusive Dates, Volume, etc.) will be added in the next stage during the Inventory Phase.
                        </p>
                    </div>
                </div>
            </Layout.Body>
        </Layout>
    )
}