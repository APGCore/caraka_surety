import { getNumericValue } from "@/common/utils/get-numeric-value";
import { Button } from "@/components/_shadcn-ui/button";
import { Input } from "@/components/_shadcn-ui/input";
import { Label } from "@/components/_shadcn-ui/label";
import { Combobox } from "@/components/molecules/combobox";
import InputError from "@/components/molecules/input/error-input";
import RoleBasedLayout from "@/layouts/role-based-layout";
import { useForm } from "@inertiajs/react";
import axios from "axios";
import { RotateCw } from "lucide-react";
import { FormEventHandler, useEffect, useState } from "react";
import EditScoringQuestionCategoryHeader from "./_partials/edit-scoring-header";
import { AdminEditScoringQuestionCategoryPageProps } from "./edit-scoring.type";

const AdminEditScoringQuestionCategoryPage: AdminEditScoringQuestionCategoryPageProps = ({
    scoringQuestionCategory,
}) => {
    const [scorings, setScorings] = useState([]);

    const { data, setData, put, processing, errors, reset } = useForm<{
        name: string;
        max_point: number | undefined;
        scoring_id: string;
    }>({
        name: "",
        max_point: undefined,
        scoring_id: "",
    });

    useEffect(() => {
        axios
            .get(route("scoring.all"))
            .then((response) => {
                setScorings(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    useEffect(() => {
        if (
            scoringQuestionCategory?.name ||
            scoringQuestionCategory?.max_point ||
            scoringQuestionCategory?.scoring_id
        ) {
            setData({
                name: scoringQuestionCategory?.name ?? "",
                max_point: scoringQuestionCategory?.max_point ?? undefined,
                scoring_id: scoringQuestionCategory?.scoring_id ?? "",
            });
        }
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        put(route("scoring-question-category.update", scoringQuestionCategory?.id), {
            onSuccess: () => {
                reset();
            },
        });
    };

    return (
        <main className="space-y-2.5">
            <div className="border p-12 rounded-md shadow-md flex justify-center">
                <div className="w-full max-w-lg ">
                    <form onSubmit={submit} id="skoring-form" className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nama</Label>
                            <Input
                                id="name"
                                type="name"
                                placeholder="Masukan nama skoring"
                                required
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="max_point">Poin Maksimal</Label>
                            <Input
                                id="max_point"
                                type="number"
                                required
                                value={data.max_point}
                                placeholder="Masukan poin maksimal"
                                onChange={(e) => setData("max_point", getNumericValue(e))}
                            />
                            <InputError message={errors.max_point} className="mt-2" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="scoring_id">Skoring</Label>
                            <Combobox
                                datas={scorings}
                                labelKey={"name"}
                                valueKey={"name"}
                                defaultValueId={scoringQuestionCategory?.scoring_id && data?.scoring_id}
                                placeholder={"Pilih Skoring"}
                                onSelect={(value) => {
                                    setData("scoring_id", value?.id);
                                }}
                            />
                            <InputError message={errors.scoring_id} className="mt-2" />
                        </div>
                        <div className="flex justify-end">
                            <Button form="skoring-form" className="w-full max-w-[270px]" disabled={processing}>
                                {processing && <RotateCw className="animate-spin mr-2 flex-shrink-0" />}
                                Edit Kategori Pertanyaan Skoring
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
};

export default AdminEditScoringQuestionCategoryPage;

AdminEditScoringQuestionCategoryPage.layout = (page: any) => {
    const pagePropsData = page.props;

    return (
        <RoleBasedLayout propsData={pagePropsData}>
            <EditScoringQuestionCategoryHeader title={pagePropsData?.page_settings?.title} />
            {page}
        </RoleBasedLayout>
    );
};
