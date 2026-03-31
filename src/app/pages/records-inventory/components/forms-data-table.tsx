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
import NewFormDialog from "./new-form-dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { IconRefresh, IconChevronLeft, IconChevronRight } from "@tabler/icons-react"
import { Button } from "@/components/custom/button";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    totalForms?: any;
    data: TData[],
    isloading: boolean,
    fetchForms: () => void;
    // changeStatus is defined in props but unused in code, added for completeness
    changeStatus?: () => void;
    hasNextPage: boolean
    hasPreviousPage: boolean
    onNext: () => void
    onPrevious: () => void
}

export function DataTable<TData, TValue>({
    columns,
    data,
    isloading,
    fetchForms,
    hasNextPage,
    hasPreviousPage,
    onNext,
    onPrevious,
    totalForms
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

    const table = useReactTable({
        data,
        columns: columns as ColumnDef<TData, any>[],
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
        <div className="flex flex-col">
            <div className='flex justify-between items-center'>
                <div className="flex flex-row gap-2 items-center px-3">
                    <p className="font-medium text-nowrap">Form list</p>
                    <p className="dark:bg-gray-800 px-2 rounded-md bg-gray-100 text-gray-600 text-[13px] text-nowrap">
                        {totalForms ?? '--'} forms
                    </p>
                </div>
                <div className="flex gap-3 items-center p-3 border-b border-secondary">
                    <Input
                        placeholder="Filter form name"
                        value={(table.getColumn("form_name")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("form_name")?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
                    <Button onClick={fetchForms} variant='outline' className='px-4 flex gap-3'>
                        <IconRefresh size={18} /> Refresh
                    </Button>
                    <NewFormDialog />
                </div>
            </div>

            <div className="relative">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {isloading ? (
                            table.getRowModel().rows?.map((_, rowIndex) => (
                                <TableRow key={rowIndex}>
                                    {columns.map((_, colIndex) => (
                                        <TableCell key={colIndex}>
                                            <Skeleton className='h-8 w-full rounded-lg' />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className="max-w-[200px] truncate whitespace-nowrap overflow-hidden text-ellipsis"
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No data found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                <div className="flex flex-row items-center justify-end gap-2 border-t border-secondary p-3">
                    <Button
                        disabled={!hasPreviousPage || isloading}
                        onClick={onPrevious}
                        variant="ghost"
                        className="flex gap-2 items-center"
                    >
                        <IconChevronLeft size={16} /> Previous
                    </Button>
                    <Button
                        disabled={!hasNextPage || isloading}
                        onClick={onNext}
                        variant="ghost"
                        className="flex gap-2 items-center"
                    >
                        Next <IconChevronRight size={16} />
                    </Button>
                </div>
            </div>
        </div>
    )
}