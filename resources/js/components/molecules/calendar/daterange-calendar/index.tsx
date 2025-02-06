import { cn } from "@/common/utils/cn";
import { Button } from "@/components/_shadcn-ui/button";
import { Calendar } from "@/components/_shadcn-ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/_shadcn-ui/popover";
import { CalendarIcon } from "@radix-ui/react-icons";
import { addDays, format } from "date-fns";
import * as React from "react";
import { DateRange } from "react-day-picker";

interface CalendarDateRangePickerProps extends React.HTMLAttributes<HTMLDivElement> {
  onDateChange?: (date: DateRange | undefined) => void;
  value?: DateRange;
}

const CalendarDateRangePicker: React.FC<CalendarDateRangePickerProps> = ({ className, onDateChange, value }) => {
  const [date, setDate] = React.useState<DateRange | undefined>(
    value || {
      from: new Date(),
      to: addDays(new Date(), 7),
    },
  );

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn("w-[260px] justify-start text-left font-normal", !date && "text-muted-foreground")}>
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(dt) => {
              onDateChange?.(dt);
              setDate(dt);
            }}
            numberOfMonths={1}
            disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export { CalendarDateRangePicker };
