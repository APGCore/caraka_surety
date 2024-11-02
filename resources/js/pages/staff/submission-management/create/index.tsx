import { CalendarPicker } from "@/components/common/calendar";
import { Combobox } from "@/components/common/combobox";
import { FileInput } from "@/components/common/input-file";
import RenderList from "@/components/common/render-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import useGetAllBank from "@/hooks/api/bank/useGetAllBank";
import useGetGuarantorByProductId from "@/hooks/api/guarantor/useGetGuarantorByProductId";
import useGetAllProvince from "@/hooks/api/locations/useGetAllProvince";
import useGetDistrictByRegencyId from "@/hooks/api/locations/useGetDistrictByRegencyId";
import useGetRegencyByProvinceId from "@/hooks/api/locations/useGetRegencyByProvinceId";
import useGetAllObligee from "@/hooks/api/obligee/useGetAllObligee";
import useGetAllPrincipal from "@/hooks/api/principal/useGetAllPrincipal";
import useGetAllProduct from "@/hooks/api/product/useGetAllProduct";
import useGetProductTypesByProductAndGuarantor from "@/hooks/api/product/useGetProductTypesByProductAndGuarantor";
import useGetScoringById from "@/hooks/api/scoring/useGetScoringById";
import useGetSourceOfFund from "@/hooks/api/source-of-fund/useGetSourceOfFund";
import StaffLayoutPage from "@/layouts/staff";
import { useForm } from "@inertiajs/react";
import { useState } from "react";
import SubmissionCreateHeader from "./_partials/create-page-header";
import SumberDanaPengajuanSelect from "./_partials/sumber-dana";
import { SubmissionCreatePageProps } from "./create-page.type";

