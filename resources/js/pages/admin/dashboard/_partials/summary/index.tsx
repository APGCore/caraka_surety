import { getQueryParameter } from "@/common/utils/get-query-parameter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/_shadcn-ui/card";
import { CalendarDateRangePicker } from "@/components/molecules/calendar/daterange-calendar";
import ExportDocsButtonDatatable from "@/components/molecules/datatable/export";
import { router } from "@inertiajs/react";
import { subDays } from "date-fns";
import { pickBy } from "lodash";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { AdminDashboardProps } from "../../admin-dashboard-page.type";

const Summary: React.FC<AdminDashboardProps> = (props) => {
  const [filterDate, setFilterDate] = useState<DateRange | undefined>({
    from: new Date(props.defaultDateRange?.from || new Date()),
    to: new Date(props.defaultDateRange?.to || new Date()),
  });

  const exportExcel = () => {
    //
  };

  const convertDate = (date: DateRange | undefined) => {
    if (date?.from && date?.to) {
      return {
        from: date.from.toLocaleDateString("en-CA"),
        to: date.to.toLocaleDateString("en-CA"),
      };
    }

    return undefined;
  };

  const handleChangeDate = (dateRange: DateRange | undefined) => {
    setFilterDate(dateRange);

    if (dateRange?.from && dateRange?.to) {
      const dates = convertDate(dateRange);
      getData({ date: dates });
    }
  };

  const getData = ({ date = convertDate(filterDate) }: { date?: { from: string; to: string } }) => {
    router.get(
      route("admin.index"),
      pickBy({
        from: date?.from,
        to: date?.to,
        tab: "summary",
      }),
      { preserveState: true, preserveScroll: true },
    );
  };

  return (
    <div className="space-y-4">
      {/* Export & Range Tanggal */}
      <div className="flex justify-between items-end">
        <div className="flex gap-x-3">
          {/* <ExportDocsButtonDatatable onClick={exportExcel} /> */}
          <CalendarDateRangePicker value={filterDate} onDateChange={(date) => handleChangeDate(date)} />
        </div>
      </div>

      {/* Total Blanko */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Blanko</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{props.totalBlank}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Blanko Terpakai</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{props.totalUsedBlank}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Blanko Revisi</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{props.totalRevisedBlank}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Summary;
