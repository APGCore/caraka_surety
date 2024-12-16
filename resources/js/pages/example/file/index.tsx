import { FileInput } from "@/components/common/input-file";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import ExampleLayoutPage from "@/layouts/example";
import { Head } from "@inertiajs/react";
import { useState } from "react";
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
      <Head title={pagePropsData?.page_settings?.title ?? "Pengguna"} />
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
