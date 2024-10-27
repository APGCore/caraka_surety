import { cn } from "@/lib/cn";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { id as LocaleId } from "date-fns/locale";
import * as React from "react";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface CalendarPickerProps extends React.HTMLAttributes<HTMLDivElement> {
  onPickDate?: (date: Date | undefined) => void;
}

const CalendarPicker: React.FC<CalendarPickerProps> = ({ className, onPickDate }) => {
  const [date, setDate] = React.useState<Date | undefined>(() => new Date());
  const [isOpenCalendar, setIsOpenCalendar] = React.useState(false);

  return (
    <Popover open={isOpenCalendar} onOpenChange={setIsOpenCalendar}>
      <PopoverTrigger asChild>
        <Button
          id="date"
          variant={"outline"}
          className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground", className)}>
          {date ? (
            format(date, "PPP", {
              locale: LocaleId,
            })
          ) : (
            <span>Pilih Tanggal</span>
          )}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <Calendar
          locale={LocaleId}
          initialFocus
          mode="single"
          defaultMonth={date}
          selected={date}
          onSelect={(dt) => {
            onPickDate?.(dt);
            setDate(dt);
            setIsOpenCalendar(false);
          }}
          numberOfMonths={1}
        />
      </PopoverContent>
    </Popover>
  );
};

export { CalendarPicker };
