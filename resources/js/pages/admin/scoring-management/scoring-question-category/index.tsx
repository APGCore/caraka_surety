import { Combobox } from "@/components/common/combobox";
import ExportDocsButtonDatatable from "@/components/common/export-docs-datatable";
import SearchDatatable from "@/components/common/search-datatable";
import SelectLengthDatatable from "@/components/common/SelectLengthDatatable";
import { Label } from "@/components/ui/label";
import AdminLayout from "@/layouts/admin";
import { getQueryParameter } from "@/lib/get-query-parameter";
import { router } from "@inertiajs/react";
import axios from "axios";
import { pickBy } from "lodash";
import { useEffect, useState } from "react";
import ScoringQuestionCategoryDatatable from "./_partials/scoring-question-category-datatable";
import ScoringQuestionCategoryHeader from "./_partials/scoring-question-category-header";
import { AdminScoringQuestionCategoryPropsPageProps } from "./scoring-question-category.type";

const AdminScoringQuestionCategoryPage: AdminScoringQuestionCategoryPropsPageProps = ({
  scoringQuestionCategories,
  initialSelectedScoring,
}) => {
  const [scorings, setScorings] = useState([]);
  const [select, setSelect] = useState<string>(() => getQueryParameter("per_page") || "10");
  const [search, setSearch] = useState<string>(() => getQueryParameter("search") || "");
  const [scoringId, setScoringId] = useState<string>(() => getQueryParameter("scoring_id") || "");

  useEffect(() => {
    axios
      .get(route("scoring.all"))
      .then((response) => {
        setScorings(response.data);
        setScoringId(initialSelectedScoring?.id);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleSelectSkoringQuestionCategoryLength = (per_page: string) => {
    setSelect(per_page);
    getData(per_page, search, scoringId);
  };

  const handleSearchSkoringQuestionCategory = () => {
    getData(select, search, scoringId);
  };

  const handleSelectSkoring = (scoring_id: string) => {
    setScoringId(scoringId);
    getData(select, search, scoring_id);
  };

  const getData = (per_page: string, search: string, scoring_id: string) => {
    return router.get(
      route("scoring-question-category.index"),
      pickBy({
        per_page,
        search,
        scoring_id,
      }),
      { preserveState: true, preserveScroll: true },
    );
  };

  const deleteSkoringQuestionCategory = (scoring: any) => {
    router.delete(route("scoring-question-category.destroy", scoring.id));
  };

  console.log(scoringQuestionCategories);

  return (
    <main className="space-y-2.5">
      <div className="flex justify-between items-end">
        <div className="flex gap-x-3 items-end">
          <SelectLengthDatatable defaultValue={select} onChange={handleSelectSkoringQuestionCategoryLength} />
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
        </div>
        <SearchDatatable
          className="w-[230px]"
          value={search}
          onChange={setSearch}
          onSubmit={handleSearchSkoringQuestionCategory}
          placeholder="Cari Kategori Pertanyaan Skoring"
        />
      </div>
      <ScoringQuestionCategoryDatatable
        scoringQuestionCategories={scoringQuestionCategories}
        onDelete={deleteSkoringQuestionCategory}
      />
    </main>
  );
};

export default AdminScoringQuestionCategoryPage;

AdminScoringQuestionCategoryPage.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <AdminLayout user={pagePropsData?.auth?.user}>
      <ScoringQuestionCategoryHeader title={pagePropsData?.page_settings?.title} />
      {page}
    </AdminLayout>
  );
};
