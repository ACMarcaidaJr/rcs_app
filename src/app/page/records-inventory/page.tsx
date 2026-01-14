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
import { Button } from "@/components/custom/button"
import { IconCheck, IconCross, IconDownload, IconExclamationCircle, IconSquare, IconX } from "@tabler/icons-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function Page() {

    // const { data, error, isLoading } = useFetch('/api/nap-form-one-edit')
    // console.log('data, error, isLoading', data, error, isLoading)
    const [isLoadingforms, setIsLoadingForms] = React.useState<boolean>(false)
    const [formData, setFormData] = React.useState<[]>([])

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
    // console.log('formData', formData)

    // get announcments
    type AnnouncementTypes = {
        notice_title: string,
        rcs_roleid: string,
        notice_description: string,
        year_covered: string,
        deadline_of_submission: string,
        supporting_document_name: string,
        rcs_announcement_noticeid: string,
    };
    const [announcementsData, setAnnouncementsData] = React.useState<AnnouncementTypes[]>([]);

    const fetchAnnouncements = async () => {
        try {
            try {
                const res = await fetch('/api/announcement-notice/get-by-user-role')
                const data = await res.json()
                setAnnouncementsData(data?.data)

            } catch (error) {
                console.log('error', error)
            } finally {
            }
        } catch (error) {
        }
    }

    React.useEffect(() => {
        fetchAnnouncements()
    }, [])
    console.log('announcementsData>>>>>>>>>>>>>>', announcementsData)

    // fetch the file when clicking the button
    const fetchAnnouncementFile = async () => {
        try {
            const res = await fetch(
                `/api/announcement-notice/file-download/${announcementsData[0]?.rcs_announcement_noticeid}`
            );
            const contentType = res.headers.get("content-type");
            if (contentType?.includes("application/json")) {
                const data = await res.json();
                if (!data.success) {
                    console.log("Error:", data);
                    return;
                }
                // Base64 → Blob → New Tab
                const base64 = data.data.file;
                const binary = atob(base64);
                const bytes = new Uint8Array([...binary].map(c => c.charCodeAt(0)));
                const blob = new Blob([bytes], { type: "application/pdf" });
                const url = URL.createObjectURL(blob);
                window.open(url);
                return;
            }
            // Otherwise, treat it as a binary file (PDF)
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            window.open(url);

        } catch (error) {
            console.log("error", error);
        }
    };

    // fetch if the user is already complied to the notice.


    return (
        <Layout fixed className="bg-ghost">
            <Layout.Header sticky className="bg-ghost">
                <h1 className="text-lg font-bold">Records Inventory</h1>
            </Layout.Header>
            <Layout.Body className="">
                <div className="flex flex-col gap-5 border-solid border-green-400">

                    <Card className="w-full rounded-md mx-auto gap-[10px]">
                        <CardHeader>
                            <CardTitle>Records Inventory Notice</CardTitle>
                            <CardDescription></CardDescription>
                        </CardHeader>
                        <CardContent>
                            {
                                // if loading => skeleton
                                // when done loading and empty announcement, diplay something else
                                // 
                                announcementsData?.length ?
                                    (
                                        <div className="space-y-2 flex flex-col gap-2 lg:flex-row w-full ">
                                            <div className="flex-1 flex  flex-col gap-1">
                                                <div className="flex gap-3">
                                                    <p className="w-20 font-medium italic font-thin">Title:</p>
                                                    <p>{announcementsData[0]?.notice_title ?? ""}</p>
                                                </div>

                                                <div className="flex gap-3">
                                                    <p className="w-20 font-medium italic font-thin">Description:</p>
                                                    <p>
                                                        {announcementsData[0]?.notice_description ?? ""}
                                                    </p>
                                                </div>
                                                <div className="flex gap-3">
                                                    <p className="w-20 font-medium italic font-thin">Deadline:</p>
                                                    <p>{new Date(announcementsData[0]?.deadline_of_submission).toLocaleDateString("en-US", {
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric",
                                                    }) ?? ""}</p>
                                                </div>
                                                <div className="flex gap-3">
                                                    <p className="w-20 font-medium italic font-thin">File:</p>
                                                    <Button onClick={() => fetchAnnouncementFile()} variant='link' className='hover:bg-transparent text-blue-600 flex gap-2'><p>{announcementsData[0]?.supporting_document_name ?? ""}</p><IconDownload /></Button>
                                                </div>
                                            </div>
                                            <div className="flex-1 border-[1px] border-gray-0 rounded-2xl">
                                               
                                            </div>

                                            {/* <div className="flex flex-flow gap-3 border-[1px] border-red-500 dark:border-red-600 py-[20px] px-[10px] rounded-lg items-center">
                                                <div className=' items-center flex gap-2'><p className="text-red-500"><IconExclamationCircle /></p></div>
                                                <div className="flex flex-flow font-medium items-center">
                                                    Please submit on or before {new Date(announcementsData[0]?.deadline_of_submission).toLocaleDateString("en-US", {
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric",
                                                    }) ?? ""}
                                                </div>
                                            </div> */}
                                        </div>
                                    ) :
                                    <div>
                                        <Skeleton className='h-[80px] min-w-[400px]rounded-lg' />
                                    </div>
                            }
                        </CardContent>
                    </Card>
                    <div className="flex flex-col gap-5 md:rounded-lg md:border md:border-secondary md:p-6" >
                        <DataTable fetchForms={fetchForms} isloading={isLoadingforms} columns={columns} data={formData} />
                    </div>
                </div>
            </Layout.Body>
        </Layout>
    )
}