'use client'
import { Layout } from "@/components/custom/layout";
import * as React from 'react';
import { DataTable } from "./components/announcements-data-table";
import { columns } from "./components/announcements-list-column";

export default function Page() {
    const [isLoadingAnnouncements, setIsLoadingAnnouncements] = React.useState<boolean>(false)
    const [announcementsData, setAnnouncementsData] = React.useState<[]>([]);
    
    const fetchAnnouncements = async () => {
        try {
            try {
                setIsLoadingAnnouncements(true)
                const res = await fetch('/api/announcement-notice')
                const data = await res.json()
                setAnnouncementsData(data?.data)

            } catch (error) {
                console.log('error', error)
            } finally {
                setIsLoadingAnnouncements(false)
            }
        } catch (error) {
        }
    }

    React.useEffect(() => {
        fetchAnnouncements()
    }, [])
    return (
        <Layout fixed className="bg-ghost">
            <Layout.Header sticky className="bg-ghost">
                <h1 className="text-lg font-bold">Announcements</h1>
            </Layout.Header>
            <Layout.Body className="">
                <DataTable fetchAnnouncements={fetchAnnouncements} isloading={isLoadingAnnouncements} columns={columns} data={announcementsData} />
            </Layout.Body>
        </Layout>
    )
}