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
import { Link } from "@inertiajs/react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import React from "react";
import FormSkoringQuestion from "./form-scoring-question";

interface ScoringQuestionDatatableProps {
    scoringQuestions: any;
    onDelete: (scoring: any) => void;
}

const ScoringQuestionDatatable: React.FC<ScoringQuestionDatatableProps> = ({ scoringQuestions, onDelete }) => {
    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-0">#</TableHead>
                        <TableHead>Nama</TableHead>
                        <TableHead>Jumlah Pilihan</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead className="text-right" />
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <RenderList
                        of={scoringQuestions?.data}
                        render={(scoring: any, index: number) => (
                            <TableRow key={scoring.id}>
                                <TableCell>{scoringQuestions?.meta?.from + index}</TableCell>
                                <TableCell>{scoring.name}</TableCell>
                                <TableCell>{scoring.count_options}</TableCell>
                                <TableCell>{scoring.created_at}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className="flex h-8 w-8 p-0 group data-[state=open]:bg-zinc-500">
                                                <DotsHorizontalIcon className="h-4 w-4 group-data-[state=open]:text-white" />
                                                <span className="sr-only">Open menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-max mr-8 mt-1">
                                            <Button asChild className="h-[32px] justify-start pl-3 rounded-sm">
                                                <Link
                                                    href={route("scoring-question.edit-options", {
                                                        scoringQuestion: scoring.id,
                                                    })}>
                                                    Pilihan pertanyaan
                                                </Link>
                                            </Button>
                                            <DropdownMenuSeparator />
                                            <FormSkoringQuestion isEdit scoring_question_category={scoring} />
                                            <DropdownMenuSeparator />
                                            <AlertDialog>
                                                <AlertDialogTrigger className="bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 px-2 py-1.5 text-sm w-full rounded-sm text-start">
                                                    Delete
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone. This will permanently delete
                                                            your scoring and remove your data from our servers.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => {
                                                                onDelete(scoring);
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
            <ShowingCountDatatable meta={scoringQuestions?.meta} />
            <PaginationDatatable meta={scoringQuestions?.meta} only={["scoringQuestions"]} />
        </>
    );
};

export default ScoringQuestionDatatable;
