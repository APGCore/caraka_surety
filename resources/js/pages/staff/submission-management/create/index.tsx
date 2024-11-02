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
import axios from "axios";
import { useState } from "react";
import SubmissionCreateHeader from "./_partials/create-page-header";
import SumberDanaPengajuanSelect from "./_partials/sumber-dana";
import { SubmissionCreatePageProps } from "./create-page.type";

const SubmissionCreatePage: SubmissionCreatePageProps = () => {
  // Product
  const { products } = useGetAllProduct();
  const [selectedProducts, setSelectedProducts] = useState(null);

  // Principal
  const { principals } = useGetAllPrincipal();
  const [selectedPrincipal, setSelectedPrincipal] = useState<object | null>(null);

  // Principal Documents
  const [principalDocs, setPrincipalDocs] = useState<Array<object>>([]);
  const [principalFiles, setPrincipalFiles] = useState<Array<object>>([]);

  const fetchPrincipalDocuments = (principalId: number) => {
    axios.get(route("references.principal.documents", { principal_id: principalId })).then((response) => {
      setPrincipalDocs(response.data.data);
    });
  };

  const changePrincipalDoc = (file: File | null, document: object) => {
    const newFiles = principalFiles.filter((doc) => doc.required_doc_id !== document.id);
    if (file) {
      newFiles.push({ required_doc_id: document.id, required_doc_name: document.name, file });
    }
    setData("principal", { ...data.principal, documents: newFiles });
    setPrincipalFiles(newFiles);
  };

  // Principal Province
  const { provinces: principalProvinces } = useGetAllProvince();
  const [selectedPrincipalProvince, setSelectedPrincipalProvince] = useState<{
    id: number;
    name: string;
  } | null>(null);

  // Principal Regency
  const { regencies: principalRegencies } = useGetRegencyByProvinceId({ province_id: selectedPrincipalProvince?.id });
  const [selectedPrincipalRegency, setSelectedPrincipalRegency] = useState<{ id: number; name: string } | null>(null);

  // Principal District
  const { districts: principalDistricts } = useGetDistrictByRegencyId({ regency_id: selectedPrincipalRegency?.id });
  const [selectedPrincipalDistrict, setSelectedPrincipalDistrict] = useState<{
    id: number;
    name: string;
  } | null>(null);

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
  const [selectedProductType, setSelectedProductType] = useState<object | null>(null);
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

  // Form State
  const [formSearchPrincipalState, setFormSearchPrincipalState] = useState<"idle" | "search" | "not-search">("idle");

  const { data, setData } = useForm({
    principal: {
      id: "",
      province_id: undefined,
      regency_id: undefined,
      disctrict_id: undefined,
      village: "",
      name: "",
      address: "",
      telephone: "",
      fax: "",
      npwp: "",
      nib: "",
      siup_siujk: "",
      head_name: "",
      director_name: "",
      director_position: "",
      director_phone: "",
      commissioner: "",
      year_established: "",
      last_deed: "",
      documents: [],
    },
  });

  console.log(data.principal);

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
                    fetchPrincipalDocuments(val.id);
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
          <>
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
                  <Input
                    className="text-md"
                    placeholder="Nama perusahaan"
                    value={data.principal.name}
                    onChange={(e) =>
                      setData("principal", {
                        ...data.principal,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-[5px]">
                  <Label className="text-md">NPWP</Label>
                  <Input
                    className="text-md"
                    placeholder="No NPWP"
                    value={data.principal.npwp}
                    onChange={(e) =>
                      setData("principal", {
                        ...data.principal,
                        npwp: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-[5px]">
                  <Label className="text-md">No. Telepon</Label>
                  <Input
                    className="text-md"
                    placeholder="No Telepon Perusahaan"
                    value={data.principal.telephone}
                    onChange={(e) =>
                      setData("principal", {
                        ...data.principal,
                        telephone: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-[5px]">
                  <Label className="text-md">NIB</Label>
                  <Input
                    className="text-md"
                    placeholder="No NIB"
                    value={data.principal.nib}
                    onChange={(e) =>
                      setData("principal", {
                        ...data.principal,
                        nib: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-[5px]">
                  <Label className="text-md">SIUP/SIUJK</Label>
                  <Input
                    className="text-md"
                    placeholder="No SIUP/SIUJK"
                    value={data.principal.siup_siujk}
                    onChange={(e) =>
                      setData("principal", {
                        ...data.principal,
                        siup_siujk: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-[5px]">
                  <Label className="text-md">Nama Direksi</Label>
                  <Input
                    className="text-md"
                    placeholder="Nama Direksi Perusahaan"
                    value={data.principal.director_name}
                    onChange={(e) =>
                      setData("principal", {
                        ...data.principal,
                        director_name: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-[5px]">
                  <Label className="text-md">Jabatan</Label>
                  <Input
                    className="text-md"
                    placeholder="Jabatan PIC"
                    value={data.principal.director_position}
                    onChange={(e) =>
                      setData("principal", {
                        ...data.principal,
                        director_position: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-[5px]">
                  <Label className="text-md">Nomor Handphone</Label>
                  <Input
                    className="text-md"
                    placeholder="Nomor telepon Jabatan"
                    value={data.principal.director_phone}
                    onChange={(e) =>
                      setData("principal", {
                        ...data.principal,
                        director_phone: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-[5px]">
                  <Label className="text-md">Komisaris</Label>
                  <Input
                    className="text-md"
                    placeholder="Komisaris"
                    value={data.principal.commissioner}
                    onChange={(e) =>
                      setData("principal", {
                        ...data.principal,
                        commissioner: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-[5px]">
                  <Label className="text-md">Perusahaan Berdiri Tahun</Label>
                  <Input
                    className="text-md"
                    type="number"
                    placeholder="Tahun berdiri perusahaan"
                    value={data.principal.year_established}
                    onChange={(e) =>
                      setData("principal", {
                        ...data.principal,
                        year_established: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid gap-[5px]">
                  <Label className="text-md">Akte Perubahan Terakhir</Label>
                  <Input
                    className="text-md"
                    placeholder="Akte perubahan terakir"
                    value={data.principal.last_deed}
                    onChange={(e) =>
                      setData("principal", {
                        ...data.principal,
                        last_deed: e.target.value,
                      })
                    }
                  />
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
                          setData("principal", { ...data.principal, province_id: val.id });
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
                          setData("principal", { ...data.principal, regency_id: val?.id });
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
                          setData("principal", { ...data.principal, disctrict_id: val?.id });
                          setSelectedPrincipalDistrict(val);
                        }}
                      />
                    </div>
                    <div className="grid gap-[5px]">
                      <Label className="text-sm">Desa</Label>
                      <Input
                        className="text-md"
                        placeholder="Masukan nama Desa Perusahaan"
                        value={data.principal.village}
                        onChange={(e) =>
                          setData("principal", {
                            ...data.principal,
                            village: e.target.value,
                          })
                        }
                      />
                    </div>
                    {/* <div className="grid gap-[5px]">
                    <Label className="text-sm">Alamat Lengkap</Label>
                    <Textarea className="text-md" placeholder="Masukan Jalan/RT/RW dsb." />
                  </div> */}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-3">Dokumen Perusahaan</h2>
              <div className="grid gap-5">
                <RenderList
                  of={principalDocs}
                  render={(doc) => {
                    return (
                      <div className="grid gap-[5px]">
                        <Label className="text-md">{doc.name}</Label>
                        <FileInput
                          onFileChange={(file: File | null) => changePrincipalDoc(file, doc)}
                          previewValue={doc.principal_document?.path}
                          required={doc.product_type_id == null || selectedProductType?.id === doc.product_type_id}
                        />
                      </div>
                    );
                  }}
                />
              </div>
            </div>
          </>
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
