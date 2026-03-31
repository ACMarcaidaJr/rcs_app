"use client"

import * as React from 'react';
import { Layout } from "@/components/custom/layout";
import { IconCalendarEventFilled } from "@tabler/icons-react"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from '@/components/ui/use-toast';
import { DataTable } from './components/task-data-table';
import { getColumns } from "./components/tasks-list-column";
export default function Page() {
    const [isLoadingTasks, setIsloadingTasks] = React.useState(false);
    const [taskData, setTaskData] = React.useState<[]>([])
    const [nextLink, setNextLink] = React.useState<string | null>(null);
    const [previousLinks, setPreviousLinks] = React.useState<string[]>([]);
    const [taskCountData, setTaskCount] = React.useState<{ total_tasks: number, active_tasks: number, inactive_tasks: number }>();
    const [isLoadingTaskCount, setIsLoadingTaskCount] = React.useState<Boolean>(false)


    const fetchTasks = async (link?: string) => {
        try {
            setIsloadingTasks(true);
            const url = link
                ? `/api/admin/task?nextLink=${encodeURIComponent(link)}`
                : `/api/admin/task`;

            const res = await fetch(url);
            const data = await res.json();
            setTaskData(data.data);
            setNextLink(data.nextLink ?? null);

        } catch (error) {
            console.log(error);
        } finally {
            setIsloadingTasks(false);
        }
    };
    // PAGINATION
    const handleNext = () => {
        if (!nextLink) return;

        setPreviousLinks(prev => [...prev, nextLink]);
        fetchTasks(nextLink);
    };
    const handlePrevious = () => {
        const prevLinksCopy = [...previousLinks];
        prevLinksCopy.pop();

        setPreviousLinks(prevLinksCopy);

        if (prevLinksCopy.length === 0) {
            fetchTasks();
        } else {
            fetchTasks(prevLinksCopy[prevLinksCopy.length - 1]);
        }
    };

    const fetchTaskCount = async () => {
        try {
            setIsLoadingTaskCount(true)
            const res = await fetch(`/api/admin/task/count`)
            const data = await res.json()
            setTaskCount(data?.totals)
        } catch (error) {
            console.log('error', error)
        } finally {
            setIsLoadingTaskCount(false)
        }
    }
    const handleChangeStatus = async (
        rcs_taskid: string | number,
        is_active: number
    ) => {
        try {
            setIsloadingTasks(true);
            const res = await fetch('/api/admin/task/status', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ rcs_taskid, is_active }),
            });
            const status_data = await res.json()
            toast({
                title: status_data?.message_title,
                description: status_data?.message,
                variant: "default",
            })
            await fetchTasks();
            await fetchTaskCount();

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
        fetchTasks();
        fetchTaskCount();
    }, [])
    return (
        <Layout fixed className="bg-ghost">
            <Layout.Header sticky className="bg-ghost">
                <h1 className="text-lg font-bold">Tasks</h1>
            </Layout.Header>
            <Layout.Body className="">
                <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="flex items-start justify-between border rounded-md p-2">
                        <div>
                            <p className="font-normal text-[12px]">Total Tasks</p>
                            <div className="text-[32px] font-bold">
                                {
                                    isLoadingTaskCount ? <Skeleton className='h-[45px] w-[50px]  rounded-lg' /> : <>{taskCountData?.total_tasks?? 0}</>
                                }
                            </div>
                        </div>
                        <div className="bg-secondary p-1 rounded-lg">
                            <IconCalendarEventFilled size={20} />
                        </div>
                    </div>

                    <div className="flex items-start justify-between border rounded-md p-2">
                        <div>
                            <p className="font-normal text-[12px]">Active</p>
                            <div className="text-[32px] font-bold">
                                {
                                    isLoadingTaskCount ? <Skeleton className='h-[45px] w-[50px]  rounded-lg' /> : <>{taskCountData?.active_tasks?? 0}</>
                                }
                            </div>
                        </div>
                        <div className="bg-secondary p-1 rounded-lg">
                            <IconCalendarEventFilled size={20} />
                        </div>
                    </div>

                    <div className="flex items-start justify-between border rounded-md p-2">
                        <div>
                            <p className="font-normal text-[12px]">Disabled</p>
                            <div className="text-[32px] font-bold">
                                {
                                    isLoadingTaskCount ? <Skeleton className='h-[45px] w-[50px]  rounded-lg' /> : <>{taskCountData?.inactive_tasks?? 0}</>
                                }</div>
                        </div>
                        <div className="bg-secondary p-1 rounded-lg">
                            <IconCalendarEventFilled size={20} />
                        </div>
                    </div>

                </div>
                <div className="flex flex-col gap-5 rounded-lg border border-secondary " >
                    
                    <DataTable
                        hasNextPage={!!nextLink}
                        hasPreviousPage={previousLinks?.length > 0}
                        onNext={handleNext}
                        onPrevious={handlePrevious}
                        fetchTasks={fetchTasks}
                        isloading={isLoadingTasks}
                        columns={columns}
                        data={taskData}
                        totalTasks={taskCountData?.total_tasks ?? "--"}
                    />
                </div>
            </Layout.Body>
        </Layout>
    )
}