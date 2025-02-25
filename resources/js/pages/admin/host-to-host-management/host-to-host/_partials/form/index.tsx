import { useFetchGetAllGuarantor } from "@/common/hooks/react-query/guarantor";
import { Input } from "@/components/_shadcn-ui/input";
import { Label } from "@/components/_shadcn-ui/label";
import { Textarea } from "@/components/_shadcn-ui/textarea";
import { Combobox } from "@/components/molecules/combobox";
import { useId } from "react";

const HostToHostForm = ({ handleSubmit, data, setData }: { handleSubmit: () => void; data: any; setData: any }) => {
  const id = useId();
  const { data: guarantors } = useFetchGetAllGuarantor({
    is_head: true,
    host_not_exist: true,
    host_to_host_id: data.id,
  });
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      id={`form`}
      className="space-y-4">
      <div className="space-y-2">
        <Label className="text-md">Asuransi/Penjamin</Label>
        <Combobox
          id={`guarantor_id`}
          datas={Array.isArray(guarantors) ? guarantors : []}
          labelKey="name"
          valueKey="name"
          defaultValueId={data.guarantor_id ? Number(data.guarantor_id) : null}
          placeholder="Pilih Asuransi/Penjamin"
          onSelect={(val: any) => {
            setData({ ...data, guarantor_id: val.id });
          }}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${id}-url`}>URL</Label>
        <div className="flex rounded-lg shadow-sm shadow-black/5">
          <Input
            id={`${id}-url`}
            className=" shadow-none"
            placeholder="https:// ...."
            defaultValue={data.guarantor_url_host}
            type="text"
            onChange={(e) => setData({ ...data, guarantor_url_host: e.target.value })}
          />
        </div>
      </div>
      {/*auth_prefix*/}
      <div className="space-y-2">
        <Label htmlFor={`${id}-auth_prefix`}>Prefix Auth</Label>
        <div className="flex rounded-lg shadow-sm shadow-black/5">
          <Input
            id={`${id}-auth_prefix`}
            className=" shadow-none"
            placeholder="Isi dengan prefix auth boleh kosong"
            defaultValue={data.auth_prefix}
            type="text"
            onChange={(e) => setData({ ...data, auth_prefix: e.target.value })}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${id}-token`}>Token</Label>
        <Textarea
          id={`${id}-token`}
          placeholder="Isi dengan token yang diberikan"
          defaultValue={data.token}
          onChange={(e) => setData({ ...data, token: e.target.value })}
          aria-describedby={`${id}-token`}
        />
      </div>
    </form>
  );
};

export default HostToHostForm;
