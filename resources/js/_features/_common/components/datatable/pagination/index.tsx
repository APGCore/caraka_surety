import { cn } from "@/_features/_common/utils/cn";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../../_shadcn-ui/button";

interface PaginationProps {
  meta: {
    current_page: number;
    from: number;
    to: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  onPageChange: (page: number) => void;
}

// Contoh penggunaan di komponen
export const Pagination: React.FC<PaginationProps> = ({ meta, onPageChange }) => {
  return (
    <div className=" flex gap-5 mt-5 flex-col items-center">
      {/* Pagination buttons */}
      <div className="flex gap-8">
        <Button
          className={cn("flex text-sm items-center font-bold", {
            "cursor-not-allowed pointer-events-none": meta.current_page === 1,
          })}
          variant="outline"
          disabled={meta.current_page === 1}
          onClick={() => onPageChange(meta.current_page - 1)}>
          <ChevronLeft className="w-4 h-4" /> Previous
        </Button>

        {/* Generate page numbers */}
        <div className="flex gap-2">
          {Array.from({ length: meta.last_page }, (_, i) => i + 1).map((page) => (
            <Button
              variant="outline"
              key={page}
              onClick={() => onPageChange(page)}
              className={cn(
                page === meta.current_page ? "bg-black text-white hover:bg-black/80 hover:text-white" : "",
                "flex text-sm items-center font-bold",
              )}>
              {page}
            </Button>
          ))}
        </div>

        <Button
          variant="outline"
          className=" flex text-sm items-center font-bold"
          disabled={meta.current_page === meta.last_page}
          onClick={() => onPageChange(meta.current_page + 1)}>
          Next <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <p className="text-xs text-slate-400">
        Menampilkan {meta.from} sampai {meta.to} dari total {meta.total} data
      </p>
    </div>
  );
};
