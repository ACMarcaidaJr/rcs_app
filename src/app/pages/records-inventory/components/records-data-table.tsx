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
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { IconRefresh, IconChevronLeft, IconChevronRight, IconCircle, IconCircleFilled, IconFilter, IconLayoutList, IconList } from "@tabler/icons-react"
import { Button } from "@/components/custom/button";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { NewRecordSchema } from "../data/new-records-schema";
import NewRecordDialog from "./new-records-dialog";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    totalRecords?: any;
    data: TData[],
    isloading?: boolean,
    fetchData: () => void;
    hasNextPage: boolean
    hasPreviousPage: boolean
    onNext: () => void
    onPrevious: () => void
}





export function DataTable<TData, TValue>({
    columns,
    data,
    isloading,
    fetchData,
    hasNextPage,
    hasPreviousPage,
    onNext,
    onPrevious,
    totalRecords
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
            columnFilters,
        },
        initialState: {
            pagination: {
                pageSize: 100,
            },
        },
    })
    const [filterOpen, setFilterOpen] = React.useState<boolean>(false)
    const [showGroups, setShowGroups] = React.useState<boolean>(false)
    return (
        <div className="flex flex-col">
            <div className='flex flex-wrap sm:flex-row justify-between items-center'>
                <div className="flex flex-row gap-2 items-center px-3">
                    <p className="font-medium text-nowrap">Records Series</p>
                    <p className="dark:bg-gray-800 px-2 rounded-md bg-gray-100 text-gray-600 text-[13px] text-nowrap">
                        {totalRecords ?? '--'} series
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row flex-wrap gap-3 items-center p-3 border-b border-secondary">
                    {/* Action Buttons Group */}
                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                        <Button
                            onClick={() => setFilterOpen(!filterOpen)}
                            variant="outline"
                            className={cn(
                                "flex flex-row gap-2 font-normal flex-1 sm:flex-none justify-center",
                                filterOpen ? 'dark:border-blue-100 border-blue-800 dark:bg-blue-800 dark:text-blue-100 bg-blue-100/50 text-blue-700' : ''
                            )}
                        >
                            <IconFilter size={15} />
                            <span className="text-xs sm:text-sm">Filters</span>
                        </Button>

                        <div className="flex items-center gap-2 px-2 border-x sm:border-r sm:border-l-0 border-secondary h-8 flex-1 sm:flex-none justify-center">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowGroups(!showGroups)}
                                className={cn(
                                    "h-8 px-2 flex gap-2 text-xs font-medium transition-all w-full sm:w-auto justify-center",
                                    showGroups ? "dark:border-blue-100 border-blue-800 dark:bg-blue-800 dark:text-blue-100 bg-blue-100/50 text-blue-700" : ""
                                )}
                            >
                                {showGroups ? <IconLayoutList size={14} /> : <IconList size={14} />}
                                {showGroups ? "Grouped" : "List"}
                            </Button>
                        </div>

                        {/* <Button
                            onClick={fetchData}
                            variant='outline'
                            className='px-3 flex gap-2 font-normal h-9 flex-1 sm:flex-none justify-center'
                        >
                            <IconRefresh size={15} />
                            <span className="hidden lg:inline text-xs sm:text-sm">Refresh</span>
                        </Button> */}
                    </div>

                    {/* Search Input - Full width on mobile, auto width on desktop */}
                    <div className="w-full sm:flex-1 sm:max-w-sm ml-auto">
                        <Input
                            placeholder="Filter form name..."
                            value={(table.getColumn("records_series_title_and_description")?.getFilterValue() as string) ?? ""}
                            onChange={(event) =>
                                table.getColumn("records_series_title_and_description")?.setFilterValue(event.target.value)
                            }
                            className="w-full h-9"
                        />
                    </div>
                    {/* <NewRecordDialog /> */}
                </div>
            </div>
            {filterOpen && (
                <div className="w-full px-3 py-2">
                    <div className="flex flex-row gap-2 items-center justify-end">

                        <div className="w-[200px]">
                            <div className='flex flex-col gap-2'>
                                <Label>Filter Records From</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Office" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="office">My Office</SelectItem>
                                        <SelectItem value="submission">My Submissions</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                        </div>

                        <div className="w-[200px]">
                            <div className='flex flex-col gap-2'>
                                <Label>Filter Status</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="overdue">Overdue</SelectItem>
                                        <SelectItem value="duethisyear">Due This Year</SelectItem>
                                        <SelectItem value="permanent">Permanent</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                        </div>

                    </div>
                </div>
            )}

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