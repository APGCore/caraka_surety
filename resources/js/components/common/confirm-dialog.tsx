import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../_shadcn-ui/alert-dialog";
import { buttonVariants } from "../_shadcn-ui/button";

interface ConfirmDialogProps {
  open?: boolean;
  onOpenChange?: (openState: boolean) => void;
  value?: any;
  actionLabel: string;
  cancelLabel: string;
  triggerLabel: string;
  title: string;
  desription: string;
  onAction?: (value?: any) => void;
  type: "delete" | "warning" | "default";
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open = false,
  title,
  desription,
  onOpenChange,
  type,
  onAction,
  value,
  actionLabel,
  cancelLabel,
  triggerLabel,
}) => {
  const theme = {
    delete:
      "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 px-2 py-1.5 text-sm w-full rounded-sm text-start",
    warning:
      "bg-amber text-amber-foreground shadow-sm hover:bg-amber/90 px-2 py-1.5 text-sm w-full rounded-sm text-start",
    default:
      "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 px-2 py-1.5 text-sm w-full rounded-sm text-start",
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger className={theme[type]}>{triggerLabel}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{desription}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onAction?.(value);
            }}
            className={buttonVariants({ variant: type === "delete" ? "destructive" : "default" })}>
            {actionLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmDialog;
