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

function formatRangeLabel(range) {
  if (range?.from && range?.to) {
    return `${format(range.from, "LLL d, y")} – ${format(range.to, "LLL d, y")}`;
  }
  if (range?.from) {
    return `${format(range.from, "LLL d, y")} – …`;
  }
  return null;
}

export function DateRangeField({ value, onChange, className, placeholder }) {
  const label = formatRangeLabel(value);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "field-control justify-start gap-2 font-normal hover:bg-muted/20",
            !label && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="size-4 shrink-0 opacity-70" />
          {label ?? (
            <span>{placeholder ?? "Pick date range"}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={value}
          onSelect={onChange}
          numberOfMonths={1}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

DateRangeField.propTypes = {
  value: PropTypes.shape({
    from: PropTypes.instanceOf(Date),
    to: PropTypes.instanceOf(Date),
  }),
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  placeholder: PropTypes.string,
};
