import { getQueryParameter } from "@/common/utils/get-query-parameter";
import { Label } from "@/components/_shadcn-ui/label";
import { Combobox } from "@/components/common/combobox";
import SearchDatatable from "@/components/common/search-datatable";
import SelectLengthDatatable from "@/components/common/select-length-datatable";
import AdminLayout from "@/layouts/admin";
import { router } from "@inertiajs/react";
import axios from "axios";
import { pickBy } from "lodash";
import { useEffect, useState } from "react";
import ScoringQuestionDatatable from "./_partials/scoring-question-datatable";
import ScoringQuestionHeader from "./_partials/scoring-question-header";
import { AdminScoringQuestionCategoryPropsPageProps } from "./scoring-question.type";

const AdminScoringQuestionPage: AdminScoringQuestionCategoryPropsPageProps = ({
  scoringQuestions,
  initialSelectedScoring,
  initialSelectedScoringQuestionCategory,
}) => {
  console.log(scoringQuestions);
  const [scorings, setScorings] = useState([]);
  const [scoringId, setScoringId] = useState<string>(() => getQueryParameter("scoring_id") || "");
  const [scoringQuestionCategory, setScoringQuestionCategory] = useState([]);
  const [scoringQuestionCategoryId, setScoringQuestionCategoryId] = useState<string>(
    () => getQueryParameter("scoring_question_category_id") || "",
  );
  const [select, setSelect] = useState<string>(() => getQueryParameter("per_page") || "10");
  const [search, setSearch] = useState<string>(() => getQueryParameter("search") || "");

  useEffect(() => {
    axios
      .get(route("scoring.all"))
      .then((response) => {
        setScorings(response.data);
        setScoringId(initialSelectedScoring?.id || "");
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    if (scoringId) {
      axios
        .get(route("scoring-question-category.get-by-scoring", scoringId))
        .then((response) => {
          setScoringQuestionCategory(response.data);
          if (response?.data?.[0]?.id) {
            setScoringQuestionCategoryId(response?.data?.[0]?.id);
            getData(select, search, scoringId, response?.data?.[0]?.id);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [scoringId]);

  const handleSelectSkoringQuestionLength = (e: string) => {
    setSelect(e);
    getData(e, search, scoringId, scoringQuestionCategoryId);
  };

  const handleSelectSkoring = (scoring_id: string) => {
    if (scoringId === scoring_id) {
      return;
    }
    setScoringId(scoring_id);
    getData(select, search, scoring_id, "");
  };

  const handleSelectSkoringQuestionCategory = (scoring_id: string) => {
    setScoringQuestionCategoryId(scoring_id);
    getData(select, search, scoringId, scoring_id);
  };

  const handleSearchSkoringQuestion = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    getData(select, search, scoringId, scoringQuestionCategoryId);
  };

  const getData = (per_page: string, search: string, scoring_id: string, scoring_question_category_id: string) => {
    router.get(
      route("scoring-question.index"),
      pickBy({
        per_page,
        search,
        scoring_id,
        scoring_question_category_id,
      }),
      { preserveState: true, preserveScroll: true },
    );
  };

  const deleteSkoring = (scoring: any) => {
    router.delete(route("scoring-question.destroy", scoring.id));
  };

  return (
    <main className="space-y-2.5">
      <div className="flex justify-between items-end">
        <div className="flex gap-x-3 items-end">
          <SelectLengthDatatable defaultValue={select} onChange={handleSelectSkoringQuestionLength} />
          <div className="flex flex-col gap-y-1">
            <Label className="text-sm font-semibold pl-1">Skoring</Label>
            <Combobox
              datas={scorings}
              labelKey={"name"}
              valueKey={"name"}
              defaultValueId={initialSelectedScoring?.id}
              placeholder={"Pilih Skoring"}
              className={"w-[210px]"}
              onSelect={(value) => handleSelectSkoring(value?.id)}
            />
          </div>
          <div className="flex flex-col gap-y-1">
            <Label className="text-sm font-semibold pl-1">Kategori Pertanyaan</Label>
            <Combobox
              datas={scoringQuestionCategory}
              labelKey={"name"}
              valueKey={"name"}
              defaultValueId={scoringQuestionCategoryId}
              placeholder={"Pilih Kategori Pertanyaan"}
              className={"w-[210px]"}
              onSelect={(value) => handleSelectSkoringQuestionCategory(value?.id)}
            />
          </div>
        </div>
        <SearchDatatable
          className="w-[230px]"
          value={search}
          onChange={setSearch}
          onSubmit={handleSearchSkoringQuestion}
          placeholder="Cari Pertanyaan Skoring"
        />
      </div>
      <ScoringQuestionDatatable scoringQuestions={scoringQuestions} onDelete={deleteSkoring} />
    </main>
  );
};

export default AdminScoringQuestionPage;

AdminScoringQuestionPage.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <AdminLayout user={pagePropsData?.auth?.user}>
      <ScoringQuestionHeader title={pagePropsData?.page_settings?.title} />
      {page}
    </AdminLayout>
  );
};
