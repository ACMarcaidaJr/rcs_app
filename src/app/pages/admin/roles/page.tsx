"use client"

import * as React from 'react';
import { getColumns } from "./components/roles-list-column";
import { DataTable } from './components/roles-data-table';
import { Layout } from "@/components/custom/layout";
import { IconUserBolt } from "@tabler/icons-react"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from '@/components/ui/use-toast';

export default function Page() {
    const [isLoadingRolesData, setIsLoadinRolesData] = React.useState<boolean>(false)
    const [rolesData, setRolesData] = React.useState<[]>([]);
    const [nextLink, setNextLink] = React.useState<string | null>(null);
    const [previousLinks, setPreviousLinks] = React.useState<string[]>([]);
    const [roleCountData, setRolesCount] = React.useState<{ total_roles: number, active_roles: number, inactive_roles: number }>();
    const [isLoadingRoleCount, setIsLoadingRoleCount] = React.useState<Boolean>(false)

    const fetchRolesData = async (link?: string) => {
        try {
            setIsLoadinRolesData(true);
            const url = link
                ? `/api/admin/role?nextLink=${encodeURIComponent(link)}`
                : `/api/admin/role`;

            const res = await fetch(url);
            const data = await res.json();
            setRolesData(data.data);
            setNextLink(data.nextLink ?? null);

        } catch (error) {
            console.log(error);
        } finally {
            setIsLoadinRolesData(false);
        }
    };
    // PAGINATION
    const handleNext = () => {
        if (!nextLink) return;

        setPreviousLinks(prev => [...prev, nextLink]);
        fetchRolesData(nextLink);
    };

    const handlePrevious = () => {
        const prevLinksCopy = [...previousLinks];
        prevLinksCopy.pop();

        setPreviousLinks(prevLinksCopy);

        if (prevLinksCopy.length === 0) {
            fetchRolesData();
        } else {
            fetchRolesData(prevLinksCopy[prevLinksCopy.length - 1]);
        }
    };

    const fetchRoleCountData = async () => {
        try {
            setIsLoadingRoleCount(true)
            const res = await fetch(`/api/admin/role/count`)
            const data = await res.json()
            setRolesCount(data?.totals)
        } catch (error) {
            console.log('error', error)
        } finally {
            setIsLoadingRoleCount(false)
        }
    }
    const handleChangeStatus = async (
        rcs_roleid: string | number,
        is_active: number
    ) => {
        try {
            setIsLoadinRolesData(true);
            const res = await fetch('/api/admin/role/status', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ rcs_roleid, is_active }),
            });
            const status_data = await res.json()
            toast({
                title: status_data?.message_title,
                description: status_data?.message,
                variant: "default",
            })
            await fetchRolesData();
            await fetchRoleCountData();

        } catch (error) {
            toast({
                title: "Error",
                description: "Something went wrong",
                variant: "default",
            })
        }
    };
    const columns = React.useMemo(
        () => getColumns(handleChangeStatus),
        []
    );

    React.useEffect(() => {
        fetchRolesData()
        fetchRoleCountData()
    }, [])
    return (
        <Layout fixed className="bg-ghost">
            <Layout.Header sticky className="bg-ghost">
                <h1 className="text-lg font-bold">Roles management</h1>
            </Layout.Header>
            <Layout.Body className="flex flex-col gap-4">
                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="flex items-start justify-between border rounded-md p-2">
                        <div>
                            <p className="font-normal text-[12px]">Total Roles</p>
                            <div className="text-[32px] font-bold">
                                {
                                    isLoadingRoleCount ? <Skeleton className='h-[45px] w-[50px]  rounded-lg' /> : <>{roleCountData?.total_roles}</>
                                }
                            </div>
                        </div>
                        <div className="bg-secondary p-1 rounded-lg">
                            <IconUserBolt size={20} />
                        </div>
                    </div>

                    <div className="flex items-start justify-between border rounded-md p-2">
                        <div>
                            <p className="font-normal text-[12px]">Active</p>
                            <div className="text-[32px] font-bold">
                                {
                                    isLoadingRoleCount ? <Skeleton className='h-[45px] w-[50px]  rounded-lg' /> : <>{roleCountData?.active_roles}</>
                                }
                            </div>
                        </div>
                        <div className="bg-secondary p-1 rounded-lg">
                            <IconUserBolt size={20} />
                        </div>
                    </div>

                    <div className="flex items-start justify-between border rounded-md p-2">
                        <div>
                            <p className="font-normal text-[12px]">Disabled</p>
                            <div className="text-[32px] font-bold">
                                {
                                    isLoadingRoleCount ? <Skeleton className='h-[45px] w-[50px]  rounded-lg' /> : <>{roleCountData?.inactive_roles}</>
                                }</div>
                        </div>
                        <div className="bg-secondary p-1 rounded-lg">
                            <IconUserBolt size={20} />
                        </div>
                    </div>

                </div>
                <div className="flex flex-col gap-5 rounded-lg border border-secondary " >
                    <DataTable
                        hasNextPage={!!nextLink}
                        hasPreviousPage={previousLinks?.length > 0}
                        onNext={handleNext}
                        onPrevious={handlePrevious}
                        fetchRoles={fetchRolesData}
                        isloading={isLoadingRolesData}
                        columns={columns}
                        data={rolesData}
                        totalRoles={roleCountData?.total_roles ?? "--"}
                    />
                </div>
            </Layout.Body>

        </Layout>
    )
}