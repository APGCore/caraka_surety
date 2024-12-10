import { CalendarPicker } from "@/components/common/calendar";
import { Combobox } from "@/components/common/combobox";
import InputCurrency from "@/components/common/input-currency";
import { FileInput } from "@/components/common/input-file";
import RenderList from "@/components/common/render-list";
import Show from "@/components/common/show";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useCompareRatios } from "@/hooks/general/use-compare-ratios";
import { toast } from "@/hooks/general/use-toast";
import StaffLayoutPage from "@/layouts/staff";
import { cn } from "@/lib/cn";
import { getNumericValue } from "@/lib/get-numeric-value";
import { useForm } from "@inertiajs/react";
import axios from "axios";
import { subDays } from "date-fns";
import dayjs from "dayjs";
import { LoaderCircle } from "lucide-react";
import { Fragment, useCallback, useState } from "react";
import SubmissionCreateHeader from "./_partials/create-page-header";
import { ISelectedPrincipalDistrict, Ratio, SubmissionCreatePageProps, SubmissionFormProps } from "./create-page.type";

const SubmissionCreatePage: SubmissionCreatePageProps = () => {
  // Product
  const { products } = useGetAllProduct();
  const [selectedProducts, setSelectedProducts] = useState(null);

  // Principal
  const { principals } = useGetAllPrincipal();

  // Principal Documents
  const [principalDocs, setPrincipalDocs] = useState<
    Array<{
      id: number;
      name: string;
      principal_document: {
        path: string;
      } | null;
      doc: string;
      file: File;
    }>
  >([]);

  const [principalFiles, setPrincipalFiles] = useState<
    Array<{
      required_doc_id: number;
      required_doc_name: string;
      file: File;
    }>
  >([]);

  const defaultPrincipalRatios: Ratio = {
    current_assets: "",
    current_debt: "",
    total_debt: "",
    total_assets: "",
    revenue: "",
    net_income: "",
    year: dayjs().year(),
  };

  const { data, setData, post, processing } = useForm<SubmissionFormProps>({
    principal: {
      id: "",
      province_id: undefined,
      regency_id: undefined,
      district_id: undefined,
      village: "",
      name: "",
      address: "",
      telephone: undefined,
      fax: "",
      npwp: undefined,
      nib: undefined,
      siup_siujk: "",
      head_name: "",
      director_name: "",
      director_position: "",
      director_phone: undefined,
      commissioner: "",
      year_established: undefined,
      last_deed: "",
      documents: [],
      ratios: [
        defaultPrincipalRatios,
        {
          ...defaultPrincipalRatios,
          year: dayjs().year() - 1,
        },
      ],
    },
    obligee: {
      id: "",
      name: "",
      pic: "",
      address: "",
      no_ppk: "",
      telephone: "",
    },
    submission: {
      guarantor_id: "",
      product_id: "",
      guarantor_to_product_type_id: "",
      obligee_id: "",
      bank_id: "",
      contract_doc_name: "",
      contract_doc_number: "",
      contract_doc_date: new Date(),
      contract_value: "",
      guarantee_value: "",
      time_period: "",
      start_date: new Date(),
      end_date: new Date(),
      job_name: "",
      job_location_province_id: "",
      job_location_regency_id: "",
      job_location_district_id: "",
      job_location_village: "",
      job_location_address: "",
      source_of_fund_id: "",
      note: "",
    },

    scoring: {
      id: 1,
      note: "",
      scores: [],
      min_point: 0,
    },
  });

  const years: Array<number> = Array.from({ length: 20 }, (_, i) => dayjs().year() - i);
  const { comparisonRatios, handleComparisonRatios } = useCompareRatios();

  const calculateRatios = (value1: string, value2: string) => {
    const result = (Number(value1) / Number(value2)).toFixed(2);

    return result === "Infinity" ? undefined : isNaN(Number(result)) ? undefined : result;
  };

  const fetchPrincipalDocuments = (principalId?: number) => {
    axios.get(route("references.principal.documents", { principal_id: principalId })).then((response) => {
      // console.log(response.data.data);
      setPrincipalDocs(response.data.data);
    });
  };

  const fetchPrincipalRatios = async (principalId?: number) => {
    return await axios.get(route("references.principal.ratios", principalId)).then((response) => {
      // console.log(response.data.data);
      if (response.data.data.length > 0) {
        return response.data.data;
      } else {
        return [defaultPrincipalRatios, { ...defaultPrincipalRatios, year: dayjs().year() - 1 }];
      }
    });
  };

  const changePrincipalDoc = (
    file: File | null,
    document: {
      id: number;
      name: string;
      file: File;
    },
  ) => {
    const newFiles = principalFiles.filter((doc) => doc?.required_doc_id !== document?.id);
    if (file) {
      newFiles.push({ required_doc_id: document?.id, required_doc_name: document?.name, file });
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
  const { regencies: principalRegencies } = useGetRegencyByProvinceId({
    province_id: data?.principal?.province_id || selectedPrincipalProvince?.id,
  });
  const [selectedPrincipalRegency, setSelectedPrincipalRegency] = useState<{ id: number; name: string } | null>(null);

  // Principal District
  const { districts: principalDistricts } = useGetDistrictByRegencyId({
    regency_id: data?.principal?.regency_id || selectedPrincipalRegency?.id,
  });

  const [selectedPrincipalDistrict, setSelectedPrincipalDistrict] = useState<ISelectedPrincipalDistrict | null>(null);

  // Job Location Province
  const { provinces: jobLocationProvinces } = useGetAllProvince();
  const [selectedJobLocationProvince, setSelectedJobLocationProvince] = useState<{ id: number; name: string } | null>(
    null,
  );

  // Job Location Regency
  const { regencies: jobLocationRegencies } = useGetRegencyByProvinceId({
    province_id: data?.submission?.job_location_province_id || selectedJobLocationProvince?.id,
  });
  const [selectedJobLocationRegency, setSelectedJobLocationRegency] = useState<{ id: number; name: string } | null>(
    null,
  );

  // Job Location District
  const { districts: jobLocationDistricts } = useGetDistrictByRegencyId({
    regency_id: data?.submission?.job_location_regency_id || selectedJobLocationRegency?.id,
  });
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
  const [selectedObligee, setSelectedObligee] = useState<{
    id?: number;
    name?: string;
    pic?: string;
    address?: string;
    no_ppk?: string;
    telephone?: string;
  } | null>({});
  const [isAddNewObligee, setIsAddNewObligee] = useState(false);

  const handleNewObligee = useCallback(() => {
    const isHaveDataObligee =
      data.obligee.name !== "" ||
      data.obligee.pic !== "" ||
      data.obligee.address !== "" ||
      data.obligee.no_ppk !== "" ||
      data.obligee.id !== "" ||
      data.obligee.telephone !== "";

    console.log({
      isHaveDataObligee,
      isAddNewObligee,
      obg: data.obligee,
    });

    if (!isAddNewObligee) {
      if (isHaveDataObligee) {
        setData("obligee", {
          id: "",
          name: "",
          pic: "",
          address: "",
          no_ppk: "",
          telephone: "",
        });
        setSelectedObligee(null);
      }
    }
    setIsAddNewObligee((prev) => !prev);
  }, [
    data.obligee.id,
    data.obligee.name,
    data.obligee.no_ppk,
    data.obligee.pic,
    data.obligee.address,
    data.obligee.telephone,
    isAddNewObligee,
  ]);

  // Bank
  const { banks } = useGetAllBank();
  const [selectedBank, setSelectedBank] = useState(null);

  // SCORING
  const { scorings } = useGetScoringById({
    selectedScoringId: 1,
  });

  // Form State
  const [formSearchPrincipalState, setFormSearchPrincipalState] = useState<"idle" | "search" | "not-search">("idle");

  const [formStep, setFormStep] = useState<"principal" | "docs" | "contract" | "skoring">("principal");
  const [steps, setSteps] = useState([
    {
      title: "Profile",
      name: "principal",
      isActive: true,
    },
    {
      title: "Dokumen",
      name: "docs",
      isActive: false,
    },
    {
      title: "Kontrak",
      name: "contract",
      isActive: false,
    },
    {
      title: "Skoring",
      name: "skoring",
      isActive: false,
    },
  ]);

  const handleActiveStep = (targetStep: string) => {
    const targetIndex = steps.findIndex((step) => step.name === targetStep);
    const updatedSteps = steps.map((step, index) => ({
      ...step,
      isActive: index <= targetIndex,
    }));
    setSteps(updatedSteps);
  };

  const handleClickStep = (stepName: string) => {
    setFormStep(stepName as "principal" | "docs" | "contract" | "skoring");
    handleActiveStep(stepName);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNextStepForm = () => {
    if (formStep === "principal") {
      handleClickStep("docs");
    } else if (formStep === "docs") {
      handleClickStep("contract");
    } else if (formStep === "contract") {
      handleClickStep("skoring");
    }
  };

  const handlePrevStepForm = () => {
    if (formStep === "docs") {
      handleClickStep("principal");
    } else if (formStep === "contract") {
      handleClickStep("docs");
    } else if (formStep === "skoring") {
      handleClickStep("contract");
    }
  };

  const handleOptionChange = (questionCategoryId: string, questionId: string, optionId: string, val: string) => {
    const existingScoreIndex = data.scoring.scores.findIndex((s) => s.scoring_question_id === questionId);

    // If score with the same questionId exists, update it
    if (existingScoreIndex !== -1) {
      const updatedScores = [...data.scoring.scores];
      updatedScores[existingScoreIndex] = {
        ...updatedScores[existingScoreIndex],
        scoring_question_category_id: questionCategoryId,
        scoring_option_id: optionId,
        point: val,
      };

      setData("scoring", {
        ...data.scoring,
        scores: updatedScores,
      });
    } else {
      // If no matching score is found, add a new entry
      setData("scoring", {
        ...data.scoring,
        scores: [
          ...data.scoring.scores,
          {
            scoring_question_category_id: questionCategoryId,
            scoring_question_id: questionId,
            scoring_option_id: optionId,
            point: val,
          },
        ],
      });
    }
  };

  const handleReset = () => {
    setData({
      principal: {
        id: "",
        province_id: undefined,
        regency_id: undefined,
        district_id: undefined,
        village: "",
        name: "",
        address: "",
        telephone: undefined,
        fax: "",
        npwp: "",
        nib: undefined,
        siup_siujk: "",
        head_name: "",
        director_name: "",
        director_position: "",
        director_phone: undefined,
        commissioner: "",
        year_established: undefined,
        last_deed: "",
        documents: [],
        ratios: [],
      },
      obligee: {
        id: "",
        name: "",
        pic: "",
        address: "",
        no_ppk: "",
        telephone: "",
      },
      submission: {
        guarantor_id: "",
        product_id: undefined,
        guarantor_to_product_type_id: "",
        obligee_id: "",
        bank_id: "",
        contract_doc_name: "",
        contract_doc_number: "",
        contract_doc_date: new Date(),
        contract_value: "",
        guarantee_value: "",
        time_period: "",
        start_date: new Date(),
        end_date: new Date(),
        job_name: "",
        job_location_province_id: "",
        job_location_regency_id: "",
        job_location_district_id: "",
        job_location_village: "",
        job_location_address: "",
        source_of_fund_id: "",
        note: "",
      },

      scoring: {
        id: 1,
        note: "",
        scores: [],
        min_point: 0,
      },
    });
    setFormStep("principal");
    setIsAddNewObligee(false);
    setPrincipalDocs([]);
    setPrincipalFiles([]);
    setSelectedBank(null);
    setSelectedGuarantor(null);
    setSelectedObligee(null);
    setSelectedPrincipalDistrict(null);
    setSelectedPrincipalProvince(null);
    setSelectedPrincipalRegency(null);
    setSelectedProductType(null);
    setSelectedProducts(null);
    setSelectedSourceOfFund(null);
    setSelectedJobLocationProvince(null);
    setSelectedJobLocationRegency(null);
    setSelectedJobLocationDistrict(null);
    setFormSearchPrincipalState("idle");
  };

  const handleSubmit = () => {
    post(route("staff-submission-form.store"), {
      preserveState: true,
      preserveScroll: true,

      onError: (errors) => {
        console.log(errors);
        toast({
          title: "Gagal",
          description: "Terjadi kesalahan saat menyimpan data. Silahkan coba lagi",
          variant: "destructive",
        });
      },
      onSuccess: () => {
        console.log("success");
        handleReset();
      },
    });
  };

  return (
    <div className="w-[800px] mt-[50px] mx-auto ">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="space-y-16">
        {/* FORMSTATE NOT SEARCH / HAVE SEARCH PRINCIPAL*/}
        <Show when={formSearchPrincipalState === "idle"}>
          <div>
            <h2 className="text-2xl font-bold mb-3">Cari Data Perusahaan</h2>
            <div className="grid gap-1">
              <Label className="text-md">Perusahaan</Label>
              <div className="flex gap-x-5">
                <Combobox
                  datas={principals}
                  labelKey="name"
                  valueKey="name"
                  placeholder="Pilih Data Perusahaan"
                  onSelect={async (val: any) => {
                    setFormSearchPrincipalState("search");
                    const ratios = await fetchPrincipalRatios(val.id);
                    // SETTING PRINCIPAL DATA
                    setData("principal", {
                      ...data.principal,
                      id: val.id,
                      province_id: val.province_id,
                      regency_id: val.regency_id,
                      district_id: val.district_id,
                      village: val.village,
                      name: val.name,
                      address: val.address,
                      telephone: val.telephone,
                      fax: val.fax,
                      npwp: val.npwp,
                      nib: val.nib,
                      siup_siujk: val.siup_siujk,
                      head_name: val.head_name,
                      director_name: val.director_name,
                      director_position: val.director_position,
                      director_phone: val.director_phone,
                      commissioner: val.commissioner,
                      year_established: val.year_established,
                      last_deed: val.last_deed,
                      ratios,
                    });

                    fetchPrincipalDocuments(val.id);
                    handleComparisonRatios(ratios);
                  }}
                />
                <Button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setFormSearchPrincipalState("not-search");
                    fetchPrincipalDocuments();
                  }}>
                  Tambah Data Baru
                </Button>
              </div>
            </div>
          </div>
        </Show>

        {/* FORMSTATE HAVE CHOOSE TO SEARCH/NOT PRINCIPAL */}
        <Show when={formSearchPrincipalState === "search" || formSearchPrincipalState === "not-search"}>
          <>
            {/* STEPPER INDICATOR */}
            <div className="flex">
              <RenderList
                of={steps}
                render={(step, index) => {
                  return (
                    <Fragment>
                      {/* STEPPER BULLET */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleClickStep(step.name);
                        }}
                        className="flex items-center cursor-pointer flex-col justify-center">
                        <div
                          className={cn(
                            "flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 bg-gray-300 text-gray-700",
                            {
                              "bg-black text-white": step.isActive,
                            },
                          )}>
                          {index + 1}
                        </div>

                        {/* STEPPER LABEL */}
                        <span
                          className={cn("transition-all duration-300 text-gray-500", {
                            "text-black font-semibold": step.isActive,
                          })}>
                          {step.title}
                        </span>
                      </button>

                      {/* ARROW BETWEEN STEPPER */}
                      {index < steps.length - 1 && (
                        <div
                          className={cn("w-full mt-5 h-1 mx-5 transition-all duration-300 bg-gray-300", {
                            "bg-black": steps[index + 1].isActive,
                          })}
                        />
                      )}
                    </Fragment>
                  );
                }}
              />
            </div>

            {/* PRINCIPAL SECTION */}
            <Show when={formStep === "principal"}>
              <div>
                <div className="flex justify-between">
                  <h2 className="text-2xl font-bold mb-8">
                    {formSearchPrincipalState === "search" ? "Data" : "Tambah Data"} Perusahaan
                  </h2>
                  <Button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleReset();
                    }}>
                    Kembali Cari Data
                  </Button>
                </div>
                <div className="grid gap-5">
                  <div className="grid w-full gap-1">
                    <Label className="text-sm">Nama</Label>
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
                  <div className="flex gap-5">
                    <div className="grid w-full gap-1">
                      <Label className="text-sm">No. Telepon</Label>
                      <Input
                        className="text-md"
                        placeholder="No Telepon Perusahaan"
                        value={Number(data.principal.telephone)}
                        min="0"
                        type="number"
                        onChange={(e) =>
                          setData("principal", {
                            ...data.principal,
                            telephone: String(getNumericValue(e)),
                          })
                        }
                      />
                    </div>
                    <div className="grid w-full gap-1">
                      <Label className="text-sm">NPWP</Label>
                      <Input
                        className="text-md"
                        placeholder="No NPWP"
                        value={Number(data.principal.npwp)}
                        min="0"
                        type="number"
                        onChange={(e) =>
                          setData("principal", {
                            ...data.principal,
                            npwp: String(getNumericValue(e)),
                          })
                        }
                      />
                    </div>

                    <div className="grid w-full gap-1">
                      <Label className="text-sm">NIB</Label>
                      <Input
                        className="text-md"
                        placeholder="No NIB"
                        type="number"
                        value={Number(data.principal.nib)}
                        min="0"
                        onChange={(e) =>
                          setData("principal", {
                            ...data.principal,
                            nib: String(getNumericValue(e)),
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="grid w-full gap-1">
                    <Label className="text-sm">Nama Direksi</Label>
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
                  <div className="flex gap-5">
                    <div className="grid w-full gap-1">
                      <Label className="text-sm">No. Telephone Direksi</Label>
                      <Input
                        className="text-md"
                        placeholder="Nomor telepon Jabatan"
                        value={Number(data.principal.director_phone)}
                        min="0"
                        type="number"
                        onChange={(e) =>
                          setData("principal", {
                            ...data.principal,
                            director_phone: String(getNumericValue(e)),
                          })
                        }
                      />
                    </div>
                    <div className="grid w-full gap-1">
                      <Label className="text-sm">Jabatan</Label>
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
                  </div>
                  <div className="grid w-full gap-1">
                    <Label className="text-sm">Nama Komisaris</Label>
                    <Input
                      className="text-md"
                      placeholder="Nama Komisaris"
                      value={data.principal.commissioner}
                      onChange={(e) =>
                        setData("principal", {
                          ...data.principal,
                          commissioner: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="flex gap-5">
                    <div className="grid w-full  gap-1">
                      <Label className="text-sm">Perusahaan Berdiri Tahun</Label>
                      <Input
                        className="text-md"
                        placeholder="Tahun berdiri perusahaan"
                        value={data.principal.year_established}
                        min="0"
                        type="number"
                        onChange={(e) =>
                          setData("principal", {
                            ...data.principal,
                            year_established: String(getNumericValue(e)),
                          })
                        }
                      />
                    </div>
                    <div className="grid w-full gap-1">
                      <Label className="text-sm">Akte Perubahan Terakhir</Label>
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
                  </div>
                  <div className="grid gap-1">
                    <Label className="text-md">Alamat Perusahaan</Label>
                    <div className="grid gap-10 mt-2">
                      <div className="flex gap-5">
                        <div className="grid gap-1 w-full">
                          <Label className="text-sm">Provinsi</Label>
                          <Combobox
                            datas={principalProvinces}
                            labelKey="name"
                            valueKey="name"
                            placeholder="Pilih Provinsi"
                            defaultValueId={data?.principal?.province_id || selectedPrincipalProvince?.id}
                            onSelect={(val: any) => {
                              setData("principal", {
                                ...data.principal,
                                province_id: val.id,
                              });
                              setSelectedPrincipalProvince(val);
                            }}
                          />
                        </div>
                        <div className="grid gap-1 w-full">
                          <Label className="text-sm">Kabupaten/Kota</Label>
                          <Combobox
                            datas={principalRegencies}
                            labelKey="name"
                            valueKey="name"
                            placeholder="Pilih Kabupaten/Kota"
                            defaultValueId={data?.principal?.regency_id || selectedPrincipalRegency?.id}
                            onSelect={(val: any) => {
                              setData("principal", {
                                ...data.principal,
                                regency_id: val?.id,
                              });
                              setSelectedPrincipalRegency(val);
                            }}
                          />
                        </div>
                        <div className="grid gap-1 w-full">
                          <Label className="text-sm">Kecamatan</Label>
                          <Combobox
                            datas={principalDistricts}
                            labelKey="name"
                            valueKey="name"
                            placeholder="Pilih Kecamatan"
                            defaultValueId={data?.principal?.district_id || selectedPrincipalDistrict?.id}
                            onSelect={(val: any) => {
                              setData("principal", {
                                ...data.principal,
                                district_id: val?.id,
                              });
                              setSelectedPrincipalDistrict(val);
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex items-start gap-5">
                        <div className="grid gap-1 w-full h-max">
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
                        <div className="grid gap-1 w-full">
                          <Label className="text-sm">Alamat Lengkap</Label>
                          <Textarea
                            className="text-md"
                            placeholder="Masukan Jalan/RT/RW dsb."
                            value={data.principal.address}
                            onChange={(e) =>
                              setData("principal", {
                                ...data.principal,
                                address: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Show>

            {/* PRINCIPAL DOCS SECTION */}
            <Show when={formStep === "docs"}>
              <div>
                <h2 className="text-2xl font-bold mb-8">Dokumen Perusahaan</h2>
                <div className="grid gap-5">
                  <RenderList
                    of={principalDocs}
                    render={(doc) => {
                      const findFiles = principalFiles.find((file) => file.required_doc_id === doc.id);
                      return (
                        <div className="grid gap-1">
                          <Label className="text-md">{doc.name}</Label>
                          <FileInput
                            onFileChange={(file: File | null) => changePrincipalDoc(file, doc)}
                            previewValue={findFiles?.file ? findFiles?.file : doc.principal_document?.path}
                          />
                        </div>
                      );
                    }}
                  />
                </div>
              </div>
            </Show>

            {/* CONTRACT SECTION */}
            <Show when={formStep === "contract"}>
              <div>
                <h2 className="text-2xl font-bold mb-8">Kontrak</h2>
                <div className="grid gap-5">
                  <div className="flex gap-5">
                    <div className="grid gap-1 w-full">
                      <Label className="text-md">Produk</Label>
                      <Combobox
                        datas={products}
                        labelKey="name"
                        valueKey="name"
                        placeholder="Pilih Produk"
                        defaultValueId={data?.submission?.product_id || selectedProducts}
                        onSelect={(val: any) => {
                          let changedSubmission = {
                            ...data.submission,
                          };
                          if (val.id !== selectedProducts) {
                            setSelectedGuarantor(null);
                            setSelectedProductType(null);
                            setIsResetGuarantor(true);
                            setIsResetProductType(true);
                            changedSubmission["guarantor_id"] = "";
                            changedSubmission["guarantor_to_product_type_id"] = "";
                            if (data?.submission?.bank_id) {
                              changedSubmission["bank_id"] = "";
                              setSelectedBank(null);
                            }
                          }
                          changedSubmission["product_id"] = val?.id;
                          setData("submission", changedSubmission);
                          setSelectedProducts(val.id);
                        }}
                      />
                    </div>
                    <div className="grid gap-1 w-full">
                      <Label className="text-md">Asuransi/Penjamin</Label>
                      <Combobox
                        datas={guarantors}
                        labelKey="name"
                        valueKey="name"
                        reset={isResetGuarantor}
                        defaultValueId={data?.submission?.guarantor_id || selectedGuarantor}
                        onReset={(resetVal) => setIsResetGuarantor(resetVal)}
                        placeholder="Pilih Asuransi/Penjamin"
                        onSelect={(val: any) => {
                          if (val.id !== selectedGuarantor) {
                            setSelectedProductType(null);
                            setIsResetProductType(true);
                          }
                          setData("submission", {
                            ...data.submission,
                            guarantor_id: val?.id,
                          });
                          setSelectedGuarantor(val.id);
                        }}
                      />
                    </div>
                    <div className="grid gap-1 w-full">
                      <Label className="text-md">Jenis Jaminan</Label>
                      <Combobox
                        datas={productTypes}
                        labelKey="full_name"
                        valueKey="full_name"
                        placeholder="Pilih Jenis Jaminan"
                        reset={isResetProductType}
                        defaultValueId={
                          data?.submission?.guarantor_to_product_type_id ||
                          (selectedProductType as string | number | null | undefined)
                        }
                        onReset={(resetVal) => setIsResetProductType(resetVal)}
                        onSelect={(val: any) => {
                          setData("submission", {
                            ...data.submission,
                            guarantor_to_product_type_id: val?.id,
                          });
                          setSelectedProductType(val.id);
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex gap-5 items-end">
                    {/* SHOW WHILE NOT CREATED NEW OBLIGEE */}
                    <Show when={!isAddNewObligee}>
                      <div className="grid gap-1 w-full">
                        <Label className="text-md">Obligee</Label>
                        <Combobox
                          datas={obligees}
                          labelKey="name"
                          valueKey="name"
                          placeholder="Pilih Obligee"
                          defaultValueId={data?.obligee?.id || selectedObligee?.id}
                          onSelect={(val: any) => {
                            setData("obligee", {
                              ...data.obligee,
                              id: val?.id,
                              name: val?.name,
                              pic: val?.pic,
                              address: val?.address,
                              no_ppk: val?.no_ppk,
                              telephone: val?.telephone,
                            });
                            setSelectedObligee({
                              id: val?.id,
                              name: val?.name,
                              pic: val?.pic,
                              address: val?.address,
                              no_ppk: val?.no_ppk,
                              telephone: val?.telephone,
                            });
                          }}
                        />
                      </div>
                    </Show>

                    {/* SHOW WHILE CREATED NEW OBLIGEE */}
                    <Show when={isAddNewObligee}>
                      <div className="grid gap-1 w-full">
                        <Label className="text-md">Tambah Data Obligee</Label>
                        <div className="flex flex-col gap-3 mt-3">
                          <div className="grid gap-1 w-full">
                            <Label className="text-sm">Nama</Label>
                            <Input
                              className="text-sm"
                              placeholder="Masukan nama obligee"
                              value={data.obligee.name}
                              onChange={(e) =>
                                setData("obligee", {
                                  ...data.obligee,
                                  name: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="grid gap-1 w-full">
                            <Label className="text-sm">PIC</Label>
                            <Input
                              className="text-sm"
                              placeholder="Masukan nama PIC Obligee"
                              value={data.obligee.pic}
                              onChange={(e) =>
                                setData("obligee", {
                                  ...data.obligee,
                                  pic: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="grid gap-1 w-full">
                            <Label className="text-sm">No PPK</Label>
                            <Input
                              className="text-sm"
                              placeholder="Masukan nomor PPK"
                              value={data.obligee.no_ppk}
                              onChange={(e) =>
                                setData("obligee", {
                                  ...data.obligee,
                                  no_ppk: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="grid gap-1 w-full">
                            <Label className="text-sm">No Telepon</Label>
                            <Input
                              className="text-sm"
                              placeholder="Masukan nomor telepon"
                              value={Number(data.obligee.telephone)}
                              min="0"
                              type="number"
                              onChange={(e) =>
                                setData("obligee", {
                                  ...data.obligee,
                                  telephone: String(getNumericValue(e)),
                                })
                              }
                            />
                          </div>
                          <div className="grid gap-1 w-full">
                            <Label className="text-sm">Alamat</Label>
                            <Textarea
                              className="text-sm"
                              placeholder="Masukan Alamat Obligee"
                              value={data.obligee.address}
                              onChange={(e) =>
                                setData("obligee", {
                                  ...data.obligee,
                                  address: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </Show>

                    <Button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleNewObligee();
                      }}>
                      {!isAddNewObligee ? "Tambah Obligee" : "Batal Tambah"}
                    </Button>
                  </div>

                  <Show when={data.submission.product_id === 2}>
                    <div className="grid gap-1">
                      <Label className="text-md">Banks</Label>
                      <Combobox
                        datas={banks}
                        labelKey="name"
                        valueKey="name"
                        placeholder="Pilih Bank"
                        defaultValueId={data?.submission?.bank_id || selectedBank}
                        onSelect={(val: any) => {
                          setData("submission", {
                            ...data.submission,
                            bank_id: data?.submission?.bank_id === val?.id ? "" : val.id,
                          });
                          setSelectedBank((prev) => (prev === val.id ? null : val.id));
                        }}
                      />
                    </div>
                  </Show>
                  <div className="grid gap-1">
                    <Label className="text-md">Nama Pekerjaan</Label>
                    <input
                      type="text"
                      className="border border-gray-300 p-2 rounded-md"
                      placeholder="Masukkan Nama Pekerjaan"
                      value={data.submission.job_name}
                      onChange={(e) =>
                        setData("submission", {
                          ...data.submission,
                          job_name: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div className="flex gap-5">
                    <div className="grid gap-1 w-full">
                      <Label className="text-md">Nama Dokumen Kontrak</Label>
                      <Input
                        className="text-md"
                        placeholder="Nama Dokumen Kontrak"
                        value={data.submission.contract_doc_name}
                        onChange={(e) =>
                          setData("submission", {
                            ...data.submission,
                            contract_doc_name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="grid gap-1 w-full">
                      <Label className="text-md">Nomor Dokumen Kontrak</Label>
                      <Input
                        className="text-md"
                        placeholder="Nomor Dokumen Kontrak"
                        value={data.submission.contract_doc_number}
                        onChange={(e) =>
                          setData("submission", {
                            ...data.submission,
                            contract_doc_number: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="grid gap-1 w-full">
                      <Label className="text-md">Tanggal Dokumen Kontrak</Label>
                      <CalendarPicker
                        onPickDate={(d) => {
                          setData("submission", {
                            ...data.submission,
                            contract_doc_date: d,
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex gap-5">
                    <div className="grid gap-1 w-full">
                      <Label className="text-md">Nilai Kontrak</Label>
                      <InputCurrency
                        defaultValue={data.submission.contract_value}
                        placeholder="Nilai Kontrak"
                        onChange={(value) => {
                          setData("submission", {
                            ...data.submission,
                            contract_value: value,
                          });
                        }}
                      />
                    </div>
                    <div className="grid gap-1 w-full">
                      <Label className="text-md">Nilai Jaminan</Label>
                      <InputCurrency
                        defaultValue={data.submission.guarantee_value}
                        placeholder="Nilai Jaminan"
                        onChange={(value) => {
                          setData("submission", {
                            ...data.submission,
                            guarantee_value: value,
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex gap-5">
                    <div className="grid gap-1 w-full">
                      <Label className="text-md">Jangka Waktu</Label>
                      <Input
                        className="text-md"
                        type="number"
                        placeholder="Jangka Waktu"
                        value={data.submission.time_period}
                        onChange={(e) =>
                          setData("submission", {
                            ...data.submission,
                            time_period: e.target.value,
                            end_date: dayjs(data.submission.start_date).add(Number(e.target.value), "day").toDate(),
                          })
                        }
                      />
                    </div>
                    <div className="grid gap-1 w-full">
                      <Label className="text-md">Tanggal Mulai Kontrak</Label>
                      <CalendarPicker
                        disabled={{
                          before: subDays(new Date(), 90),
                        }}
                        onPickDate={(d) => {
                          setData("submission", {
                            ...data.submission,
                            start_date: d,
                            time_period: "0",
                            end_date: d,
                          });
                        }}
                      />
                    </div>
                    <div className="grid gap-1 w-full">
                      <Label className="text-md">Tanggal Selesai Kontrak </Label>
                      <CalendarPicker
                        initialDate={
                          data?.submission?.end_date ??
                          dayjs().add(Number(data?.submission?.time_period), "day").toDate()
                        }
                        onPickDate={(e) => {
                          setData("submission", {
                            ...data.submission,
                            end_date: e,
                            time_period: dayjs(e)
                              .startOf("day")
                              .diff(dayjs(data.submission.start_date).startOf("day"), "day")
                              .toString(),
                          });
                        }}
                      />
                    </div>
                  </div>
                  <div className="grid gap-1">
                    <Label className="text-md">Sumber Dana</Label>
                    <Combobox
                      datas={sourceOfFunds}
                      labelKey="name"
                      valueKey="name"
                      placeholder="Pilih Sumber Dana"
                      defaultValueId={data?.submission?.source_of_fund_id || selectedSourceOfFund}
                      onSelect={(val) => {
                        setData("submission", {
                          ...data.submission,
                          source_of_fund_id: val?.id,
                        });
                        setSelectedSourceOfFund(val);
                      }}
                    />
                  </div>
                  <div className="grid gap-1">
                    <Label className="text-md">Lokasi Proyek</Label>
                    <div className="grid gap-5 mt-2">
                      <div className="flex gap-5">
                        <div className="grid gap-1 w-full">
                          <Label className="text-sm">Provinsi</Label>
                          <Combobox
                            datas={jobLocationProvinces}
                            labelKey="name"
                            valueKey="name"
                            placeholder="Pilih Provinsi"
                            defaultValueId={
                              data?.submission?.job_location_province_id || selectedJobLocationProvince?.id
                            }
                            onSelect={(val: any) => {
                              setData("submission", {
                                ...data.submission,
                                job_location_province_id: val.id,
                              });
                              setSelectedJobLocationProvince(val);
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
                            defaultValueId={data?.submission?.job_location_regency_id || selectedJobLocationRegency?.id}
                            onSelect={(val: any) => {
                              setData("submission", {
                                ...data.submission,
                                job_location_regency_id: val.id,
                              });
                              setSelectedJobLocationRegency(val);
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
                            defaultValueId={
                              data?.submission?.job_location_district_id || selectedJobLocationDistrict?.id
                            }
                            onSelect={(val: any) => {
                              setData("submission", {
                                ...data.submission,
                                job_location_district_id: val.id,
                              });
                              setSelectedJobLocationDistrict(val);
                            }}
                          />
                        </div>
                      </div>
                      <div className="flex items-start gap-5">
                        <div className="grid gap-1 w-full">
                          <Label className="text-sm">Desa</Label>
                          <Input
                            className="text-md"
                            placeholder="Masukan nama Desa"
                            value={data.submission.job_location_village}
                            onChange={(e) =>
                              setData("submission", {
                                ...data.submission,
                                job_location_village: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="grid gap-1 w-full">
                          <Label className="text-sm">Alamat Lengkap</Label>
                          <Textarea
                            className="text-md"
                            placeholder="Masukan Jalan/RT/RW dsb."
                            value={data?.submission?.job_location_address}
                            onChange={(e) => {
                              setData("submission", {
                                ...data.submission,
                                job_location_address: e.target.value,
                              });
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Show>

            {/* SKORING SECTION */}
            <Show when={formStep === "skoring"}>
              <div>
                <h1 className="text-2xl font-bold mb-8">Skoring</h1>
                <h2 className="text-xl font-semibold mb-8">Laporan Keuangan Perusahaan</h2>
                <div className="grid gap-16">
                  <div className="flex gap-8">
                    <div className="grid gap-3 w-[550px]">
                      <div className="pt-2 text-black h-[45px]">Tahun</div>
                      <div className="pt-2 text-black h-[45px]">Aktiva Lancar</div>
                      <div className="pt-2 text-black h-[45px]">Utang Lancar</div>
                      <div className="pt-2 text-black h-[45px]">Total Utang</div>
                      <div className="pt-2 text-black h-[45px]">Total Aktiva</div>
                      <div className="pt-2 text-black h-[45px]">Pendapatan</div>
                      <div className="pt-2 text-black h-[45px]">Laba Bersih</div>
                      <div className="pt-2 text-black h-[45px] flex justify-between">
                        Rasio Likuiditas
                        {comparisonRatios.liquidity_ratios == true && (
                          <Badge variant="success" className="flex-shrink-0 h-6">
                            Naik
                          </Badge>
                        )}
                        {comparisonRatios.liquidity_ratios == false && (
                          <Badge variant="destructive" className="flex-shrink-0 h-6">
                            Turun
                          </Badge>
                        )}
                      </div>
                      <div className="pt-2 text-black h-[45px] flex justify-between">
                        Rasio Profitabilitas
                        {comparisonRatios.profitability_ratios == true && (
                          <Badge variant="success" className="flex-shrink-0 h-6">
                            Naik
                          </Badge>
                        )}
                        {comparisonRatios.profitability_ratios == false && (
                          <Badge variant="destructive" className="flex-shrink-0 h-6">
                            Turun
                          </Badge>
                        )}
                      </div>
                      <div className="pt-2 text-black h-[45px] flex justify-between">
                        Rasio Solvabilitas
                        {comparisonRatios.solvency_ratios == true && (
                          <Badge variant="success" className="flex-shrink-0 h-6">
                            Naik
                          </Badge>
                        )}
                        {comparisonRatios.solvency_ratios == false && (
                          <Badge variant="destructive" className="flex-shrink-0 h-6">
                            Turun
                          </Badge>
                        )}
                      </div>
                    </div>
                    <RenderList
                      of={data.principal.ratios}
                      render={(ratio, index) => {
                        return (
                          <div className="grid gap-3 w-full">
                            <div className="grid gap-1 h-[30px] w-full">
                              <Select
                                value={ratio.year?.toString() ?? years[index].toString()}
                                onValueChange={(year) => {
                                  setData("principal", {
                                    ...data.principal,
                                    ratios: data.principal.ratios.map((r, i) =>
                                      i === index
                                        ? {
                                            ...r,
                                            year: Number(year),
                                          }
                                        : r,
                                    ),
                                  });
                                }}>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Pilih Tahun" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Tahun</SelectLabel>
                                    <RenderList
                                      of={years}
                                      render={(year) => {
                                        return <SelectItem value={year.toString()}>{year}</SelectItem>;
                                      }}
                                    />
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid gap-1 h-[30px] w-full">
                              <InputCurrency
                                value={ratio?.current_assets ?? ""}
                                placeholder="Aktiva Lancar"
                                onChange={(value) => {
                                  const liquidity = calculateRatios(value ?? "", ratio.current_debt ?? "");
                                  const ratios = data.principal.ratios.map((r, i) => {
                                    if (i === index) {
                                      return {
                                        ...r,
                                        current_assets: value ?? "",
                                        liquidity_ratios: liquidity ?? "",
                                      };
                                    }
                                    return r;
                                  });
                                  setData("principal", {
                                    ...data.principal,
                                    ratios: ratios,
                                  });
                                  handleComparisonRatios(ratios);
                                }}
                              />
                            </div>
                            <div className="grid gap-1 h-[30px] w-full">
                              <InputCurrency
                                value={ratio.current_debt ?? ""}
                                placeholder="Utang Lancar"
                                onChange={(value) => {
                                  const liquidity = calculateRatios(ratio.current_assets ?? "", value ?? "");
                                  const ratios = data.principal.ratios.map((r, i) => {
                                    if (i === index) {
                                      return {
                                        ...r,
                                        current_debt: value ?? "",
                                        liquidity_ratios: liquidity ?? "",
                                      };
                                    }
                                    return r;
                                  });
                                  setData("principal", {
                                    ...data.principal,
                                    ratios,
                                  });
                                  handleComparisonRatios(ratios);
                                }}
                              />
                            </div>
                            <div className="grid gap-1 h-[30px] w-full">
                              <InputCurrency
                                value={ratio.total_debt ?? ""}
                                placeholder="Total Utang"
                                onChange={(value) => {
                                  const solvency = calculateRatios(ratio.total_assets ?? "", value ?? "");
                                  const ratios = data.principal.ratios.map((r, i) => {
                                    if (i === index) {
                                      return {
                                        ...r,
                                        total_debt: value ?? "",
                                        solvency_ratios: solvency ?? "",
                                      };
                                    }
                                    return r;
                                  });
                                  setData("principal", {
                                    ...data.principal,
                                    ratios,
                                  });
                                  handleComparisonRatios(ratios);
                                }}
                              />
                            </div>
                            <div className="grid gap-1 h-[30px] w-full">
                              <InputCurrency
                                value={ratio.total_assets ?? ""}
                                placeholder="Total Aktiva"
                                onChange={(value) => {
                                  const solvency = calculateRatios(value ?? "", ratio.total_debt ?? "");
                                  const ratios = data.principal.ratios.map((r, i) => {
                                    if (i === index) {
                                      return {
                                        ...r,
                                        total_assets: value ?? "",
                                        solvency_ratios: solvency ?? "",
                                      };
                                    }
                                    return r;
                                  });
                                  setData("principal", {
                                    ...data.principal,
                                    ratios,
                                  });
                                  handleComparisonRatios(ratios);
                                }}
                              />
                            </div>
                            <div className="grid gap-1 h-[30px] w-full">
                              <InputCurrency
                                value={ratio.revenue ?? ""}
                                placeholder="Pendapatan"
                                onChange={(value) => {
                                  const profitability = calculateRatios(value ?? "", ratio.net_income ?? "");
                                  const profit = profitability ? (Number(profitability) * 100).toFixed(2) : 0;
                                  const ratios = data.principal.ratios.map((r, i) => {
                                    if (i === index) {
                                      return {
                                        ...r,
                                        revenue: value ?? "",
                                        profitability_ratios: profit.toString(),
                                      };
                                    }
                                    return r;
                                  });
                                  setData("principal", {
                                    ...data.principal,
                                    ratios,
                                  });
                                  handleComparisonRatios(ratios);
                                }}
                              />
                            </div>
                            <div className="grid gap-1 h-[30px] w-full">
                              <InputCurrency
                                value={ratio.net_income ?? ""}
                                placeholder="Laba Bersih"
                                onChange={(value) => {
                                  const profitability = calculateRatios(ratio.revenue ?? "", value ?? "");
                                  const profit = profitability ? (Number(profitability) * 100).toFixed(2) : 0;
                                  const ratios = data.principal.ratios.map((r, i) => {
                                    if (i === index) {
                                      return {
                                        ...r,
                                        net_income: value ?? "",
                                        profitability_ratios: profit.toString(),
                                      };
                                    }
                                    return r;
                                  });
                                  setData("principal", {
                                    ...data.principal,
                                    ratios,
                                  });
                                  handleComparisonRatios(ratios);
                                }}
                              />
                            </div>
                            <div className="pt-2 h-[30px] w-full text-black">{ratio.liquidity_ratios ?? "??"}</div>
                            <div className="pt-2 h-[30px] w-full text-black">{ratio.solvency_ratios ?? "??"}</div>
                            <div className="pt-2 h-[30px] w-full text-black">
                              {ratio.profitability_ratios !== undefined
                                ? ratio.profitability_ratios.toString() + "%"
                                : "??"}{" "}
                            </div>
                          </div>
                        );
                      }}
                    />
                  </div>
                  <RenderList
                    of={scorings}
                    render={(scoringCategories) => {
                      return (
                        <div className="grid gap-[14px]">
                          <Label className="text-xl underline underline-offset-4">
                            {scoringCategories?.name} ({scoringCategories?.max_point} Poin Maks)
                          </Label>
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
                                    <RadioGroup className="flex flex-col gap-y-3.5 ml-6">
                                      <RenderList
                                        of={scoringQuestions?.options}
                                        render={(scoringOptions) => {
                                          const isOptionChecked = data?.scoring.scores.some(
                                            (s) => s.scoring_option_id === scoringOptions?.id,
                                          );

                                          return (
                                            <div className="flex items-center space-x-2">
                                              <RadioGroupItem
                                                value={String(scoringOptions?.id)}
                                                id={`option-${scoringOptions?.id}`}
                                                checked={isOptionChecked}
                                                onClick={() =>
                                                  handleOptionChange(
                                                    scoringCategories?.id,
                                                    scoringQuestions.id,
                                                    scoringOptions.id,
                                                    scoringOptions.point,
                                                  )
                                                }
                                              />
                                              <Label
                                                className="cursor-pointer w-full flex justify-between"
                                                htmlFor={`option-${scoringOptions?.id}`}>
                                                {scoringOptions?.name}{" "}
                                                <span className="font-[800]">({scoringOptions?.point} Poin)</span>
                                              </Label>
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
                  <div className="grid gap-1 w-full">
                    <Label className="text-sm">Catatan Skoring</Label>
                    <Textarea
                      className="text-md"
                      placeholder="Masukan Catatan Skoring"
                      value={data?.scoring?.note}
                      onChange={(e) =>
                        setData("scoring", {
                          ...data.scoring,
                          note: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </Show>

            {/* BUTTON  PREV / NEXT / SUBMIT*/}
            <div className="flex gap-5  justify-end">
              {/* SHOW PREV IF SECTION IS NOT PRINCIPAL */}
              <Show when={formStep !== "principal"}>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handlePrevStepForm();
                  }}
                  type="button">
                  Sebelumnya
                </Button>
              </Show>

              {/* SHOW NEXT IF SECTION IS NOT SKORING */}
              <Show when={formStep !== "skoring"}>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleNextStepForm();
                  }}
                  type="button">
                  Selanjutnya
                </Button>
              </Show>

              {/* SHOW SUBMIT IF SECTION IS SKORING */}
              <Show when={formStep === "skoring"}>
                <Button type="submit" disabled={processing}>
                  {/* SHOW CIRCLE LOADER IND */}
                  <Show when={processing}>
                    <LoaderCircle className="animate-spin mr-1" />
                  </Show>
                  Submit
                </Button>
              </Show>
            </div>
          </>
        </Show>
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
