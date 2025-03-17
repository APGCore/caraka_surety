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
} from "@/components/_shadcn-ui/alert-dialog";
import { Button, buttonVariants } from "@/components/_shadcn-ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/_shadcn-ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/_shadcn-ui/table";
import RenderList from "@/components/atoms/render-list";
import { ShowingCountDatatable } from "@/components/molecules/datatable/count";
import { PaginationDatatable } from "@/components/molecules/datatable/pagination";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import React from "react";
import FormSkoringQuestionCategory from "./form-scoring-question-category";

interface ScoringQuestionCategoryDatatableProps {
  scoringQuestionCategories: any;
  onDelete: (scoringQuestionCategory: any) => void;
}

const ScoringQuestionCategoryDatatable: React.FC<ScoringQuestionCategoryDatatableProps> = ({
  scoringQuestionCategories,
  onDelete,
}) => {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-0">#</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Poin Maksimal</TableHead>
            <TableHead>Tanggal Dibuat</TableHead>
            <TableHead className="text-right" />
          </TableRow>
        </TableHeader>
        <TableBody>
          <RenderList
            of={scoringQuestionCategories?.data}
            render={(scoringQuestionCategory: any, index: number) => (
              <TableRow key={scoringQuestionCategory.id}>
                <TableCell>{scoringQuestionCategories?.meta?.from + index}</TableCell>
                <TableCell>{scoringQuestionCategory.name}</TableCell>
                <TableCell>{scoringQuestionCategory.max_point}</TableCell>
                <TableCell>{scoringQuestionCategory.created_at}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex h-8 w-8 p-0 group data-[state=open]:bg-zinc-500">
                        <DotsHorizontalIcon className="h-4 w-4 group-data-[state=open]:text-white" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-36 mr-8 mt-1">
                      <FormSkoringQuestionCategory isEdit scoringQuestionCategory={scoringQuestionCategory} />
                      <DropdownMenuSeparator />
                      <AlertDialog>
                        <AlertDialogTrigger className="bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 px-2 py-1.5 text-sm w-full rounded-sm text-start">
                          Delete
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete your scoringQuestionCategory
                              and remove your data from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => {
                                onDelete(scoringQuestionCategory);
                              }}
                              className={buttonVariants({ variant: "destructive" })}>
                              Continue Delete Scoring
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            )}
            renderFallback={() => (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No data found
                </TableCell>
              </TableRow>
            )}
          />
        </TableBody>
      </Table>
      <ShowingCountDatatable meta={scoringQuestionCategories?.meta} />
      <PaginationDatatable meta={scoringQuestionCategories?.meta} only={["scoringQuestionCategories"]} />
    </>
  );
};

export default ScoringQuestionCategoryDatatable;
