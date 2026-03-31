"use client"
import * as React from "react"

import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { IconRefresh, IconChevronLeft, IconChevronRight } from "@tabler/icons-react"
import { Button } from "@/components/custom/button";
import NewTaskDialog from "./task-dialog";
interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    totalTasks?: any;
    data: TData[],
    isloading: boolean,
    fetchTasks: () => void;
    hasNextPage: boolean
    hasPreviousPage: boolean
    onNext: () => void
    onPrevious?: () => void
}
export function DataTable<TData, TValue>({
    columns,
    data,
    isloading,
    fetchTasks,
    hasNextPage,
    hasPreviousPage,
    onNext,
    onPrevious,
    totalTasks

}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters
        },
    })
    return (
        <div className="flex flex-col ">
            <div className='flex justify-between items-center'>
                <div className="flex flex-rwo gap-2 items-center px-3">
                    <p className="font-medium">Task list</p>
                    <p className="dark:bg-gray-800 px-2 rounded-md bg-gray-100 text-gray-600 text-[13px]">{totalTasks} tasks</p>
                </div>
                <div className="flex gap-3 items-center p-3 border-b border-b-[1px] border-b-secondary">

                    <Input
                        placeholder="Offline search for role name"
                        value={(table.getColumn("task_title")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("task_title")?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
                    <Button onClick={() => fetchTasks()} variant='outline' className='p-1 gap-2'><IconRefresh size={18} />Refresh</Button>
                    <NewTaskDialog />
                </div>
            </div>
            <div className="">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {
                            !isloading ? <>{table.getRowModel()?.rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell className="max-w-[200px] truncate whitespace-nowrap overflow-hidden text-ellipsis" key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns?.length} className="h-24 text-center">
                                        No data.
                                    </TableCell>
                                </TableRow>
                            )}</> :
                                <>
                                    {table.getRowModel()?.rows?.map((item, i) => (
                                        <TableRow className="p-0 m-0" key={i}>
                                            {
                                                table.getAllColumns()?.map(() => (

                                                    <TableCell>
                                                        <Skeleton className='h-[32px] rounded-lg p-0' />
                                                    </TableCell>
                                                ))
                                            }
                                        </TableRow>
                                    ))}
                                </>
                        }
                    </TableBody>
                </Table>
                <div className="flex flex-row items-center justify-end gap-2 border-t border-t-secondary p-3">
                    <Button disabled={!hasPreviousPage}
                        onClick={onPrevious} variant="ghost" className="flex gap-2 items-center"><IconChevronLeft size={16} />Previous</Button>
                    <Button disabled={!hasNextPage}
                        onClick={onNext} variant="ghost" className="flex gap-2 items-center">Next<IconChevronRight size={16} /></Button>
                </div>
            </div>
        </div>
    )
}