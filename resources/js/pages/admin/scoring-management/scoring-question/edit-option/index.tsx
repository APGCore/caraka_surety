import { getQueryParameter } from "@/common/utils/get-query-parameter";
import SearchDatatable from "@/components/common/search-datatable";
import SelectLengthDatatable from "@/components/common/select-length-datatable";
import RoleBasedLayout from "@/layouts/role-based-layout";
import { router } from "@inertiajs/react";
import { pickBy } from "lodash";
import { useState } from "react";
import ScoringQuestionOptionDatatable from "./_partials/edit-option-datatable";
import EditScoringQuestionOptionHeader from "./_partials/edit-option-header";
import { AdminEditScoringQuestionOptionPageProps } from "./edit-option-type";

const AdminEditScoringQuestionOptionPage: AdminEditScoringQuestionOptionPageProps = ({
  scoringOptions,
  selectedScoringQuestion,
}) => {
  const [select, setSelect] = useState<string>(() => getQueryParameter("per_page") || "10");
  const [search, setSearch] = useState<string>(() => getQueryParameter("search") || "");

  const handleSelectSkoringLength = (per_page: string) => {
    setSelect(per_page);
    getData(per_page, search);
  };

  const handleSearchSkoring = () => {
    getData(select, search);
  };

  const getData = (per_page: string, search: string) => {
    router.get(
      route("scoring-question.edit-options", selectedScoringQuestion?.id),
      pickBy({
        per_page,
        search,
      }),
      { preserveState: true, preserveScroll: true },
    );
  };

  const deleteSkoring = (scoring: any) => {
    // console.log(scoring);
    router.delete(route("scoring-option.destroy", { scoringOption: scoring.id }));
  };

  return (
    <main className="space-y-2.5">
      <div className="flex justify-between items-end">
        <div className="flex gap-x-3">
          <SelectLengthDatatable defaultValue={select} onChange={handleSelectSkoringLength} />
        </div>
        <SearchDatatable
          value={search}
          onChange={setSearch}
          onSubmit={handleSearchSkoring}
          placeholder="Cari Pilihan Pertanyaan"
        />
      </div>
      <ScoringQuestionOptionDatatable
        selectedScoringQuestion={selectedScoringQuestion}
        scoringOptions={scoringOptions}
        onDelete={deleteSkoring}
      />
    </main>
  );
};

export default AdminEditScoringQuestionOptionPage;

AdminEditScoringQuestionOptionPage.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <RoleBasedLayout user={pagePropsData?.auth?.user}>
      <EditScoringQuestionOptionHeader
        title={pagePropsData?.page_settings?.title}
        selectedScoringQuestion={pagePropsData?.selectedScoringQuestion}
      />
      {page}
    </RoleBasedLayout>
  );
};
