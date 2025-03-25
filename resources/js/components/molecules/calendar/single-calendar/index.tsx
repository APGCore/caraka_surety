import { cn } from "@/common/utils/cn";
import { CalendarIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { id as LocaleId } from "date-fns/locale";
import dayjs from "dayjs";
import * as React from "react";
import { Button } from "../../../_shadcn-ui/button";
import { Calendar, CalendarProps } from "../../../_shadcn-ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../../_shadcn-ui/popover";

type CalendarPickerProps = CalendarProps & {
  initialDate?: Date | string;
  onPickDate?: (date: Date | undefined | string) => void;
  className?: string;
  dateFormat?: string;
};

const CalendarPicker: React.FC<CalendarPickerProps> = ({
  className,
  onPickDate,
  initialDate,
  dateFormat = "YYYY-MM-DD",
  ...props
}) => {
  const [date, setDate] = React.useState<Date | undefined>(() => {
    if (initialDate) {
      if (typeof initialDate === "string") {
        return dayjs(initialDate).toDate();
      }
      return dayjs(initialDate).format(dateFormat) === dayjs(initialDate).format("YYYY-MM-DD")
        ? initialDate
        : dayjs(initialDate).toDate();
    }
    return dayjs().toDate();
  });
  const [isOpenCalendar, setIsOpenCalendar] = React.useState(false);

  React.useEffect(() => {
    if (initialDate) {
      if (typeof initialDate === "string") {
        setDate(dayjs(initialDate).toDate());
      } else {
        setDate(
          dayjs(initialDate).format(dateFormat) === dayjs(initialDate).format("YYYY-MM-DD")
            ? initialDate
            : dayjs(initialDate).toDate(),
        );
      }
    }
  }, [initialDate]);

  return (
    <Popover open={isOpenCalendar} onOpenChange={setIsOpenCalendar}>
      <PopoverTrigger asChild>
        <Button
          id="date"
          variant={"outline"}
          className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground", className)}>
          {date ? dayjs(date).format(dateFormat) : <span>Pilih Tanggal</span>}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="end">
        <Calendar
          {...props}
          locale={LocaleId}
          initialFocus
          mode="single"
          defaultMonth={date}
          selected={date}
          onSelect={(dt) => {
            if (dt) {
              onPickDate?.(dateFormat ? dayjs(dt).format(dateFormat) : dt);
              setDate(dt);
              setIsOpenCalendar(false);
            }
          }}
          numberOfMonths={1}
        />
      </PopoverContent>
    </Popover>
  );
};

export { CalendarPicker };
