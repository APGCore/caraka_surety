import useGetProductTypesByProductAndGuarantor
    from "@/common/hooks/api/product/useGetProductTypesByProductAndGuarantor";
import useGetProfileLimit from "@/common/hooks/api/profile/useGetProfileLimit";
import useGetScoringById from "@/common/hooks/api/scoring/useGetScoringById";
import { toast } from "@/common/hooks/general/use-toast";
import { useGetAllBank } from "@/common/hooks/react-query/bank";
import { useGetAllBlank } from "@/common/hooks/react-query/blank";
import { useGetBranchGuarantorByHeadquarter } from "@/common/hooks/react-query/guarantor";
import {
    useGetAllProvince,
    useGetDistrictByRegencyId,
    useGetRegencyByProvinceId
} from "@/common/hooks/react-query/location";
import { useGetAllObligee } from "@/common/hooks/react-query/obligee";
import {
    PRINCIPAL_QUERY_KEY,
    useCreatePrincipal,
    useGetAllPrincipal,
    useUpdatePrincipal
} from "@/common/hooks/react-query/principal";
import { useGetAllProduct } from "@/common/hooks/react-query/product";
import { useGetAllSourceOfFund } from "@/common/hooks/react-query/source-of-fund";
import { cn } from "@/common/utils/cn";
import { getNumericValue } from "@/common/utils/get-numeric-value";
import { textCurrency } from "@/common/utils/text-currency";
import { Alert, AlertDescription, AlertTitle } from "@/components/_shadcn-ui/alert";
import { Button } from "@/components/_shadcn-ui/button";
import { Input } from "@/components/_shadcn-ui/input";
import { Label } from "@/components/_shadcn-ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/_shadcn-ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/_shadcn-ui/select";
import { Textarea } from "@/components/_shadcn-ui/textarea";
import Loading from "@/components/atoms/loading";
import RenderList from "@/components/atoms/render-list";
import Show from "@/components/atoms/show";
import { CalendarPicker } from "@/components/molecules/calendar/single-calendar";
import { Combobox } from "@/components/molecules/combobox";
import InputCurrency from "@/components/molecules/input/currency-input";
import { queryClient } from "@/components/organisms/provider/react-query-provider";
import RoleBasedLayout from "@/layouts/role-based-layout";
import PrincipalRatios from "@/pages/staff/submission-management/create/_partials/principal-ratios";
import { useForm } from "@inertiajs/react";
import axios from "axios";
import { subDays } from "date-fns";
import dayjs from "dayjs";
import { AlertCircle, LoaderCircle } from "lucide-react";
import React, { Fragment, useCallback, useState } from "react";
import SubmissionCreateHeader from "./_partials/create-page-header";
import PrincipalDocsSection from "./principal-docs-section";
import PrincipalSection from "./principal-section";
import {
    ISelectedPrincipalDistrict,
    Ratio,
    SubmissionCreatePageProps,
    SubmissionFormProps
} from "./submission-create-page.type";

