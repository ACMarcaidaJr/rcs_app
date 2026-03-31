'use client'

import * as React from 'react';
import { Layout } from "@/components/custom/layout";
import { getColumns } from "./components/users-list-column";
import { DataTable } from './components/users-data-table';
import { IconUsers } from "@tabler/icons-react"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from '@/components/ui/use-toast';

export default function Page() {
    const [isLoadingUsersData, setIsLoadinUsersData] = React.useState<boolean>(false)
    const [usersData, setUsersData] = React.useState<[]>([]);
    const [nextLink, setNextLink] = React.useState<string | null>(null);
    const [previousLinks, setPreviousLinks] = React.useState<string[]>([]);

    const fetchUsersData = async (link?: string) => {
        try {
            setIsLoadinUsersData(true);
            const url = link
                ? `/api/admin/user?nextLink=${encodeURIComponent(link)}`
                : `/api/admin/user`;

            const res = await fetch(url);
            const data = await res.json();
            setUsersData(data?.data);
            setNextLink(data?.nextLink ?? null);

        } catch (error) {
            console.log(error);
        } finally {
            setIsLoadinUsersData(false);
        }
    };
    // PAGINATION
    const handleNext = () => {
        if (!nextLink) return;

        setPreviousLinks(prev => [...prev, nextLink]);
        fetchUsersData(nextLink);
    };

    const handlePrevious = () => {
        const prevLinksCopy = [...previousLinks];
        prevLinksCopy.pop();

        setPreviousLinks(prevLinksCopy);

        if (prevLinksCopy.length === 0) {
            fetchUsersData();
        } else {
            fetchUsersData(prevLinksCopy[prevLinksCopy.length - 1]);
        }
    };

    const [usersCountData, setUsersCountData] = React.useState<{ total_users: number, active_users: number, inactive_users: number }>();
    const [isLoadingUsersCount, setIsLoadingUsersCount] = React.useState<boolean>(false)
    const fetchUsersCountData = async () => {
        try {
            setIsLoadingUsersCount(true)
            const res = await fetch(`/api/admin/user/count`)
            const data = await res.json()
            setUsersCountData(data?.totals)
        } catch (error) {
            console.log('error', error)
        } finally {
            setIsLoadingUsersCount(false)
        }
    }
    React.useEffect(() => {
        fetchUsersData()
        fetchUsersCountData()
    }, [])




    const handleChangeStatus = async (
        id: string | number,
        is_active: number
    ) => {
        try {
            setIsLoadinUsersData(true)
            const res = await fetch('/api/admin/user/status', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ rcs_userid: id, is_active }),
            });
            const status_data = await res.json()
            toast({
                title: status_data?.message_title,
                description: status_data?.message,
                variant: "default",
            })
            await fetchUsersData();
            await fetchUsersCountData();

        } catch (error) {
            toast({
                title: 'Error',
                description: 'Something went wrong',
                variant: "default",
            })
        }
    };
    const columns = React.useMemo(
        () => getColumns(handleChangeStatus),
        []
    );



    return (
        <Layout fixed className="bg-ghost">
            <Layout.Header sticky className="bg-ghost">
                <h1 className="text-lg font-bold">Users management</h1>
            </Layout.Header>
            <Layout.Body className="flex flex-col gap-4">
                
                    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="flex items-start justify-between border rounded-md p-2">
                            <div>
                                <p className="font-normal text-[12px]">Total Users</p>
                                <div className="text-[32px] font-bold">
                                    {
                                        isLoadingUsersCount ? <Skeleton className='h-[45px] w-[50px]  rounded-lg' /> : <>{usersCountData?.total_users}</>
                                    }
                                </div>
                            </div>
                            <div className="bg-secondary p-1 rounded-lg">
                                <IconUsers size={20} />
                            </div>
                        </div>

                        <div className="flex items-start justify-between border rounded-md p-2">
                            <div>
                                <p className="font-normal text-[12px]">Active</p>
                                <div className="text-[32px] font-bold">
                                    {
                                        isLoadingUsersCount ? <Skeleton className='h-[45px] w-[50px]  rounded-lg' /> : <>{usersCountData?.active_users}</>
                                    }
                                </div>
                            </div>
                            <div className="bg-secondary p-1 rounded-lg">
                                <IconUsers size={20} />
                            </div>
                        </div>

                        <div className="flex items-start justify-between border rounded-md p-2">
                            <div>
                                <p className="font-normal text-[12px]">Disabled</p>
                                <div className="text-[32px] font-bold">
                                    {
                                        isLoadingUsersCount ? <Skeleton className='h-[45px] w-[50px]  rounded-lg' /> : <>{usersCountData?.inactive_users}</>
                                    }</div>
                            </div>
                            <div className="bg-secondary p-1 rounded-lg">
                                <IconUsers size={20} />
                            </div>
                        </div>
                    </div>
                <div className="flex flex-col gap-5 rounded-lg border border-secondary " >
                    <DataTable
                        hasNextPage={!!nextLink}
                        hasPreviousPage={previousLinks?.length > 0}
                        onNext={handleNext}
                        onPrevious={handlePrevious}
                        fetchUsers={fetchUsersData}
                        isloading={isLoadingUsersData}
                        columns={columns}
                        data={usersData}
                        changeStatus={() => handleChangeStatus}
                        totalUsers={usersCountData?.total_users ?? '--'} />
                </div>
            </Layout.Body>
        </Layout>
    )
}