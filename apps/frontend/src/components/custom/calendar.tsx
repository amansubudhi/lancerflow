"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface Calendar24Props {
    value: Date | undefined;
    onChange: (date: Date) => void;
    name?: string;
    onBlur?: () => void;
    ref?: React.Ref<any>;
}

export function Calendar24({ value, onChange, name, onBlur, ref }: Calendar24Props) {
    const [open, setOpen] = React.useState(false)

    return (
        <div className="flex gap-4">
            <div className="flex flex-col gap-3">
                <Label htmlFor="date" className="px-1">
                    Date
                </Label>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            id="date"
                            className="w-32 justify-between font-normal"
                            ref={ref}
                            onBlur={onBlur}
                            name={name}
                        >
                            {value ? value.toLocaleDateString() : "Select date"}
                            <ChevronDownIcon />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={value}
                            captionLayout="dropdown"
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
            <div className="flex flex-col gap-3">
                <Label htmlFor="time" className="px-1">
                    Time
                </Label>
                <Input
                    type="time"
                    id="time"
                    step="1"
                    defaultValue="10:30:00"
                    className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                />
            </div>
        </div>
    )
}
