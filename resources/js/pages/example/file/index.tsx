import { FileInput } from "@/components/common/input-file";
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
} from "@/components/ui/alert-dialog";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ExampleLayoutPage from "@/layouts/example";
import { cn } from "@/lib/cn";
import { Head, Link } from "@inertiajs/react";
import { FileIcon } from "lucide-react";
import { useRef, useState } from "react";
import { ExampleKaryawanPageProps } from "./example-karyawan.type";

const ExampleKaryawanPage: ExampleKaryawanPageProps = ({ users }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isReset, setIsReset] = useState<number>(0); // Use a number or timestamp

  const handleResetClick = () => {
    // Update the reset state with a unique value (e.g., current timestamp)
    setIsReset(Date.now());
  };

  return (
    <main className="space-y-2.5">
      <div className="max-w-md">
        <FileInput reset={isReset} onFileChange={setFile} />

        <Button onClick={() => handleResetClick()}>Reset</Button>
      </div>
    </main>
  );
};

export default ExampleKaryawanPage;

ExampleKaryawanPage.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <ExampleLayoutPage user={pagePropsData?.auth?.user}>
      <Head title={pagePropsData?.page_settings?.title ?? "Karyawan"} />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>File</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-3xl">{pagePropsData?.page_settings?.title}</h1>
      </div>
      {page}
    </ExampleLayoutPage>
  );
};