const SubmissionCreatePage: SubmissionCreatePageProps = ({ guarantor }) => {
    // Product
    const { data: products } = useGetAllProduct(guarantor.id);
    const [selectedProducts, setSelectedProducts] = useState(null);

    // Principal
    const { data: principals } = useGetAllPrincipal();

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
        year: dayjs().year()
    };

    const [principalRatios, setPrincipalRatios] = useState<Ratio[]>([
        defaultPrincipalRatios,
        {
            ...defaultPrincipalRatios,
            year: dayjs().year() - 1
        }
    ]);

    const dataDefault = {
        principal: {
            id: "",
            province_id: undefined,
            regency_id: undefined,
            district_id: undefined,
            village: "",
            name: "",
            address: "",
            postal_code: "",
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
            est_deed: "",
            last_deed: "",
            business_fields: "",
            documents: [],
            ratios: [
                defaultPrincipalRatios,
                {
                    ...defaultPrincipalRatios,
                    year: dayjs().year() - 1
                }
            ]
        },
        obligee: {
            id: "",
            name: "",
            pic: "",
            address: "",
            no_ppk: "",
            telephone: "",
            postal_code: ""
        },
        submission: {
            guarantor_id: guarantor?.id ?? "",
            guarantor_branch_id: "",
            product_id: "",
            product_type_id: "",
            job_group: "",
            job_type: "",
            obligee_id: "",
            bank_id: "",
            blank_id: "",
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
            job_location_postal_code: "",
            source_of_fund_id: "",
            note: "",
            risk_mitigation: ""
        },
        scoring: {
            id: 1,
            note: "",
            scores: [],
            min_point: 0
        }
    };
    const { data, setData, post, processing } = useForm<SubmissionFormProps>(dataDefault);

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
        }
    ) => {
        const newFiles = principalFiles.filter((doc) => doc?.required_doc_id !== document?.id);
        if (file) {
            if (file && document?.id !== undefined && document?.name !== undefined) {
                newFiles.push({ required_doc_id: document.id, required_doc_name: document.name, file });
            }
        }
        setData("principal", { ...data.principal, documents: newFiles });
        setPrincipalFiles(newFiles);
    };

    // Principal Province
    const { data: principalProvinces } = useGetAllProvince();
    const [selectedPrincipalProvince, setSelectedPrincipalProvince] = useState<{
        id: number;
        name: string;
    } | null>(null);

    // Principal Regency
    const principalProvinceId = data?.principal?.province_id || selectedPrincipalProvince?.id;
    const { data: principalRegencies } = useGetRegencyByProvinceId(
        principalProvinceId ? String(principalProvinceId) : undefined
    );
    const [selectedPrincipalRegency, setSelectedPrincipalRegency] = useState<{ id: number; name: string } | null>(null);

    // Principal District
    const principalRegencyId = data?.principal?.regency_id || selectedPrincipalRegency?.id;
    const { data: principalDistricts } = useGetDistrictByRegencyId(
        principalRegencyId ? String(principalRegencyId) : undefined
    );
    const [selectedPrincipalDistrict, setSelectedPrincipalDistrict] = useState<ISelectedPrincipalDistrict | null>(null);

    // Obligee Province
    const { data: obligeeProvinces } = useGetAllProvince();
    const [selectedObligeeProvince, setSelectedObligeeProvince] = useState<{ id: number; name: string } | null>(null);

    // Obligee Regency
    const obligeeProvinceId = data?.obligee?.province_id || selectedObligeeProvince?.id;
    const { data: obligeeRegencies } = useGetRegencyByProvinceId(
        obligeeProvinceId ? String(obligeeProvinceId) : undefined
    );
    const [selectedObligeeRegency, setSelectedObligeeRegency] = useState<{ id: number; name: string } | null>(null);

    // Obligee District
    const obligeeRegencyId = data?.obligee?.regency_id || selectedObligeeRegency?.id;
    const { data: obligeeDistricts } = useGetDistrictByRegencyId(obligeeRegencyId ? String(obligeeRegencyId) : undefined);
    const [selectedObligeeDistrict, setSelectedObligeeDistrict] = useState<{ id: number; name: string } | null>(null);

    // Job Location Province
    const { data: jobLocationProvinces } = useGetAllProvince();
    const [selectedJobLocationProvince, setSelectedJobLocationProvince] = useState<{ id: number; name: string } | null>(
        null
    );

    // Job Location Regency
    const jobLocationProvinceId = data?.submission?.job_location_province_id || selectedJobLocationProvince?.id;
    const { data: jobLocationRegencies } = useGetRegencyByProvinceId(
        jobLocationProvinceId ? String(jobLocationProvinceId) : undefined
    );
    const [selectedJobLocationRegency, setSelectedJobLocationRegency] = useState<{ id: number; name: string } | null>(
        null
    );

    // Job Location District
    const jobLocationRegencyId = data?.submission?.job_location_regency_id || selectedJobLocationRegency?.id;
    const { data: jobLocationDistricts } = useGetDistrictByRegencyId(
        jobLocationRegencyId ? String(jobLocationRegencyId) : undefined
    );
    const [selectedJobLocationDistrict, setSelectedJobLocationDistrict] = useState<{ id: number; name: string } | null>(
        null
    );

    // Guarantor
    // const { data: guarantors } = useGetGuarantorByProductId(selectedProducts ? String(selectedProducts) : undefined);
    const [selectedGuarantor, setSelectedGuarantor] = useState(guarantor?.id ?? null);
    const [isResetGuarantor, setIsResetGuarantor] = useState(false);

    // Branch Guarantor
    const { data: branchGuarantor } = useGetBranchGuarantorByHeadquarter(
        selectedGuarantor ? String(selectedGuarantor) : undefined
    );
    const [selectedBranchGuarantor, setSelectedBranchGuarantor] = useState(null);
    const [isResetBranchGuarantor, setIsResetBranchGuarantor] = useState(false);

    // Product Type
    const { productTypes, jobGroups, jobTypes } = useGetProductTypesByProductAndGuarantor({
        selectedProductId: selectedProducts,
        selectedGuarantorId: selectedGuarantor
    });
    const [selectedProductType, setSelectedProductType] = useState<object | null>(null);
    const [isResetProductType, setIsResetProductType] = useState(false);

    // profile limit
    const { profileLimit } = useGetProfileLimit({
        guarantor_id: Number(selectedGuarantor),
        product_type_id: Number(data.submission.product_type_id),
        job_group: data.submission.job_group,
        job_type: data.submission.job_type
    });

    // Source of Fundd
    const { data: sourceOfFunds } = useGetAllSourceOfFund();
    const [selectedSourceOfFund, setSelectedSourceOfFund] = useState(null);

    // Obligee
    //   const { obligees } = useGetAllObligee();
    const { data: obligees } = useGetAllObligee();
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

        if (!isAddNewObligee) {
            if (isHaveDataObligee) {
                setData("obligee", {
                    id: "",
                    name: "",
                    pic: "",
                    address: "",
                    no_ppk: "",
                    telephone: ""
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
        isAddNewObligee
    ]);

    // Bank
    //   const { banks } = useGetAllBank();
    const { data: banks } = useGetAllBank();
    const [selectedBank, setSelectedBank] = useState(null);

    // SCORING
    const { scorings, scoring } = useGetScoringById({
        selectedScoringId: 1
    });
    const [lessThanValue, setLessThanValue] = useState<boolean | undefined>();

    // Form State
    const [formSearchPrincipalState, setFormSearchPrincipalState] = useState<"idle" | "search" | "not-search">("idle");

    const [formStep, setFormStep] = useState<"principal" | "docs" | "contract" | "skoring">("principal");
    const [steps, setSteps] = useState([
        {
            title: "Profile Perusahaan",
            name: "principal",
            isActive: true
        },
        {
            title: "Dokumen Perusahaan",
            name: "docs",
            isActive: false
        },
        {
            title: "Detail Kontrak dan Dasar Pengajuan",
            name: "contract",
            isActive: false
        },
        {
            title: "Resume dan Skoring",
            name: "skoring",
            isActive: false
        }
    ]);

    const handleSetRatios = (ratios: Ratio[]) => {
        setData("principal", {
            ...data.principal,
            ratios
        });
    };

    const handleActiveStep = (targetStep: string) => {
        const targetIndex = steps.findIndex((step) => step.name === targetStep);
        const updatedSteps = steps.map((step, index) => ({
            ...step,
            isActive: index <= targetIndex
        }));
        setSteps(updatedSteps);
    };

    const handleClickStep = (stepName: string) => {
        setFormStep(stepName as "principal" | "docs" | "contract" | "skoring");
        handleActiveStep(stepName);

        window.scrollTo({ top: 0, behavior: "smooth" });
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
                point: val
            };

            setData("scoring", {
                ...data.scoring,
                scores: updatedScores
            });
            const sumPoint = updatedScores.reduce((acc, score) => acc + Number(score.point), 0);
            setLessThanValue(sumPoint < (scoring?.min_point ?? 0));
        } else {
            // If no matching score is found, add a new entry
            const scores = [
                ...data.scoring.scores,
                {
                    scoring_question_category_id: questionCategoryId,
                    scoring_question_id: questionId,
                    scoring_option_id: optionId,
                    point: val
                }
            ];
            setData("scoring", {
                ...data.scoring,
                scores
            });
            const sumPoint = scores.reduce((acc, score) => acc + Number(score.point), 0);
            setLessThanValue(sumPoint < (scoring?.min_point ?? 0));
        }
    };
    const handleReset = () => {
        setData(dataDefault);
        setFormStep("principal");
        setIsAddNewObligee(false);
        setPrincipalDocs([]);
        setPrincipalFiles([]);
        setSelectedBank(null);
        // setSelectedGuarantor(null);
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
                    variant: "destructive"
                });
            },
            onSuccess: () => {
                console.log("success");
                handleReset();
            }
        });
    };

    const [isPrincipalFetch, setIsPrincipalFetch] = useState(false);

    const { data: blanks, isLoading: isLoadingGetBlanks } = useGetAllBlank();

    console.log(blanks);

    const { mutate, isPending } = useCreatePrincipal({
        onSuccess: async (data: any) => {
            setIsPrincipalFetch(true);
            toast({
                title: "Berhasil Menambah Principal!",
                description: "Data berhasil disimpan"
            });
            await queryClient.invalidateQueries({
                queryKey: [PRINCIPAL_QUERY_KEY.PRINCIPAL],
                refetchType: "active"
            });
            // SETTING PRINCIPAL DATA
            const ratios = await fetchPrincipalRatios(data.id);
            setData("principal", {
                ...data?.principal,
                id: data?.id,
                province_id: data?.province_id,
                regency_id: data?.regency_id,
                district_id: data?.district_id,
                village: data?.village,
                name: data?.name,
                address: data?.address,
                telephone: data?.telephone,
                postal_code: data?.postal_code,
                fax: data?.fax,
                npwp: data?.npwp,
                nib: data?.nib,
                siup_siujk: data?.siup_siujk,
                head_name: data?.head_name,
                business_fields: data?.business_fields,
                director_name: data?.director_name,
                director_position: data?.director_position,
                director_phone: data?.director_phone,
                commissioner: data?.commissioner,
                year_established: data?.year_established,
                est_deed: data?.est_deed,
                last_deed: data?.last_deed,
                ratios: ratios.slice(0, 2)
            });

            fetchPrincipalDocuments(data.id);
            handleClickStep("docs");
        },
        onError: (error) => {
            console.log(error);
            toast({
                title: "Gagal Menambah Principal Baru",
                description: "Terjadi kesalahan saat menyimpan data. Silahkan coba lagi",
                variant: "destructive"
            });
        }
    });

    const { mutate: updatePrincipal, isPending: isPendingUpdatePrincipal } = useUpdatePrincipal({
        onSuccess: async (data: any) => {
            setIsPrincipalFetch(true);
            toast({
                title: "Berhasil Mengupdate Principal!",
                description: "Data berhasil diupdate"
            });
            await queryClient.invalidateQueries({
                queryKey: [PRINCIPAL_QUERY_KEY.PRINCIPAL],
                refetchType: "active"
            });
            // SETTING PRINCIPAL DATA
            const ratios = await fetchPrincipalRatios(data.id);
            setData("principal", {
                ...data?.principal,
                id: data?.id,
                province_id: data?.province_id,
                regency_id: data?.regency_id,
                district_id: data?.district_id,
                village: data?.village,
                name: data?.name,
                address: data?.address,
                telephone: data?.telephone,
                postal_code: data?.postal_code,
                fax: data?.fax,
                npwp: data?.npwp,
                nib: data?.nib,
                siup_siujk: data?.siup_siujk,
                head_name: data?.head_name,
                business_fields: data?.business_fields,
                director_name: data?.director_name,
                director_position: data?.director_position,
                director_phone: data?.director_phone,
                commissioner: data?.commissioner,
                year_established: data?.year_established,
                est_deed: data?.est_deed,
                last_deed: data?.last_deed,
                ratios: ratios.slice(0, 2)
            });

            fetchPrincipalDocuments(data.id);
            handleClickStep("docs");
        },
        onError: (error) => {
            console.log(error);
            toast({
                title: "Gagal Mengupdate Principal!",
                description: "Terjadi kesalahan saat mengupdate data. Silahkan coba lagi!",
                variant: "destructive"
            });
        }
    });

    const handleCreatePrincipal = () => {
        if (!data.principal.province_id || !data.principal.regency_id || !data.principal.district_id) {
            return;
        }

        const principalData = {
            province_id: data.principal.province_id,
            regency_id: data.principal.regency_id,
            district_id: data.principal.district_id,
            village: data.principal.village || "",
            name: data.principal.name || "",
            address: data.principal.address || "",
            postal_code: data.principal.postal_code || "",
            telephone: String(data.principal.telephone || ""),
            fax: data.principal.fax || "",
            npwp: String(data.principal.npwp || ""),
            nib: String(data.principal.nib || ""),
            siup_siujk: data.principal.siup_siujk || "",
            head_name: data.principal.head_name || "",
            director_name: data.principal.director_name || "",
            director_position: data.principal.director_position || "",
            director_phone: String(data.principal.director_phone || ""),
            commissioner: data.principal.commissioner || "",
            year_established: String(data.principal.year_established || ""),
            est_deed: data.principal.est_deed || "",
            last_deed: data.principal.last_deed || "",
            business_fields: data.principal.business_fields || "",
            ratios: data.principal.ratios
        };
        mutate(principalData);
    };

    const handleUpdatePrincipal = () => {
        if (!data.principal.province_id || !data.principal.regency_id || !data.principal.district_id) {
            return;
        }

        const principalData = {
            principal_id: data.principal.id,
            province_id: data.principal.province_id,
            regency_id: data.principal.regency_id,
            district_id: data.principal.district_id,
            village: data.principal.village || "",
            name: data.principal.name || "",
            address: data.principal.address || "",
            postal_code: data.principal.postal_code || "",
            telephone: String(data.principal.telephone || ""),
            fax: data.principal.fax || "",
            npwp: String(data.principal.npwp || ""),
            nib: String(data.principal.nib || ""),
            siup_siujk: data.principal.siup_siujk || "",
            head_name: data.principal.head_name || "",
            director_name: data.principal.director_name || "",
            director_position: data.principal.director_position || "",
            director_phone: String(data.principal.director_phone || ""),
            commissioner: data.principal.commissioner || "",
            year_established: String(data.principal.year_established || ""),
            est_deed: data.principal.est_deed || "",
            last_deed: data.principal.last_deed || "",
            business_fields: data.principal.business_fields || "",
            ratios: data.principal.ratios
        };
        updatePrincipal(principalData);
    };

    const handleNextStepForm = () => {
        if (formStep === "principal") {
            if (isPrincipalFetch) {
                handleClickStep("docs");
            } else {
                if (data.principal.id) {
                    handleUpdatePrincipal();
                } else {
                    handleCreatePrincipal();
                }
            }
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
    return (
        <>
            <Show when={profileLimit.limit !== 0}>
                <div className="fixed top-22 right-20 w-[40vw] z-[100]">
                    <Alert variant="info">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Informasi</AlertTitle>
                        <AlertDescription>Batas Kewenangan Nilai Jaminan
                            Rp. {textCurrency(profileLimit?.limit)}</AlertDescription>
                    </Alert>
                </div>
            </Show>
            <div className="w-[800px] mt-[50px] mx-auto ">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                    className="space-y-16">
                    {/* FORM STATE NOT SEARCH / HAVE SEARCH PRINCIPAL*/}
                    <Show when={formSearchPrincipalState === "idle"}>
                        <div className="space-y-10">
                            <h2 className="text-2xl font-bold mb-3">Cari Data Perusahaan</h2>
                            <div className="grid gap-1 bg-re">
                                <Label className="text-md">Perusahaan</Label>
                                <div className="flex gap-x-5 ">
                                    <Combobox
                                        datas={Array.isArray(principals) ? principals : []}
                                        labelKey="name"
                                        valueKey="name"
                                        placeholder="Pilih Data Perusahaan"
                                        containerClassName="w-full"
                                        onSelect={async (val: any) => {
                                            setFormSearchPrincipalState("search");
                                            // SETTING PRINCIPAL DATA

                                            const ratios = await fetchPrincipalRatios(val.id);
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
                                                postal_code: val.postal_code,
                                                fax: val.fax,
                                                npwp: val.npwp,
                                                nib: val.nib,
                                                siup_siujk: val.siup_siujk,
                                                head_name: val.head_name,
                                                business_fields: val.business_fields,
                                                director_name: val.director_name,
                                                director_position: val.director_position,
                                                director_phone: val.director_phone,
                                                commissioner: val.commissioner,
                                                year_established: val.year_established,
                                                est_deed: val.est_deed,
                                                last_deed: val.last_deed,
                                                ratios: ratios.slice(0, 2)
                                            });

                                            setPrincipalRatios(ratios);
                                            fetchPrincipalDocuments(val.id);
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
                            <div className="flex items-start">
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
                                                                "bg-black text-white": step.isActive
                                                            }
                                                        )}>
                                                        {index + 1}
                                                    </div>

                                                    {/* STEPPER LABEL */}
                                                    <span
                                                        className={cn("transition-all duration-300 text-gray-500 mt-2 text-sm min-w-[100px]", {
                                                            "text-black font-semibold": step.isActive
                                                        })}>
                            {step.title}
                          </span>
                                                </button>

                                                {/* ARROW BETWEEN STEPPER */}
                                                {index < steps.length - 1 && (
                                                    <div
                                                        className={cn("w-full mt-5 h-1 mx-5 transition-all duration-300 bg-gray-300", {
                                                            "bg-black": steps[index + 1].isActive
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
                                            {formSearchPrincipalState === "search" ? "Data" : "Tambah Data"} Profile
                                            Perusahaan
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
                                    <PrincipalSection
                                        {...data.principal}
                                        onChangePrincipal={(field, value) => {
                                            if (field === "province_id") {
                                                setData("principal", {
                                                    ...data.principal,
                                                    regency_id: "",
                                                    district_id: "",
                                                    [field]: typeof value === "number" ? String(value) : value
                                                });
                                            } else if (field === "regency_id") {
                                                setData("principal", {
                                                    ...data.principal,
                                                    district_id: "",
                                                    [field]: typeof value === "number" ? String(value) : value
                                                });
                                            } else {
                                                setData("principal", {
                                                    ...data.principal,
                                                    [field]: typeof value === "number" ? String(value) : value
                                                });
                                            }
                                        }}
                                    />
                                </div>
                            </Show>

                            {/* PRINCIPAL DOCS SECTION */}
                            <Show when={formStep === "docs"}>
                                <div>
                                    <h2 className="text-2xl font-bold mb-8">Dokumen Perusahaan</h2>
                                    <div className="grid gap-5">
                                        <PrincipalDocsSection
                                            principalId={data?.principal?.id ? Number(data.principal.id) : undefined} />
                                    </div>
                                </div>
                            </Show>

                            {/* CONTRACT SECTION */}
                            <Show when={formStep === "contract"}>
                                <div>
                                    <h2 className="text-2xl font-bold mb-8">Detail Kontrak dan Dasar Pengajuan</h2>
                                    <div className="grid gap-5">
                                        <div className="grid gap-1 w-full">
                                            <Label className="text-md">Blanko</Label>
                                            <Combobox
                                                datas={Array.isArray(blanks) ? blanks : []}
                                                labelKey="number"
                                                valueKey="number"
                                                defaultValueId={data?.submission?.blank_id}
                                                placeholder="Pilih Blanko"
                                                onSelect={(val: any) => {
                                                    setData("submission", {
                                                        ...data.submission,
                                                        blank_id: val?.id
                                                    });
                                                }}
                                            />
                                        </div>
                                        <div className="flex gap-5">
                                            <div className="grid gap-1 w-full">
                                                <Label className="text-md">Produk</Label>
                                                <Combobox
                                                    datas={Array.isArray(products) ? products : []}
                                                    labelKey="name"
                                                    valueKey="name"
                                                    placeholder="Pilih Produk"
                                                    defaultValueId={data?.submission?.product_id || selectedProducts}
                                                    onSelect={(val: any) => {
                                                        let changedSubmission = {
                                                            ...data.submission
                                                        };
                                                        if (val.id !== selectedProducts) {
                                                            setSelectedBranchGuarantor(null);
                                                            setSelectedProductType(null);
                                                            setIsResetProductType(true);
                                                            // setSelectedGuarantor(null);
                                                            // setIsResetGuarantor(true);
                                                            // changedSubmission["guarantor_id"] = "";
                                                            changedSubmission["product_type_id"] = "";
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
                                            {/*<div className="grid gap-1 w-full">*/}
                                            {/*  <Label className="text-md">Asuransi/Penjamin</Label>*/}
                                            {/*  <Combobox*/}
                                            {/*    datas={Array.isArray(guarantors) ? guarantors : []}*/}
                                            {/*    labelKey="name"*/}
                                            {/*    valueKey="name"*/}
                                            {/*    reset={isResetGuarantor}*/}
                                            {/*    defaultValueId={data?.submission?.guarantor_id || selectedGuarantor}*/}
                                            {/*    onReset={(resetVal) => setIsResetGuarantor(resetVal)}*/}
                                            {/*    placeholder="Pilih Asuransi/Penjamin"*/}
                                            {/*    onSelect={(val: any) => {*/}
                                            {/*      if (val.id !== selectedGuarantor) {*/}
                                            {/*        setSelectedBranchGuarantor(null);*/}
                                            {/*        setSelectedProductType(null);*/}
                                            {/*        setIsResetProductType(true);*/}
                                            {/*      }*/}
                                            {/*      setData("submission", {*/}
                                            {/*        ...data.submission,*/}
                                            {/*        guarantor_id: val?.id,*/}
                                            {/*      });*/}
                                            {/*      setSelectedGuarantor(val.id);*/}
                                            {/*    }}*/}
                                            {/*  />*/}
                                            {/*</div>*/}
                                            <div className="grid gap-1 w-full">
                                                <Label className="text-md">Cabang Asuransi</Label>
                                                <Combobox
                                                    datas={Array.isArray(branchGuarantor) ? branchGuarantor : []}
                                                    labelKey="name"
                                                    valueKey="name"
                                                    reset={isResetBranchGuarantor}
                                                    defaultValueId={data?.submission?.guarantor_branch_id || selectedBranchGuarantor}
                                                    onReset={(resetVal) => setIsResetBranchGuarantor(resetVal)}
                                                    placeholder="Pilih Cabang Asuransi/Penjamin"
                                                    onSelect={(val: any) => {
                                                        if (val.id !== selectedGuarantor) {
                                                            setSelectedProductType(null);
                                                            setIsResetProductType(true);
                                                        }

                                                        setData("submission", {
                                                            ...data.submission,
                                                            guarantor_branch_id: val?.id
                                                        });

                                                        setSelectedBranchGuarantor(val.id);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-5">
                                            <div className="grid gap-1 w-full">
                                                <Label className="text-md">Jenis Jaminan</Label>
                                                <Combobox
                                                    datas={productTypes}
                                                    labelKey="name"
                                                    valueKey="name"
                                                    placeholder="Pilih Jenis Jaminan"
                                                    reset={isResetProductType}
                                                    defaultValueId={
                                                        data?.submission?.product_type_id ||
                                                        (selectedProductType as string | number | null | undefined)
                                                    }
                                                    onReset={(resetVal) => setIsResetProductType(resetVal)}
                                                    onSelect={(val: any) => {
                                                        setData("submission", {
                                                            ...data.submission,
                                                            product_type_id: val?.id
                                                        });
                                                        setSelectedProductType(val.id);
                                                    }}
                                                />
                                            </div>
                                            {jobGroups.length > 0 && selectedBranchGuarantor && (
                                                <div className="grid gap-1 w-full">
                                                    <Label className="text-md">Jenis Pekerjaan</Label>
                                                    <Select
                                                        value={data.submission.job_group}
                                                        onValueChange={(val) => {
                                                            setData("submission", {
                                                                ...data.submission,
                                                                job_group: val
                                                            });
                                                        }}>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Jenis Pekerjaan" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <RenderList
                                                                of={jobGroups}
                                                                render={(jobGroup) => <SelectItem
                                                                    value={jobGroup}>{jobGroup}</SelectItem>}
                                                            />
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            )}
                                            {jobTypes.length > 0 && selectedBranchGuarantor && (
                                                <div className="grid gap-1 w-full">
                                                    <Label className="text-md">Tipe Pekerjaan</Label>
                                                    <Select
                                                        value={data.submission.job_type}
                                                        onValueChange={(val) => {
                                                            setData("submission", {
                                                                ...data.submission,
                                                                job_type: val
                                                            });
                                                        }}>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Tipe Pekerjaan" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <RenderList
                                                                of={jobTypes}
                                                                render={(jobType) => <SelectItem
                                                                    value={jobType}>{jobType}</SelectItem>}
                                                            />
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex gap-5 items-end">
                                            {/* SHOW WHILE NOT CREATED NEW OBLIGEE */}
                                            <Show when={!isAddNewObligee}>
                                                <div className="grid gap-1 w-full">
                                                    <Label className="text-md">Obligee</Label>
                                                    <Combobox
                                                        datas={Array.isArray(obligees) ? obligees : []}
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
                                                                telephone: val?.telephone
                                                            });
                                                            setSelectedObligee({
                                                                id: val?.id,
                                                                name: val?.name,
                                                                pic: val?.pic,
                                                                address: val?.address,
                                                                no_ppk: val?.no_ppk,
                                                                telephone: val?.telephone
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
                                                                        name: e.target.value
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
                                                                        pic: e.target.value
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
                                                                        no_ppk: e.target.value
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
                                                                        telephone: String(getNumericValue(e))
                                                                    })
                                                                }
                                                            />
                                                        </div>
                                                        <div className="grid gap-1">
                                                            <Label className="text-md">Alamat Obligee</Label>
                                                            <div className="grid gap-10 mt-2">
                                                                <div className="flex gap-5">
                                                                    <div className="grid gap-1 w-full">
                                                                        <Label className="text-sm">Provinsi</Label>
                                                                        <Combobox
                                                                            datas={Array.isArray(obligeeProvinces) ? obligeeProvinces : []}
                                                                            labelKey="name"
                                                                            valueKey="name"
                                                                            placeholder="Pilih Provinsi"
                                                                            defaultValueId={data?.obligee?.province_id || selectedObligeeProvince?.id}
                                                                            onSelect={(val: any) => {
                                                                                setData("obligee", {
                                                                                    ...data.obligee,
                                                                                    province_id: val.id
                                                                                });
                                                                                setSelectedObligeeProvince(val);
                                                                            }}
                                                                        />
                                                                    </div>
                                                                    <div className="grid gap-1 w-full">
                                                                        <Label
                                                                            className="text-sm">Kabupaten/Kota</Label>
                                                                        <Combobox
                                                                            datas={Array.isArray(obligeeRegencies) ? obligeeRegencies : []}
                                                                            labelKey="name"
                                                                            valueKey="name"
                                                                            placeholder="Pilih Kabupaten/Kota"
                                                                            defaultValueId={data?.obligee?.regency_id || selectedObligeeRegency?.id}
                                                                            onSelect={(val: any) => {
                                                                                setData("obligee", {
                                                                                    ...data.obligee,
                                                                                    regency_id: val?.id
                                                                                });
                                                                                setSelectedObligeeRegency(val);
                                                                            }}
                                                                        />
                                                                    </div>
                                                                    <div className="grid gap-1 w-full">
                                                                        <Label className="text-sm">Kecamatan</Label>
                                                                        <Combobox
                                                                            datas={Array.isArray(obligeeDistricts) ? obligeeDistricts : []}
                                                                            labelKey="name"
                                                                            valueKey="name"
                                                                            placeholder="Pilih Kecamatan"
                                                                            defaultValueId={data?.obligee?.district_id || selectedObligeeDistrict?.id}
                                                                            onSelect={(val: any) => {
                                                                                setData("obligee", {
                                                                                    ...data.obligee,
                                                                                    district_id: val?.id
                                                                                });
                                                                                setSelectedObligeeDistrict(val);
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-start gap-5">
                                                                    <div className="grid gap-1 w-full h-max">
                                                                        <Label className="text-sm">Desa</Label>
                                                                        <Input
                                                                            className="text-md"
                                                                            placeholder="Masukan nama Desa Obligee"
                                                                            value={data.obligee.village}
                                                                            onChange={(e) =>
                                                                                setData("obligee", {
                                                                                    ...data.obligee,
                                                                                    village: e.target.value
                                                                                })
                                                                            }
                                                                        />
                                                                    </div>
                                                                    <div className="grid gap-1 w-full">
                                                                        <Label className="text-sm">Alamat
                                                                            Lengkap</Label>
                                                                        <Textarea
                                                                            className="text-md"
                                                                            placeholder="Masukan Jalan/RT/RW dsb."
                                                                            value={data.obligee.address}
                                                                            onChange={(e) =>
                                                                                setData("obligee", {
                                                                                    ...data.obligee,
                                                                                    address: e.target.value
                                                                                })
                                                                            }
                                                                        />
                                                                    </div>
                                                                    {/* postal code */}
                                                                    <div className="grid gap-1 w-full">
                                                                        <Label className="text-sm">Kode Pos</Label>
                                                                        <Input
                                                                            className="text-md"
                                                                            placeholder="Kode Pos"
                                                                            value={data.obligee.postal_code}
                                                                            onChange={(e) =>
                                                                                setData("obligee", {
                                                                                    ...data.obligee,
                                                                                    postal_code: e.target.value
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
                                                    datas={Array.isArray(banks) ? banks : []}
                                                    labelKey="name"
                                                    valueKey="name"
                                                    placeholder="Pilih Bank"
                                                    defaultValueId={data?.submission?.bank_id || selectedBank}
                                                    onSelect={(val: any) => {
                                                        setData("submission", {
                                                            ...data.submission,
                                                            bank_id: data?.submission?.bank_id === val?.id ? "" : val.id
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
                                                        job_name: e.target.value
                                                    })
                                                }
                                            />
                                        </div>

                                        <div className="flex gap-5">
                                            <div className="grid gap-1 w-full">
                                                <Label className="text-md">Nama Dasar Dokumen</Label>
                                                <Input
                                                    className="text-md"
                                                    placeholder="Nama dasar dokumen"
                                                    value={data.submission.contract_doc_name}
                                                    onChange={(e) =>
                                                        setData("submission", {
                                                            ...data.submission,
                                                            contract_doc_name: e.target.value
                                                        })
                                                    }
                                                />
                                            </div>
                                            <div className="grid gap-1 w-full">
                                                <Label className="text-md">Nomor Dasar Dokumen</Label>
                                                <Input
                                                    className="text-md"
                                                    placeholder="Nomor dasar dokumen"
                                                    value={data.submission.contract_doc_number}
                                                    onChange={(e) =>
                                                        setData("submission", {
                                                            ...data.submission,
                                                            contract_doc_number: e.target.value
                                                        })
                                                    }
                                                />
                                            </div>
                                            <div className="grid gap-1 w-full">
                                                <Label className="text-md">Tanggal Dasar Dokumen</Label>
                                                <CalendarPicker
                                                    onPickDate={(d) => {
                                                        setData("submission", {
                                                            ...data.submission,
                                                            contract_doc_date: d
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
                                                            contract_value: value
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
                                                            guarantee_value: value
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
                                                            end_date: dayjs(data.submission.start_date).add(Number(e.target.value), "day").toDate()
                                                        })
                                                    }
                                                />
                                            </div>
                                            <div className="grid gap-1 w-full">
                                                <Label className="text-md">Tanggal Awal Jaminan</Label>
                                                <CalendarPicker
                                                    disabled={{
                                                        before: subDays(new Date(), 90)
                                                    }}
                                                    onPickDate={(d) => {
                                                        setData("submission", {
                                                            ...data.submission,
                                                            start_date: d,
                                                            time_period: "0",
                                                            end_date: d
                                                        });
                                                    }}
                                                />
                                            </div>
                                            <div className="grid gap-1 w-full">
                                                <Label className="text-md">Tanggal Akhir Jaminan</Label>
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
                                                                .toString()
                                                        });
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid gap-1">
                                            <Label className="text-md">Sumber Dana</Label>
                                            <Combobox
                                                datas={Array.isArray(sourceOfFunds) ? sourceOfFunds : []}
                                                labelKey="name"
                                                valueKey="name"
                                                placeholder="Pilih Sumber Dana"
                                                defaultValueId={data?.submission?.source_of_fund_id || selectedSourceOfFund}
                                                onSelect={(val) => {
                                                    setData("submission", {
                                                        ...data.submission,
                                                        source_of_fund_id: val?.id
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
                                                            datas={Array.isArray(jobLocationProvinces) ? jobLocationProvinces : []}
                                                            labelKey="name"
                                                            valueKey="name"
                                                            placeholder="Pilih Provinsi"
                                                            defaultValueId={
                                                                data?.submission?.job_location_province_id || selectedJobLocationProvince?.id
                                                            }
                                                            onSelect={(val: any) => {
                                                                setData("submission", {
                                                                    ...data.submission,
                                                                    job_location_province_id: val.id
                                                                });
                                                                setSelectedJobLocationProvince(val);
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="grid gap-1 w-full">
                                                        <Label className="text-sm">Kabupaten/Kota</Label>
                                                        <Combobox
                                                            datas={Array.isArray(jobLocationRegencies) ? jobLocationRegencies : []}
                                                            labelKey="name"
                                                            valueKey="name"
                                                            placeholder="Pilih Kabupaten/Kota"
                                                            defaultValueId={
                                                                data?.submission?.job_location_regency_id || selectedJobLocationRegency?.id
                                                            }
                                                            onSelect={(val: any) => {
                                                                setData("submission", {
                                                                    ...data.submission,
                                                                    job_location_regency_id: val.id
                                                                });
                                                                setSelectedJobLocationRegency(val);
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="grid gap-1 w-full">
                                                        <Label className="text-sm">Kecamatan</Label>
                                                        <Combobox
                                                            datas={Array.isArray(jobLocationDistricts) ? jobLocationDistricts : []}
                                                            labelKey="name"
                                                            valueKey="name"
                                                            placeholder="Pilih Kecamatan"
                                                            defaultValueId={
                                                                data?.submission?.job_location_district_id || selectedJobLocationDistrict?.id
                                                            }
                                                            onSelect={(val: any) => {
                                                                setData("submission", {
                                                                    ...data.submission,
                                                                    job_location_district_id: val.id
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
                                                                    job_location_village: e.target.value
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
                                                                    job_location_address: e.target.value
                                                                });
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="grid gap-1 w-full">
                                                        <Label className="text-sm">Kode Pos</Label>
                                                        <Input
                                                            className="text-md"
                                                            placeholder="Masukan nama Desa"
                                                            value={data.submission.job_location_postal_code}
                                                            onChange={(e) =>
                                                                setData("submission", {
                                                                    ...data.submission,
                                                                    job_location_postal_code: e.target.value
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

                            {/* SKORING SECTION */}
                            <Show when={formStep === "skoring"}>
                                <div>
                                    <h1 className="text-2xl font-bold mb-8">Resume dan Skoring</h1>
                                    <div className="grid gap-16">
                                        <PrincipalRatios ratios={principalRatios} setRatio={handleSetRatios} />
                                        <RenderList
                                            of={scorings}
                                            render={(scoringCategories) => {
                                                return (
                                                    <div className="grid gap-[14px]">
                                                        <Label className="text-xl underline underline-offset-4">
                                                            {scoringCategories?.name} ({scoringCategories?.max_point} Poin
                                                            Maks)
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
                                                                            <RadioGroup
                                                                                className="flex flex-col gap-y-3.5 ml-6">
                                                                                <RenderList
                                                                                    of={scoringQuestions?.options}
                                                                                    render={(scoringOptions) => {
                                                                                        const isOptionChecked = data?.scoring.scores.some(
                                                                                            (s) => s.scoring_option_id === scoringOptions?.id
                                                                                        );

                                                                                        return (
                                                                                            <div
                                                                                                className="flex items-center space-x-2">
                                                                                                <RadioGroupItem
                                                                                                    value={String(scoringOptions?.id)}
                                                                                                    id={`option-${scoringOptions?.id}`}
                                                                                                    checked={isOptionChecked}
                                                                                                    onClick={() =>
                                                                                                        handleOptionChange(
                                                                                                            scoringCategories?.id,
                                                                                                            scoringQuestions.id,
                                                                                                            scoringOptions.id,
                                                                                                            scoringOptions.point
                                                                                                        )
                                                                                                    }
                                                                                                />
                                                                                                <Label
                                                                                                    className="cursor-pointer w-full flex justify-between"
                                                                                                    htmlFor={`option-${scoringOptions?.id}`}>
                                                                                                    {scoringOptions?.name}{" "}
                                                                                                    <span
                                                                                                        className="font-[800]">({scoringOptions?.point} Poin)</span>
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
                                        <Show when={lessThanValue != undefined && lessThanValue}>
                                            <div className="grid gap-1 w-full">
                                                <Label className="text-sm">Mitigasi Risiko</Label>
                                                <Textarea
                                                    className="text-md"
                                                    placeholder="Tulis Mitigasi Risiko"
                                                    value={data?.submission?.risk_mitigation}
                                                    onChange={(e) =>
                                                        setData("submission", {
                                                            ...data.submission,
                                                            risk_mitigation: e.target.value
                                                        })
                                                    }
                                                />
                                            </div>
                                        </Show>
                                        <div className="grid gap-1 w-full">
                                            <Label className="text-sm">Catatan Skoring</Label>
                                            <Textarea
                                                className="text-md"
                                                placeholder="Masukan Catatan Skoring"
                                                value={data?.scoring?.note}
                                                onChange={(e) =>
                                                    setData("scoring", {
                                                        ...data.scoring,
                                                        note: e.target.value
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
                                        disabled={isPending || isPendingUpdatePrincipal}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleNextStepForm();
                                        }}
                                        type="button">
                                        Selanjutnya <Loading isLoading={isPending || isPendingUpdatePrincipal} />
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
        </>
    );
};

export default SubmissionCreatePage;

SubmissionCreatePage.layout = (page: any) => {
    const pagePropsData = page.props;

    return (
        <RoleBasedLayout propsData={pagePropsData}>
            <SubmissionCreateHeader title={pagePropsData?.page_settings?.title} />
            {page}
        </RoleBasedLayout>
    );
};
