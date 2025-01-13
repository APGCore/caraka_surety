import { Combobox } from "@/components/common/combobox";
import InputError from "@/components/common/input-error";
import Label from "@/components/common/input-label";
import Loading from "@/components/common/loading";
import RenderList from "@/components/common/render-list";
import Input from "@/components/common/text-input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";
import ModalBranchOffice from "../modal";
import useBranchOfficeForm from "./form.hook";

interface Props {
  branchOffice?: any;
  routeSubmit: string;
  routeBack: string;
  type?: "cabang" | "mitra-pemasaran" | "mitra-agen";
}

const Form: React.FC<Props> = ({ branchOffice, routeSubmit, routeBack, type }) => {
  const {
    limitCreateGuarantor,
    data,
    setData,
    errors,
    processing,
    jobLocationProvinces,
    jobLocationRegencies,
    jobLocationDistricts,
    availableGuarantors,
    availableBranchGuarantors,
    pairingGuarantor,
    selectedGuarantor,
    setSelectedGuarantor,
    addGuarantor,
    deleteGuarantor,
    addBranchGuarantor,
    deleteBranchGuarantor,
    cancel,
    handleSubmitForm,
  } = useBranchOfficeForm({
    routeBack,
    routeSubmit,
    branchOffice,
    type,
  });

  const [isOpenModalAddGuarantor, setIsOpenModalAddGuarantor] = useState<boolean>(false);
  const [isOpenModalAddBranchGuarantor, setIsOpenModalAddBranchGuarantor] = useState<boolean>(false);

  return (
    <form onSubmit={handleSubmitForm} className="mt-6 space-y-10">
      <div className="grid gap-1 ">
        <p className="text-xl font-bold">Data Kantor Mitra Agen</p>
        <div className="grid gap-5 mt-2">
          <div className="flex gap-5">
            <div className="w-1/2 space-y-1">
              <Label htmlFor="code" value="Kode" />
              <Input
                id="code"
                value={data.code}
                onChange={(e) => setData("code", e.target.value)}
                required
                autoComplete="code"
                placeholder="Masukan Kode Mitra Agen"
              />
              <InputError className="mt-2" message={errors.code} />
            </div>

            <div className="w-1/2 space-y-1">
              <Label htmlFor="name" value="Nama" />
              <Input
                id="name"
                value={data.name}
                onChange={(e) => setData("name", e.target.value)}
                required
                autoComplete="name"
                placeholder="Masukan Nama Mitra Agen"
              />
              <InputError className="mt-2" message={errors.name} />
            </div>
          </div>
          <div className="flex gap-5">
            <div className="w-1/2 space-y-1">
              <Label htmlFor="email" value="Email" />
              <Input
                id="email"
                value={data.email}
                onChange={(e) => setData("email", e.target.value)}
                autoComplete="email"
                placeholder="Masukan Email Mitra Agen"
              />

              <InputError className="mt-2" message={errors.email} />
            </div>

            <div className="w-1/2 space-y-1">
              <Label htmlFor="phone" value="Telepon" />
              <Input
                id="phone"
                value={data.phone}
                onChange={(e) => setData("phone", e.target.value)}
                required
                autoComplete="phone"
                placeholder="Masukan Nomor Telepon Mitra Agen"
              />
              <InputError className="mt-2" message={errors.phone} />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-1 ">
        <p className="text-xl font-bold">Lokasi Kantor Mitra Agen</p>
        <div className="grid gap-5 mt-2">
          <div className="flex gap-5">
            <div className="grid gap-1 w-full">
              <Label className="text-sm">Provinsi</Label>
              <Combobox
                datas={jobLocationProvinces}
                labelKey="name"
                valueKey="name"
                placeholder="Pilih Provinsi"
                defaultValueId={data?.province_id}
                onSelect={(val: any) => {
                  setData("province_id", val.id);
                }}
              />
            </div>
            <div className="grid gap-1 w-full">
              <Label className="text-sm">Kabupaten/Kota</Label>
              <Combobox
                datas={jobLocationRegencies}
                labelKey="name"
                valueKey="name"
                placeholder="Pilih Kabupaten/Kota"
                defaultValueId={data?.regency_id}
                onSelect={(val: any) => {
                  setData("regency_id", val.id);
                }}
              />
            </div>
            <div className="grid gap-1 w-full">
              <Label className="text-sm">Kecamatan</Label>
              <Combobox
                datas={jobLocationDistricts}
                labelKey="name"
                valueKey="name"
                placeholder="Pilih Kecamatan"
                defaultValueId={data?.district_id}
                onSelect={(val: any) => {
                  setData("district_id", val.id);
                }}
              />
            </div>
          </div>
          <div className="flex items-start gap-5">
            <div className="grid gap-1 w-full">
              <Label className="text-sm">Desa</Label>
              <Input
                className="text-md"
                placeholder="Masukan nama desa"
                value={data.village}
                onChange={(e) => {
                  setData("village", e.currentTarget.value);
                }}
              />
            </div>

            <div className="grid gap-1 w-full">
              <Label className="text-sm">Kode Pos</Label>
              <Input
                className="text-md"
                placeholder="Masukan kode pos"
                value={data.postal_code}
                onChange={(e) => {
                  setData("postal_code", e.currentTarget.value);
                }}
              />
            </div>
          </div>
          <div>
            <div className="grid gap-1 w-full">
              <Label className="text-sm">Alamat Lengkap</Label>
              <Textarea
                className="text-md"
                placeholder="Masukan Jalan/RT/RW dsb."
                value={data?.address}
                onChange={(e) => {
                  setData("address", e.currentTarget.value);
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className=" space-y-8 ">
        <h1 className="text-xl font-bold">Pairing Asuransi</h1>
        <div className="space-y-10">
          <Button
            disabled={limitCreateGuarantor}
            className="w-full"
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsOpenModalAddGuarantor(true);
            }}>
            {limitCreateGuarantor ? "Mencapai Maksimum Asuransi yang Ada!" : "Tambah Asuransi"}
          </Button>
          <RenderList
            of={pairingGuarantor || []}
            render={(guarantor, guarantorIndex) => {
              return (
                <div key={guarantorIndex + 1} className="space-y-3 flex flex-col items-end border rounded-md p-2">
                  <div className="flex justify-between border p-2 items-center rounded-md w-[100%] ">
                    <div className="flex gap-2">
                      <span className="border border-black h-6 w-6 flex justify-center items-center rounded-full">
                        {guarantorIndex + 1}.
                      </span>
                      <div className=" flex flex-col ">
                        <span className="text-sm">Asuransi</span>
                        <span className="text-lg font-semibold">{guarantor?.name}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        className="max-w-[130px]"
                        onClick={() => {
                          setIsOpenModalAddBranchGuarantor(true);
                          setSelectedGuarantor(guarantor);
                        }}>
                        Tambah Cabang
                      </Button>
                      <Button
                        type="button"
                        variant={"destructive"}
                        className="max-w-[130px]"
                        onClick={() => deleteGuarantor(guarantor?.id)}>
                        Hapus
                      </Button>
                    </div>
                  </div>

                  <div className="w-full">
                    <RenderList
                      of={guarantor?.branches}
                      render={(branchGuarantor, branchGuarantorIndex) => (
                        <div key={branchGuarantorIndex} className="flex">
                          <span className=" text-3xl w-[10%] flex justify-center items-center">-</span>
                          <div className="w-full flex justify-between border p-2 items-center rounded-md ">
                            <div className=" flex flex-col ">
                              <span className="text-sm">Cabang Asuransi</span>
                              <span className="text-lg font-semibold">{branchGuarantor?.name}</span>
                            </div>
                            <Button
                              type="button"
                              variant={"destructive"}
                              onClick={() => {
                                deleteBranchGuarantor(guarantor?.id ?? 0, branchGuarantor?.id ?? 0);
                              }}>
                              Hapus Cabang
                            </Button>
                          </div>
                        </div>
                      )}
                    />
                  </div>
                </div>
              );
            }}
          />
        </div>
      </div>

      {/* Modal Pairing Guarantor */}
      <ModalBranchOffice
        type="add-pairing-guarantor"
        isOpen={isOpenModalAddGuarantor}
        guarantors={availableGuarantors}
        handleOpen={(openState) => {
          setIsOpenModalAddGuarantor(openState);
        }}
        handleSelectGuarantor={(guarantor) => {
          addGuarantor(guarantor);
          setIsOpenModalAddGuarantor(false);
        }}
      />

      {/* Modal Pairing Branch Guarantor */}
      <ModalBranchOffice
        type="add-pairing-branch-guarantor"
        isOpen={isOpenModalAddBranchGuarantor}
        branchGuarantors={availableBranchGuarantors}
        handleOpen={(openState) => {
          setIsOpenModalAddBranchGuarantor(openState);
        }}
        handleSelectBranchGuarantor={(branchGuarantor) => {
          if (selectedGuarantor?.id) {
            addBranchGuarantor(selectedGuarantor?.id, branchGuarantor);
          }
          setIsOpenModalAddBranchGuarantor(false);
        }}
      />

      <div className="flex items-center gap-4 justify-end">
        <Button variant={"destructive"} onClick={cancel}>
          Batal
        </Button>
        <Button disabled={processing}>
          <Loading isLoading={processing} className="mr-1" /> Simpan
        </Button>
      </div>
    </form>
  );
};

export default Form;
