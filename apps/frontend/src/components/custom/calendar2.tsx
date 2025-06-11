"use client"

import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useState } from "react"

interface CalendarProps {
    value: Date;
    onChange: (date: Date) => void;
    name?: string;
    onBlur?: () => void;
    ref?: React.Ref<any>;
}


function formatDate(date: Date | undefined) {
    if (!date) {
        return ""
    }

    return date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    })
}

// function isValidDate(date: Date | undefined) {
//     if (!date) {
//         return false
//     }
//     return !isNaN(date.getTime())
// }


export function Calendar28({ value, onChange, onBlur, name, ref }: CalendarProps) {
    const [open, setOpen] = useState(false)
    const [month, setMonth] = useState<Date | undefined>(value)

    return (
        <div className="flex flex-col gap-3">
            <div className="relative flex gap-2">
                <Input
                    id="date"
                    value={formatDate(value)}
                    className="bg-background pr-10"
                    onChange={() => { }}
                    onBlur={onBlur}
                    name={name}
                    ref={ref}
                />
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            id="date-picker"
                            variant="ghost"
                            className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                        >
                            <CalendarIcon className="size-3.5" />
                            <span className="sr-only">Select date</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="end"
                        alignOffset={-8}
                        sideOffset={10}
                    >
                        <Calendar
                            mode="single"
                            selected={value}
                            captionLayout="dropdown"
                            month={month}
                            onMonthChange={setMonth}
                            onSelect={(date) => {
                                if (date) {
                                    onChange(date)
                                    setOpen(false)
                                }
                            }}
                        />
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    )
}
