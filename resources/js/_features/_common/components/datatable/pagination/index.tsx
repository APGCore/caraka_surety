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
  const generatePageNumbers = () => {
    const pages = [];
    const currentPage = meta.current_page;
    const lastPage = meta.last_page;
    const delta = 2; // Number of pages to show before and after current page

    // Always show first page
    pages.push(1);

    // Calculate range around current page
    let start = Math.max(2, currentPage - delta);
    let end = Math.min(lastPage - 1, currentPage + delta);

    // Add ellipsis after first page if needed
    if (start > 2) {
      pages.push("...");
    }

    // Add page numbers around current page
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Add ellipsis before last page if needed
    if (end < lastPage - 1) {
      pages.push("...");
    }

    // Always show last page if there is more than one page
    if (lastPage > 1) {
      pages.push(lastPage);
    }

    return pages;
  };

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
          {generatePageNumbers().map((page, index) =>
            page === "..." ? (
              <span key={`ellipsis-${index}`} className="flex items-center px-2">
                ...
              </span>
            ) : (
              <Button
                variant="outline"
                key={page}
                onClick={() => onPageChange(page as number)}
                className={cn(
                  page === meta.current_page ? "bg-black text-white hover:bg-black/80 hover:text-white" : "",
                  "flex text-sm items-center font-bold",
                )}>
                {page}
              </Button>
            ),
          )}
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
