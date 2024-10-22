import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import StaffLayoutPage from "@/layouts/staff";
import SubmissionCreateHeader from "./_partials/create-page-header";
import { SubmissionCreatePageProps } from "./create-page.type";

const SubmissionCreatePage: SubmissionCreatePageProps = () => {
  return (
    <div className="w-[800px] mt-[50px] mx-auto ">
      <form className="grid gap-6">
        <div className="grid gap-[5px]">
          <Label className="text-md">Nama</Label>
          <Input className="text-md" />
        </div>
        <div className="grid gap-[5px]">
          <Label className="text-md">NPWP</Label>
          <Input className="text-md" />
        </div>
        <div className="grid gap-[5px]">
          <Label className="text-md">No. Telepon</Label>
          <Input className="text-md" />
        </div>
        <div className="grid gap-[5px]">
          <Label className="text-md">NIB</Label>
          <Input className="text-md" />
        </div>
        <div className="grid gap-[5px]">
          <Label className="text-md">SIUP/SIUJK</Label>
          <Input className="text-md" />
        </div>
        <div className="grid gap-[5px]">
          <Label className="text-md">Nama Direksi</Label>
          <Input className="text-md" />
        </div>
        <div className="grid gap-[5px]">
          <Label className="text-md">Jabatan</Label>
          <Input className="text-md" />
        </div>
        <div className="grid gap-[5px]">
          <Label className="text-md">Nomor Handphone</Label>
          <Input className="text-md" />
        </div>
        <div className="grid gap-[5px]">
          <Label className="text-md">Komisaris</Label>
          <Input className="text-md" />
        </div>
        <div className="grid gap-[5px]">
          <Label className="text-md">Perusahaan Berdiri Tahun</Label>
          <Input className="text-md" />
        </div>
        <div className="grid gap-[5px]">
          <Label className="text-md">Akte Perubahan Terakhir</Label>
          <Input className="text-md" />
        </div>
        <div className="grid gap-[5px]">
          <Label className="text-md">Alamat</Label>
          <Textarea className="text-md" />
        </div>
      </form>
    </div>
  );
};

export default SubmissionCreatePage;

SubmissionCreatePage.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <StaffLayoutPage user={pagePropsData?.auth?.user}>
      <SubmissionCreateHeader title={pagePropsData?.page_settings?.title} />
      {page}
    </StaffLayoutPage>
  );
};