const SubmissionCreatePage: SubmissionCreatePageProps = () => {
  // Form State
  const [formSearchPrincipalState, setFormSearchPrincipalState] = useState<"idle" | "search" | "not-search">("idle");
  const { data, setData } = useForm();

  // Product
  const { products } = useGetAllProduct();
  const [selectedProducts, setSelectedProducts] = useState(null);

  // Principal
  const { principals } = useGetAllPrincipal();
  const [selectedPrincipal, setSelectedPrincipal] = useState(null);

  // Principal Province
  const { provinces: principalProvinces } = useGetAllProvince();
  const [selectedPrincipalProvince, setSelectedPrincipalProvince] = useState<{ id: number; name: string } | null>(null);

  // Principal Regency
  const { regencies: principalRegencies } = useGetRegencyByProvinceId({ province_id: selectedPrincipalProvince?.id });
  const [selectedPrincipalRegency, setSelectedPrincipalRegency] = useState<{ id: number; name: string } | null>(null);

  // Principal District
  const { districts: principalDistricts } = useGetDistrictByRegencyId({ regency_id: selectedPrincipalRegency?.id });
  const [selectedPrincipalDistrict, setSelectedPrincipalDistrict] = useState<{ id: number; name: string } | null>(null);

  // Job Location Province
  const { provinces: jobLocationProvinces } = useGetAllProvince();
  const [selectedJobLocationProvince, setSelectedJobLocationProvince] = useState<{ id: number; name: string } | null>(
    null,
  );

  // Job Location Regency
  const { regencies: jobLocationRegencies } = useGetRegencyByProvinceId({
    province_id: selectedJobLocationProvince?.id,
  });
  const [selectedJobLocationRegency, setSelectedJobLocationRegency] = useState<{ id: number; name: string } | null>(
    null,
  );

  // Job Location District
  const { districts: jobLocationDistricts } = useGetDistrictByRegencyId({ regency_id: selectedJobLocationRegency?.id });
  const [selectedJobLocationDistrict, setSelectedJobLocationDistrict] = useState<{ id: number; name: string } | null>(
    null,
  );

  // Guarantor
  const { guarantors } = useGetGuarantorByProductId({ selectedProductId: selectedProducts });
  const [selectedGuarantor, setSelectedGuarantor] = useState(null);
  const [isResetGuarantor, setIsResetGuarantor] = useState(false);

  // Product Type
  const { productTypes } = useGetProductTypesByProductAndGuarantor({
    selectedProductId: selectedProducts,
    selectedGuarantorId: selectedGuarantor,
  });
  const [selectedProductType, setSelectedProductType] = useState(null);
  const [isResetProductType, setIsResetProductType] = useState(false);

  // Source of Fund
  const { sourceOfFunds } = useGetSourceOfFund();
  const [selectedSourceOfFund, setSelectedSourceOfFund] = useState(null);

  // Obligee
  const { obligees } = useGetAllObligee();
  const [selectedObligee, setSelectedObligee] = useState(null);

  // Bank
  const { banks } = useGetAllBank();
  const [selectedBank, setSelectedBank] = useState(null);

  // SCORING
  const { scorings } = useGetScoringById({ selectedScoringId: 1 });
  const [selectedOptions, setSelectedOptions] = useState({});
  const scoringOptionIds = Object.values(selectedOptions);

  const handleOptionChange = (questionId: string, optionId: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  return (
    <div className="w-[800px] mt-[50px] mx-auto ">
      <form className="space-y-16">
        {formSearchPrincipalState === "idle" && (
          <div>
            <h2 className="text-2xl font-bold mb-3">Cari Data Perusahaan</h2>
            <div className="grid gap-[5px]">
              <Label className="text-md">Perusahaan</Label>
              <div className="flex gap-x-5">
                <Combobox
                  datas={principals}
                  labelKey="name"
                  valueKey="name"
                  placeholder="Pilih Data Perusahaan"
                  onSelect={(val: any) => {
                    setFormSearchPrincipalState("search");
                    setSelectedPrincipal(val);
                  }}
                />
                <Button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setFormSearchPrincipalState("not-search");
                  }}>
                  Tambah Data Baru
                </Button>
              </div>
            </div>
          </div>
        )}

        {(formSearchPrincipalState === "search" || formSearchPrincipalState === "not-search") && (
          <div>
            <div className="flex justify-between">
              <h2 className="text-2xl font-bold mb-3">
                {formSearchPrincipalState === "search" ? "Data" : "Tambah Data"} Perusahaan
              </h2>
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setFormSearchPrincipalState("idle");
                }}>
                Kembali Cari Data
              </Button>
            </div>
            <div className="grid gap-5">
              <div className="grid gap-[5px]">
                <Label className="text-md">Nama</Label>
                <Input className="text-md" placeholder="Nama perusahaan" />
              </div>
              <div className="grid gap-[5px]">
                <Label className="text-md">NPWP</Label>
                <Input className="text-md" placeholder="No NPWP" />
              </div>
              <div className="grid gap-[5px]">
                <Label className="text-md">No. Telepon</Label>
                <Input className="text-md" placeholder="No PIC Perusahaan" />
              </div>
              <div className="grid gap-[5px]">
                <Label className="text-md">NIB</Label>
                <Input className="text-md" placeholder="No NIB" />
              </div>
              <div className="grid gap-[5px]">
                <Label className="text-md">SIUP/SIUJK</Label>
                <Input className="text-md" placeholder="No SIUP/SIUJK" />
              </div>
              <div className="grid gap-[5px]">
                <Label className="text-md">Nama Direksi</Label>
                <Input className="text-md" placeholder="Nama Direksi Perusahaan" />
              </div>
              <div className="grid gap-[5px]">
                <Label className="text-md">Jabatan</Label>
                <Input className="text-md" placeholder="Jabatan PIC" />
              </div>
              <div className="grid gap-[5px]">
                <Label className="text-md">Nomor Handphone</Label>
                <Input className="text-md" placeholder="Nomor telepon Jabatan" />
              </div>
              <div className="grid gap-[5px]">
                <Label className="text-md">Komisaris</Label>
                <Input className="text-md" placeholder="Komisaris" />
              </div>
              <div className="grid gap-[5px]">
                <Label className="text-md">Perusahaan Berdiri Tahun</Label>
                <Input className="text-md" type="number" placeholder="Tahun berdiri perusahaan" />
              </div>
              <div className="grid gap-[5px]">
                <Label className="text-md">Akte Perubahan Terakhir</Label>
                <Input className="text-md" placeholder="Akte perubahan terakir" />
              </div>
              <div className="grid gap-[5px]">
                <Label className="text-md">Alamat Perusahaan</Label>
                <div className="grid gap-2 mt-2">
                  <div className="grid gap-[5px]">
                    <Label className="text-sm">Provinsi</Label>
                    <Combobox
                      datas={principalProvinces}
                      labelKey="name"
                      valueKey="name"
                      placeholder="Pilih Provinsi"
                      onSelect={(val: any) => {
                        setSelectedPrincipalProvince(val);
                      }}
                    />
                  </div>
                  <div className="grid gap-[5px]">
                    <Label className="text-sm">Kabupaten/Kota</Label>
                    <Combobox
                      datas={principalRegencies}
                      labelKey="name"
                      valueKey="name"
                      placeholder="Pilih Kabupaten/Kota"
                      onSelect={(val: any) => {
                        setSelectedPrincipalRegency(val);
                      }}
                    />
                  </div>
                  <div className="grid gap-[5px]">
                    <Label className="text-sm">Kecamatan</Label>
                    <Combobox
                      datas={principalDistricts}
                      labelKey="name"
                      valueKey="name"
                      placeholder="Pilih Kecamatan"
                      onSelect={(val: any) => {
                        setSelectedPrincipalDistrict(val);
                      }}
                    />
                  </div>
                  <div className="grid gap-[5px]">
                    <Label className="text-sm">Desa</Label>
                    <Input className="text-md" placeholder="Masukan nama Desa Perusahaan" />
                  </div>
                  <div className="grid gap-[5px]">
                    <Label className="text-sm">Alamat Lengkap</Label>
                    <Textarea className="text-md" placeholder="Masukan Jalan/RT/RW dsb." />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold mb-3">Kontrak</h2>
          <div className="grid gap-5">
            <div className="grid gap-[5px]">
              <Label className="text-md">Paket Pekerjaan</Label>
              <Input className="text-md" placeholder="Masukan Paket Pekerjaan" />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">Produk</Label>
              <Combobox
                datas={products}
                labelKey="name"
                valueKey="name"
                placeholder="Pilih Produk"
                onSelect={(val: any) => {
                  if (val.id !== selectedProducts) {
                    setSelectedGuarantor(null);
                    setSelectedProductType(null);
                    setIsResetGuarantor(true);
                    setIsResetProductType(true);
                  }
                  setSelectedProducts(val.id);
                }}
              />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">Asuransi/Penjamin</Label>
              <Combobox
                datas={guarantors}
                labelKey="name"
                valueKey="name"
                reset={isResetGuarantor}
                onReset={(resetVal) => setIsResetGuarantor(resetVal)}
                placeholder="Pilih Asuransi/Penjamin"
                onSelect={(val: any) => {
                  if (val.id !== selectedGuarantor) {
                    setSelectedProductType(null);
                    setIsResetProductType(true);
                  }
                  setSelectedGuarantor(val.id);
                }}
              />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">Jenis Jaminan</Label>
              <Combobox
                datas={productTypes}
                labelKey="name"
                valueKey="name"
                placeholder="Pilih Jenis Jaminan"
                reset={isResetProductType}
                onReset={(resetVal) => setIsResetProductType(resetVal)}
                onSelect={(val: any) => {
                  setSelectedProductType(val.id);
                }}
              />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">Obligee</Label>
              <Combobox
                datas={obligees}
                labelKey="name"
                valueKey="name"
                placeholder="Pilih Obligee"
                onSelect={(val: any) => {
                  setSelectedObligee(val.id);
                }}
              />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">Banks</Label>
              <Combobox
                datas={banks}
                labelKey="name"
                valueKey="name"
                placeholder="Pilih Bank"
                onSelect={(val: any) => {
                  setSelectedBank(val.id);
                }}
              />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">Jenis Dokumen</Label>
              <SumberDanaPengajuanSelect placeholder="Pilih Jenis Dokumen" />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">Nomor Dokumen</Label>
              <Input className="text-md" type="number" placeholder="Nomor Dokumen" />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">Tanggal Dokumen</Label>
              <CalendarPicker />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">Nilai Kontrak</Label>
              <Input className="text-md" type="number" placeholder="Nilai Kontrak" />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">Nilai Jaminan</Label>
              <Input className="text-md" type="number" placeholder="Nilai Jaminan" />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">Jangka Waktu</Label>
              <Input className="text-md" type="number" placeholder="Jangka Waktu" />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">Tanggal Terbit Jaminan</Label>
              <CalendarPicker />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">Sumber Dana</Label>
              <Combobox
                datas={sourceOfFunds}
                labelKey="name"
                valueKey="name"
                placeholder="Pilih Sumber Dana"
                onSelect={(val) => {
                  setSelectedSourceOfFund(val);
                }}
              />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">Lokasi Proyek</Label>
              <div className="grid gap-2 mt-2">
                <div className="grid gap-[5px]">
                  <Label className="text-sm">Provinsi</Label>
                  <Combobox
                    datas={principalProvinces}
                    labelKey="name"
                    valueKey="name"
                    placeholder="Pilih Provinsi"
                    onSelect={(val: any) => {
                      setSelectedPrincipalProvince(val);
                    }}
                  />
                </div>
                <div className="grid gap-[5px]">
                  <Label className="text-sm">Kabupaten/Kota</Label>
                  <Combobox
                    datas={principalRegencies}
                    labelKey="name"
                    valueKey="name"
                    placeholder="Pilih Kabupaten/Kota"
                    onSelect={(val: any) => {
                      setSelectedPrincipalRegency(val);
                    }}
                  />
                </div>
                <div className="grid gap-[5px]">
                  <Label className="text-sm">Kecamatan</Label>
                  <Combobox
                    datas={principalDistricts}
                    labelKey="name"
                    valueKey="name"
                    placeholder="Pilih Kecamatan"
                    onSelect={(val: any) => {
                      setSelectedPrincipalDistrict(val);
                    }}
                  />
                </div>
                <div className="grid gap-[5px]">
                  <Label className="text-sm">Desa</Label>
                  <Input className="text-md" placeholder="Masukan nama Desa" />
                </div>
                <div className="grid gap-[5px]">
                  <Label className="text-sm">Alamat Lengkap</Label>
                  <Textarea className="text-md" placeholder="Masukan Jalan/RT/RW dsb." />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-3">Dokumen Perusahaan</h2>
          <div className="grid gap-5">
            <div className="grid gap-[5px]">
              <Label className="text-md">Profil Perusahaan Principal</Label>
              <FileInput />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">Copy Akte Pendirian Perusahaan</Label>
              <FileInput />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">Copy KTP (Kartu Tanda Penduduk)</Label>
              <FileInput />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">Copy TDP (Tanda Daftar Perusahaan)</Label>
              <FileInput />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">Surat Izin Usaha Perdagangan (SIUP)</Label>
              <FileInput />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">Copy Nomor Pokok Wajib Pajak (NPWP)</Label>
              <FileInput />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">Surat Keterangan Domisili (SKDP/SITU)</Label>
              <FileInput />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">Copy Tanda Keanggotaan dari asosiasi Profesi KADIN/ GAPENSI/ARDIN</Label>
              <FileInput />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">Copy Neraca Laba Principal untuk 2 (dua) tahun terakhir</Label>
              <FileInput />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-8">Skoring</h2>
          <div className="grid gap-16">
            <RenderList
              of={scorings}
              render={(scoringCategories) => {
                return (
                  <div className="grid gap-[14px]">
                    <Label className="text-xl underline underline-offset-4">Kategori {scoringCategories?.name}</Label>
                    <div className="space-y-8">
                      <RenderList
                        of={scoringCategories?.questions}
                        render={(scoringQuestions, idx) => {
                          return (
                            <div className="space-y-3">
                              <div className="font-[600]">
                                <span className="mr-3">{idx + 1}.</span>
                                <span>{scoringQuestions?.name}</span>
                              </div>
                              <RadioGroup defaultValue="option-one" className="flex flex-col gap-y-3.5 ml-6">
                                <RenderList
                                  of={scoringQuestions?.options}
                                  render={(scoringOptions) => {
                                    return (
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                          value={scoringOptions?.name}
                                          id={scoringOptions?.name}
                                          onClick={() =>
                                            handleOptionChange(
                                              scoringQuestions.id,
                                              scoringOptions.id,
                                              //   scoringOptions.points,
                                            )
                                          }
                                        />
                                        <Label htmlFor="option-one">{scoringOptions?.name}</Label>
                                      </div>
                                    );
                                  }}
                                />
                              </RadioGroup>
                            </div>
                          );
                        }}
                      />
                    </div>
                  </div>
                );
              }}
            />
          </div>
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
