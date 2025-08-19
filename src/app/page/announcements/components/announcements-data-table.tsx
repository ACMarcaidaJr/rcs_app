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
// import NewFormDialog from "./new-form-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { IconRefresh } from "@tabler/icons-react"
import { Button } from "@/components/custom/button";
import NewAnnouncementDialog from "./new-announcement-dialog"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[],
    isloading: boolean,
    fetchAnnouncements: () => void;
}


export function DataTable<TData, TValue>({
    columns,
    data,
    isloading,
    fetchAnnouncements
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
        <div className="flex flex-col gap-3">
            <div className="flex gap-3 items-center ">
                <Button onClick={fetchAnnouncements} variant='outline' className='p-1'><IconRefresh /></Button>
                <NewAnnouncementDialog />
                <Input
                    placeholder="Filter form title"
                    value={(table.getColumn("notice_title")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("notice_title")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
            </div>
            <div className="rounded-md border">
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
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No data.
                                    </TableCell>
                                </TableRow>
                            )}</> :
                                <>
                                    <TableRow>
                                        {
                                            table.getAllColumns()?.map(() => (

                                                <TableCell>
                                                    <Skeleton className='h-[40px] min-w-[400px]rounded-lg' />
                                                </TableCell>

                                            ))
                                        }
                                    </TableRow>
                                    <TableRow>
                                        {
                                            table.getAllColumns()?.map(() => (
                                                <TableCell>
                                                    <Skeleton className='h-[40px]  rounded-lg' />
                                                </TableCell>
                                            ))
                                        }
                                    </TableRow></>
                        }
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}