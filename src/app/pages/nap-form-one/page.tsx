'use client'
import React, { useEffect, useState } from "react"
import { Layout } from "@/components/custom/layout"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { IconArrowLeft, IconArrowRight, IconCheck, IconCircle, IconFile, IconFileCheck } from "@tabler/icons-react"
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
import { columns, Forms } from "./components/forms-list-column"
import { DataTable } from "./components/forms-data-table"
import { Button } from '@/components/custom/button';
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import StatusBadge from "@/components/custom/status-badge"
// import StatCard from "./components/status-card";
import StatCard from "@/components/statcard";

export default function Page() {
    const [isLoadingforms, setIsLoadingForms] = useState<boolean>(false)
    const [formData, setFormData] = useState<Forms[]>([]) // Use typed array
    const [nextLink, setNextLink] = useState<string | null>(null)
    const [previousLinks, setPreviousLinks] = useState<string[]>([])

    const [formCountData, setFormCountData] = useState<any>(null)
    const [loadingFormCount, setLoadingFormCount] = useState<boolean>(false)

    const fetchForms = async (link?: string) => {
        try {
            setIsLoadingForms(true)
            const url = link
                ? `/api/nap-form-one-header?nextLink=${encodeURIComponent(link)}`
                : `/api/nap-form-one-header`

            const res = await fetch(url)
            const data = await res.json()
            setFormData(data?.data || [])
            setNextLink(data?.nextLink ?? null)
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoadingForms(false)
        }
    }
    const fetchCountsForms = async () => {
        try {
            setLoadingFormCount(true)
            const res = await fetch('/api/nap-form-one-header/count')
            const data = await res.json()
            setFormCountData(data?.data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoadingFormCount(false)
        }
    }
    // FETCH ASSIGNED USERS IN OFFICE
    const [teamMember, setTeamMember] = useState<any[]>([])
    const [loeadingTeamMember, setLoadingTeamMember] = useState<boolean>(false)
    const fetchTeamMember = async () => {
        try {
            setLoadingTeamMember(true)
            const res = await fetch('/api/user/get-by-office')
            const data = await res.json()
            setTeamMember(data?.data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoadingTeamMember(false)
        }
    }
    // FETCH TASKS
    const [tasks, setTasks] = useState<any[]>([])
    const [loadingTasks, setLoadingTasks] = useState<boolean>(false)
    const fetchTasks = async () => {
        try {
            setLoadingTasks(true)
            const res = await fetch('/api/task/custodian')
            const data = await res.json()
            setTasks(data?.data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoadingTasks(false)
        }
    }
    // FETCH HISTORY
    const [taskHistory, setTaskHistory] = useState<any[]>([])
    const [loadingTaskHistory, setLoadingTaskHistory] = useState<boolean>(false)
    const fetchHistory = async () => {
        try {
            setLoadingTaskHistory(true)
            const res = await fetch('/api/task/history/custodian')
            const data = await res.json()
            setTaskHistory(data?.data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoadingTaskHistory(false)
        }
    }
    useEffect(() => {
        fetchTeamMember()
        fetchTasks()
        fetchHistory()
        fetchCountsForms()
        fetchForms()
    }, [])
    console.log("taskHistory", taskHistory)
    const handleNext = () => {
        if (!nextLink) return
        setPreviousLinks(prev => [...prev, nextLink])
        fetchForms(nextLink)
    }

    const handlePrevious = () => {
        const prevLinksCopy = [...previousLinks]
        prevLinksCopy.pop() // Remove current page
        setPreviousLinks(prevLinksCopy)

        // If no links left, fetch the original first page
        const targetLink = prevLinksCopy.length === 0 ? undefined : prevLinksCopy[prevLinksCopy.length - 1]
        fetchForms(targetLink)
    }

    // DOWNLOAD TASK
    const previewTaskFile = async (task: any) => {
        try {
            const response = await fetch(`/api/task/file-download/${task.rcs_taskid}`);
            if (!response.ok) throw new Error("Fetch failed");
            const blob = await response.blob();
            const file = new Blob([blob], { type: 'application/pdf' });
            const fileURL = URL.createObjectURL(file);
            window.open(fileURL, '_blank');
            setTimeout(() => URL.revokeObjectURL(fileURL), 10000);
        } catch (error) {
            console.error("Error previewing file:", error);
        }
    };
    return (
        <Layout fixed className="bg-ghost">
            <Layout.Header sticky className="bg-ghost border-b">
                <div className="flex flex-row gap-2">
                    <div className="p-2 bg-secondary rounded-md">
                        <IconFileCheck size={18} />
                    </div>
                    <div className="">
                        <h1 className="text-lg font-bold text-wrap">NAP Form No. 1</h1>
                        <p className="text-[12px] text-muted-foreground">Submission of NAP Form No. 1</p></div>
                </div>
            </Layout.Header>
            <Layout.Body>
                <ResizablePanelGroup direction="horizontal" className="min-h-[85vh] w-full rounded-lg border relative">
                    <ResizablePanel maxSize={90} defaultSize={70} className="p-4 sticky overflow-y-auto">
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 ">
                                <StatCard
                                    label="Total Forms"
                                    value={formCountData?.total_forms}
                                    loading={loadingFormCount}
                                    icon={IconFile}
                                    className="dark:bg-gray-800 dark:text-gray-100 bg-gray-100/50 text-gray-900"
                                />
                                {/* <StatCard
                                    label="Drafts"
                                    value={formCountData?.draft}
                                    loading={loadingFormCount}
                                    icon={IconCircle}
                                /> */}
                                <StatCard
                                    label="Received"
                                    value={formCountData?.received}
                                    loading={loadingFormCount}
                                    icon={IconCheck}
                                    className="dark:bg-green-800 dark:text-green-100 bg-green-100/50 text-green-900"
                                />
                                <StatCard
                                    label="Submitted"
                                    value={formCountData?.submitted}
                                    loading={loadingFormCount}
                                    icon={IconArrowRight}
                                    className="dark:bg-blue-800 dark:text-blue-100 bg-blue-100/50 text-blue-900"
                                />
                                <StatCard
                                    label="Returned"
                                    value={formCountData?.returned}
                                    loading={loadingFormCount}
                                    icon={IconArrowLeft}
                                    className="dark:bg-red-800 dark:text-red-100 bg-red-100/50 text-red-900"
                                />
                            </div>
                            {/* Data Table Area */}
                            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                                <DataTable
                                    hasNextPage={!!nextLink}
                                    hasPreviousPage={previousLinks.length > 0}
                                    onNext={handleNext}
                                    onPrevious={handlePrevious}
                                    fetchForms={() => {
                                        fetchForms()
                                        fetchCountsForms()
                                    }}
                                    changeStatus={() => { }} // Placeholder
                                    isloading={isLoadingforms}
                                    columns={columns}
                                    data={formData}
                                    totalForms={formCountData?.total_forms ?? '--'}
                                />
                            </div>
                        </div>
                    </ResizablePanel>
                    <ResizableHandle withHandle />

                    <ResizablePanel maxSize={50} minSize={20} defaultSize={30} className="p-4 bg-muted/30 flex-1 overflow-y-auto p-4">
                        <Tabs defaultValue="task" className="flex flex-col  w-full ">
                            <TabsList className="grid w-full h-auto grid-cols-1 md:grid-cols-3">
                                <TabsTrigger
                                    className="w-full text-nowrap"
                                    value="office"
                                >
                                    My Office
                                </TabsTrigger>
                                <TabsTrigger
                                    className="w-full text-nowrap"
                                    value="task"
                                >
                                    Office Tasks
                                </TabsTrigger>
                                <TabsTrigger
                                    className="w-full text-nowrap"
                                    value="history"
                                >
                                    History
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="office" className="mt-4 text-sm">
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-xl font-semibold tracking-tight">My Office</h2>
                                        <p className="text-sm text-muted-foreground">
                                            Manage your team and office information.
                                        </p>
                                    </div>

                                    <Card className="mx-auto w-full max-w-xl">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <CardTitle className="text-lg">Team Directory</CardTitle>
                                                    <CardDescription>
                                                        Users currently assigned to this office location.
                                                    </CardDescription>
                                                </div>
                                                {/* Optional: Add a counter badge */}
                                                <div className="px-2 py-1 text-xs font-medium bg-secondary rounded-md">
                                                    {teamMember?.filter(Boolean).length} Members
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                {teamMember?.filter((user) => user !== null)
                                                    .map((user, index) => {
                                                        const fullName = `${user.given_name} ${user.family_name}`;
                                                        const initial = user.given_name?.charAt(0) || "?";
                                                        return (
                                                            <div key={user.rcs_userid || index} className="flex items-center gap-4 group">
                                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                                                                    {initial}
                                                                </div>
                                                                <div className="flex flex-col min-w-0">
                                                                    <p className="text-sm font-bold leading-none uppercase tracking-wide">
                                                                        {fullName}
                                                                    </p>
                                                                    <p className="text-xs font-medium text-muted-foreground mt-1">
                                                                        {user.position_title}
                                                                    </p>
                                                                    <p className="text-[11px] text-muted-foreground/70 truncate">
                                                                        {user.user_name}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}

                                                {teamMember?.filter(Boolean).length === 0 && (
                                                    <div className="text-center py-8">
                                                        <p className="text-sm text-muted-foreground italic">
                                                            No team members found in this office.
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </TabsContent>
                            <TabsContent value="task" className="mt-4">
                                <div className="space-y-4">
                                    <div>
                                        <h2 className="text-xl font-semibold">Tasks</h2>
                                        <p className="text-sm text-muted-foreground">List of all tasks for submission.</p>
                                    </div>
                                    {
                                        tasks?.map((task, i) => (
                                            <Card key={i} className="mx-auto w-full max-w-xl min-w-[200px]">
                                                <CardHeader>
                                                    <CardTitle className="text-nowrap truncate">{task?.task_title}</CardTitle>
                                                    <CardDescription>
                                                        {task?.task_description}
                                                    </CardDescription>
                                                </CardHeader>
                                                <CardContent className="flex flex-col gap-2">
                                                    {
                                                        task?.rcs_submitted_task_task_id_crc9f_rcs_task?.map((item: any, i: any) => (
                                                            <div key={i} className="flex flex-col gap-3">
                                                                <div className="flex flex-row justify-between items-start gap-2 bg-blue-50 dark:bg-blue-950/20 p-1 rounded border-l-2 border-blue-500">
                                                                    <div className="flex flex-col gap-1">
                                                                        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-tight">Submission remarks</span>
                                                                        <p className="text-sm">{item?.creator_remarks || "No remarks provided"}</p>
                                                                    </div>
                                                                    <Badge className="text-[10px] h-fit whitespace-nowrap text-muted-foreground" variant="outline">
                                                                        {new Date(item?.createdon).toLocaleDateString("en-US", {
                                                                            year: "numeric",
                                                                            month: "long",
                                                                            day: "numeric"
                                                                        })}
                                                                    </Badge>
                                                                </div>
                                                                <div className="flex flex-row gap-2 items-center bg-muted/30 p-2 rounded-md">
                                                                    <span className="text-[12px] font-medium h-fit">Attachment:</span>
                                                                    <Button
                                                                        size="sm"
                                                                        onClick={() => previewTaskFile(task)}
                                                                        variant="link"
                                                                        className="p-0 h-auto text-[11px] truncate max-w-[200px]"
                                                                    >
                                                                        {item?.attachment_name}
                                                                    </Button>
                                                                </div>
                                                                {item?.approver_status && (
                                                                    <div className="flex flex-row items-center justify-between gap-1 border-t pt-2 mt-1">
                                                                        <div className="flex flex-row items-center gap-2">
                                                                            <span className="text-[11px] font-bold text-muted-foreground uppercase ">Status</span>
                                                                            <StatusBadge status={item?.approver_status} />
                                                                        </div>
                                                                        <Badge className="text-[10px] h-fit opacity-70" variant="outline">
                                                                            {new Date(item?.modifiedon).toLocaleDateString("en-US", {
                                                                                year: "numeric",
                                                                                month: "short",
                                                                                day: "numeric"
                                                                            })}
                                                                        </Badge>
                                                                    </div>
                                                                )}

                                                                {/* Return Feedback Section */}
                                                                {item?.approver_remarks && (
                                                                    <div className="flex flex-col justify-between items-start bg-red-50 dark:bg-red-950/20 p-1 rounded border-l-2 border-red-500">
                                                                        <span className="text-[11px] font-bold text-red-600 dark:text-red-400 uppercase">Feedback</span>
                                                                        <span className="text-sm italic text-foreground/80">{item?.approver_remarks}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))
                                                    }
                                                </CardContent>
                                                {/* <CardFooter>
                                                    <Button variant="outline" size="sm" className="w-full">
                                                        Submit
                                                    </Button>
                                                </CardFooter> */}
                                            </Card>
                                        ))
                                    }

                                </div>
                            </TabsContent>
                            <TabsContent value="history" className="mt-4 text-sm">
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-xl font-semibold tracking-tight">Submission History</h2>
                                        <p className="text-sm text-muted-foreground">
                                            Track the progress and review the status of your submitted forms.
                                        </p>
                                    </div>
                                    {
                                        taskHistory?.map((task, i) => (
                                            <Card key={i} className="mx-auto w-full max-w-xl min-w-[200px]">
                                                <CardHeader>
                                                    <CardTitle className="text-nowrap truncate flex flex-row gap-1">
                                                        <p className="font-normal">Task Name:</p>
                                                        <p>{task?.task_title}</p>
                                                    </CardTitle>
                                                    <CardDescription className="truncate flex flex-row gap-1">
                                                        <p className="text-primary">Description:</p>
                                                        <p className="text-primary text-wrap">{task?.task_description}</p>
                                                    </CardDescription>
                                                </CardHeader>
                                                <CardContent className="flex flex-col gap-2">
                                                    <Accordion
                                                        type="single"
                                                        collapsible
                                                        className="max-w-lg border rounded-md px-4"
                                                    >
                                                        <AccordionItem value="details" className="border-none">
                                                            <AccordionTrigger className="hover:no-underline font-medium">Details</AccordionTrigger>
                                                            <AccordionContent className="flex flex-col gap-4">
                                                                {task?.rcs_submitted_task_task_id_crc9f_rcs_task?.length > 0 ? (
                                                                    task.rcs_submitted_task_task_id_crc9f_rcs_task.map((item: any, i: number) => (
                                                                        <div key={i} className="flex flex-col gap-3">

                                                                            {/* Submission Header */}
                                                                            <div className="flex flex-row justify-between items-start gap-2 bg-blue-50 dark:bg-blue-950/20 p-1 rounded border-l-2 border-blue-500">
                                                                                <div className="flex flex-col gap-1">
                                                                                    <span className="text-[11px] font-bold text-muted-foreground tracking-tight">Submission Remarks</span>
                                                                                    <p className="text-sm">{item?.creator_remarks || "No remarks provided"}</p>
                                                                                </div>
                                                                                <Badge className="text-[10px] h-fit whitespace-nowrap text-muted-foreground" variant="outline">
                                                                                    {new Date(item?.createdon).toLocaleDateString("en-US", {
                                                                                        year: "numeric",
                                                                                        month: "long",
                                                                                        day: "numeric"
                                                                                    })}
                                                                                </Badge>
                                                                            </div>

                                                                            {/* Attachment Section */}
                                                                            <div className="flex flex-row gap-2 items-center bg-muted/30 p-2 rounded-md">
                                                                                <span className="text-[12px] font-medium h-fit">Attachment:</span>
                                                                                <Button
                                                                                    size="sm"
                                                                                    onClick={() => previewTaskFile(task)}
                                                                                    variant="link"
                                                                                    className="p-0 h-auto text-[11px] truncate max-w-[200px]"
                                                                                >
                                                                                    {item?.attachment_name}
                                                                                </Button>
                                                                            </div>
                                                                            {/* Approval Status Section */}
                                                                            {item?.approver_status && (
                                                                                <div className="flex flex-row items-center justify-between gap-1 border-t pt-2 mt-1">
                                                                                    <div className="flex flex-row items-center gap-2">
                                                                                        <span className="text-[11px] font-bold text-muted-foreground  ">Status</span>
                                                                                        <StatusBadge status={item?.approver_status} />
                                                                                    </div>
                                                                                    <Badge className="text-[10px] h-fit opacity-70" variant="outline">
                                                                                        {new Date(item?.modifiedon).toLocaleDateString("en-US", {
                                                                                            year: "numeric",
                                                                                            month: "short",
                                                                                            day: "numeric"
                                                                                        })}
                                                                                    </Badge>
                                                                                </div>
                                                                            )}

                                                                            {/* Return Feedback Section */}
                                                                            {item?.approver_remarks && (
                                                                                <div className="flex flex-col justify-between items-start bg-red-50 dark:bg-red-950/20 p-1 rounded border-l-2 border-red-500">
                                                                                    <span className="text-[11px] font-bold text-red-600 dark:text-red-400 ">Feedback</span>
                                                                                    <span className="text-sm italic text-foreground/80">{item?.approver_remarks}</span>
                                                                                </div>
                                                                            )}

                                                                            {/* Divider logic: only show if not the last item */}
                                                                            {i !== task.rcs_submitted_task_task_id_crc9f_rcs_task.length - 1 && (
                                                                                <Separator className="mt-2" />
                                                                            )}
                                                                        </div>
                                                                    ))
                                                                ) : (
                                                                    <p className="text-center text-muted-foreground text-sm py-4">No history available for this task.</p>
                                                                )}
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>

                                                </CardContent>

                                            </Card>
                                        ))
                                    }
                                </div>
                            </TabsContent>

                        </Tabs>
                    </ResizablePanel>
                </ResizablePanelGroup>
            </Layout.Body>
        </Layout>
    )
}
