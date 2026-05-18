"use client";

import PropTypes from "prop-types";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function DateField({ value, onChange, className }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "field-control justify-start gap-2 font-normal hover:bg-muted/20",
            className
          )}
        >
          <CalendarIcon className="size-4 shrink-0 opacity-70" />
          {value ? (
            format(value, "PPP")
          ) : (
            <span className="text-muted-foreground">Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={value} onSelect={onChange} initialFocus />
      </PopoverContent>
    </Popover>
  );
}

DateField.propTypes = {
  value: PropTypes.instanceOf(Date),
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};
