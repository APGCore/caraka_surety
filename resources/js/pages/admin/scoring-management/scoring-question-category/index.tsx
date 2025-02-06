import { getQueryParameter } from "@/common/utils/get-query-parameter";
import { Label } from "@/components/_shadcn-ui/label";
import { Combobox } from "@/components/molecules/combobox";
import SelectLengthDatatable from "@/components/molecules/datatable/row-length";
import SearchDatatable from "@/components/molecules/datatable/search";
import RoleBasedLayout from "@/layouts/role-based-layout";
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
  const [scoringId, setScoringId] = useState<string>(() => getQueryParameter("scoring_id") || "");
  const [select, setSelect] = useState<string>(() => getQueryParameter("per_page") || "10");
  const [search, setSearch] = useState<string>(() => getQueryParameter("search") || "");

  useEffect(() => {
    axios
      .get(route("scoring.all"))
      .then((response) => {
        setScorings(response.data);
        setScoringId(scoringId ?? initialSelectedScoring?.id);
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
    setScoringId(scoring_id);
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

  const deleteSkoringQuestionCategory = (scoringQuestionCategory: any) => {
    router.delete(route("scoring-question-category.destroy", scoringQuestionCategory.id));
  };

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
    <RoleBasedLayout user={pagePropsData?.auth?.user}>
      <ScoringQuestionCategoryHeader title={pagePropsData?.page_settings?.title} />
      {page}
    </RoleBasedLayout>
  );
};
