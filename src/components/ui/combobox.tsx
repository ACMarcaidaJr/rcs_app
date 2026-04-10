"use client"

import * as React from "react"
import { Check, X, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface MultiComboboxProps {
    options: readonly string[]
    value: string[]
    onChange: (value: string[]) => void
    placeholder?: string
}

export function MultiCombobox({
    options,
    value,
    onChange,
    placeholder = "Select options...",
}: MultiComboboxProps) {
    const [open, setOpen] = React.useState(false)

    const handleUnselect = (item: string) => {
        onChange(value.filter((i) => i !== item))
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <div
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "flex min-h-10 w-full items-center justify-between rounded-md border border-input bg-background px-2 py-1 text-sm ring-offset-background cursor-pointer",
                        "hover:bg-accent/50 transition-colors focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
                        "w-full justify-between h-auto"
                    )}
                    onClick={() => setOpen(!open)}
                >
                    <div className="flex flex-wrap gap-1">
                        {value?.length > 0 ? (
                            value.map((item) => (
                                <Badge key={item} variant="secondary" className="flex items-center gap-1">
                                    {item}
                                    <button
                                        type="button"
                                        className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") handleUnselect(item)
                                        }}
                                        onMouseDown={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation() // Prevents closing/opening popover
                                            handleUnselect(item)
                                        }}
                                    >
                                        <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                                    </button>
                                </Badge>
                            ))
                        ) : (
                            <span className="text-muted-foreground ml-1">{placeholder}</span>
                        )}
                    </div>
                    <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 ml-2" />
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Command>
                    <CommandInput placeholder="Search..." />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup className="max-h-64 overflow-auto">
                            {options.map((option) => (
                                <CommandItem
                                    key={option}
                                    value={option}
                                    onSelect={() => {
                                        const newValue = value.includes(option)
                                            ? value.filter((item) => item !== option)
                                            : [...value, option];
                                        onChange(newValue);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value.includes(option) ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {option}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}


interface Option {
    id: string | number
    label: string
}

interface SingleComboboxProps {
    options: readonly Option[]
    value: string | number
    onChange: (value: string | number) => void
    placeholder?: string
}

export function SingleCombobox({
    options,
    value,
    onChange,
    placeholder = "Select an option...",
}: SingleComboboxProps) {
    const [open, setOpen] = React.useState(false)

    const selectedLabel = options.find((opt) => opt.id === value)?.label

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation() 
        onChange("") 
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <div
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm cursor-pointer hover:bg-accent/50 transition-colors focus-within:ring-2 focus-within:ring-ring",
                        "w-full"
                    )}
                    onClick={() => setOpen(!open)}
                >
                    <div className="flex items-center gap-2 truncate flex-1">
                        <span className={cn("truncate", !selectedLabel && "text-muted-foreground")}>
                            {selectedLabel ? selectedLabel : placeholder}
                        </span>
                    </div>

                    <div className="flex items-center gap-1 ml-2">
                        {value && (
                            <button
                                type="button"
                                onClick={handleClear}
                                className="rounded-full p-0.5 hover:bg-muted-foreground/20 transition-colors"
                            >
                                <X className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                            </button>
                        )}
                        <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                    </div>
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Command>
                    <CommandInput placeholder="Search..." />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup className="max-h-64 overflow-auto">
                            {options.map((option) => (
                                <CommandItem
                                    key={option.id}
                                    value={option.label}
                                    onSelect={() => {
                                        onChange(option.id)
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === option.id ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {option.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}