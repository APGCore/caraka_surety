import { cn } from "@/common/utils/cn";
import React from "react";
import { Button } from "../../../_shadcn-ui/button";

interface ExportDocsButtonDatatableProps {
    className?: string;
    onClick: () => void;
}

const ExportDocsButtonDatatable: React.FC<ExportDocsButtonDatatableProps> = ({ className, onClick }) => {
    return (
        <Button className={cn(className)} onClick={onClick}>
            Export
        </Button>
    );
};

export default ExportDocsButtonDatatable;
