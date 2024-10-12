import { cn } from "@/lib/cn";

interface ShowingCountDatatableProps {
  meta: any;
  className?: string;
}

export const ShowingCountDatatable = ({ meta, className }: ShowingCountDatatableProps) => {
  return (
    <div className={cn("text-sm text-gray-500", className)}>
      Menampilkan {meta?.from} hingga {meta?.to} dari {meta?.total} hasil
    </div>
  );
};
