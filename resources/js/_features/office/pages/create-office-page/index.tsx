import { Card, CardContent } from "@/_features/_common/components/_shadcn-ui/card";
import OfficeForm from "../../components/form";

const CreateOfficePage = () => {
  return (
    <main className="space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-3xl">Tambah Cabang BPR</h1>
      </div>
      <Card className="w-[800px] mx-auto">
        <CardContent>
          <OfficeForm office={null} />
        </CardContent>
      </Card>
    </main>
  );
};

export default CreateOfficePage;
