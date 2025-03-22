import { Card, CardContent } from "@/_features/_common/components/_shadcn-ui/card";
import OfficeForm from "../../components/form";

interface EditOfficePageProps {
  office: any;
}

const EditOfficePage = ({ office }: EditOfficePageProps) => {
  return (
    <main className="space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-3xl">Ubah Cabang BPR</h1>
      </div>
      <Card className="w-[800px] mx-auto">
        <CardContent>
          <OfficeForm office={office} />
        </CardContent>
      </Card>
    </main>
  );
};

export default EditOfficePage;
