import { Button } from "../ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "../ui/pagination";

export const PaginationDatatable = ({ meta }: { meta: any }) => {
  return (
    <Pagination>
      <PaginationContent>
        {meta?.links?.map((link: any, index: number) => {
          return (
            <PaginationItem key={index + 1}>
              {link.url === null ? (
                <Button variant="ghost" disabled>
                  {link.label}
                </Button>
              ) : (
                <PaginationLink
                  as="button"
                  preserveScroll
                  preserveState
                  only={["provinces"]}
                  isActive={link.active}
                  size={
                    link.label === "Previous" ||
                    link.label === "Next" ||
                    link.label === "Sebelumnya" ||
                    link.label === "Berikutnya"
                      ? "default"
                      : "icon"
                  }
                  href={link.url}>
                  {link.label}
                </PaginationLink>
              )}
            </PaginationItem>
          );
        })}
      </PaginationContent>
    </Pagination>
  );
};
