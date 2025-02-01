import { getQueryParameter } from "@/common/utils/get-query-parameter";
import SearchDatatable from "@/components/common/search-datatable";
import SelectLengthDatatable from "@/components/common/select-length-datatable";
import AdminLayoutPage from "@/layouts/admin-layout";
import DireksiLayoutPage from "@/layouts/direksi-layout";
import KepalaCabangLayoutPage from "@/layouts/kepala-cabang";
import ManagerLayoutPage from "@/layouts/manager";
import StaffLayoutPage from "@/layouts/staff";
import { router } from "@inertiajs/react";
import { pickBy } from "lodash";
import { useState } from "react";
import ScoringDatatable from "./_partials/scoring-datatable";
import ScoringHeader from "./_partials/scoring-header";
import { AdminScoringsPageProps } from "./scoring.type";

const AdminScoringsPage: AdminScoringsPageProps = ({ scorings }) => {
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
      route("scoring.index"),
      pickBy({
        per_page,
        search,
      }),
      { preserveState: true, preserveScroll: true },
    );
  };

  const deleteSkoring = (scoring: any) => {
    router.delete(route("scoring.destroy", scoring.id));
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
          placeholder="Cari Skoring"
        />
      </div>
      <ScoringDatatable scorings={scorings} onDelete={deleteSkoring} />
    </main>
  );
};

export default AdminScoringsPage;

AdminScoringsPage.layout = (page: any) => {
  const pagePropsData = page.props;
  const user = pagePropsData?.auth?.user;

  return <ShowLayout user={user} page={page} title={pagePropsData?.page_settings?.title} />;
};

const ShowLayout = ({ user, page, title }: { user: any; page: any; title: any }) => {
  switch (user?.role_id) {
    case 1:
      return (
        <AdminLayoutPage user={user}>
          <ScoringHeader title={title} />
          {page}
        </AdminLayoutPage>
      );
    case 2:
      return (
        <DireksiLayoutPage user={user}>
          <ScoringHeader title={title} />
          {page}
        </DireksiLayoutPage>
      );
    case 3:
      return (
        <KepalaCabangLayoutPage user={user}>
          <ScoringHeader title={title} />
          {page}
        </KepalaCabangLayoutPage>
      );
    case 4:
      return (
        <ManagerLayoutPage user={user}>
          <ScoringHeader title={title} />
          {page}
        </ManagerLayoutPage>
      );
    default:
      return (
        <StaffLayoutPage user={user}>
          <ScoringHeader title={title} />
          {page}
        </StaffLayoutPage>
      );
  }
};
