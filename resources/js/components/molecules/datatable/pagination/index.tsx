import { cn } from "@/common/utils/cn";
import { Button } from "../../../_shadcn-ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "../../../_shadcn-ui/pagination";
import RenderList from "../../../atoms/render-list";

interface PaginationDatatableProps {
    meta: any;
    only?: string[];
    className?: string;
}

export const PaginationDatatable = ({ meta, only, className }: PaginationDatatableProps) => {
    return (
        <Pagination className={cn(className)}>
            <PaginationContent>
                <RenderList
                    of={meta?.links}
                    render={(link: any, index: number) => {
                        return (
                            <PaginationItem key={index + 1}>
                                {link?.url === null ? (
                                    <Button variant="ghost" disabled>
                                        {link?.label}
                                    </Button>
                                ) : (
                                    <PaginationLink
                                        as="button"
                                        preserveScroll
                                        preserveState
                                        only={only}
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
                    }}
                />
            </PaginationContent>
        </Pagination>
    );
};
