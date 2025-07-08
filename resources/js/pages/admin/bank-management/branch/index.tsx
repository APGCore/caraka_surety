import { getQueryParameter } from "@/common/utils/get-query-parameter";
import { Button } from "@/components/_shadcn-ui/button";
import SelectLengthDatatable from "@/components/molecules/datatable/row-length";
import SearchDatatable from "@/components/molecules/datatable/search";
import RoleBasedLayout from "@/layouts/role-based-layout";
import { Link, router } from "@inertiajs/react";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import { pickBy } from "lodash";
import React, { useState } from "react";
import { BankUtils } from "../bank/bank.utils";
import BranchBankDatatable from "./_partials/branch-bank-datatable";
import BranchBankHeader from "./_partials/branch-bank-header";
import { BranchBankPageProps } from "./branch-bank-page.type";
import { BranchBankUtils } from "./branch-bank.utils";

const BankPage: BranchBankPageProps = ({ banks }) => {
  const [select, setSelect] = useState<string>(() => getQueryParameter("per_page") || "10");
  const [search, setSearch] = useState(() => getQueryParameter("search") ?? "");

  const handleSelect = (e: string) => {
    setSelect(e);
    getData(String(select), search);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    getData(String(select), search);
  };

  const getData = (per_page: string, search: string) => {
    return router.get(
      route(BranchBankUtils.link.index),
      pickBy({
        per_page,
        search,
      }),
      { preserveState: true, preserveScroll: true },
    );
  };

  return (
    <main className="space-y-2.5">
      <div className="flex justify-between items-end">
        <div className="flex gap-x-3">
          <SelectLengthDatatable defaultValue={select} onChange={handleSelect} />
        </div>
        <div className="flex gap-x-3">
          <SearchDatatable
            value={search}
            placeholder={"Cari Cabang Bank"}
            onChange={setSearch}
            onSubmit={handleSearch}
          />
        </div>
      </div>
      <BranchBankDatatable banks={banks} />
    </main>
  );
};

export default BankPage;

BankPage.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <RoleBasedLayout propsData={pagePropsData}>
      <BranchBankHeader
        title={pagePropsData?.page_settings?.title}
        button={
          <div className="flex items-center gap-x-3">
            <Button asChild>
              <Link href={route(BankUtils.link.index)} className="flex items-center gap-x-2">
                <ChevronLeftIcon />
                Kembali
              </Link>
            </Button>
            <Button variant="success" asChild>
              <Link href={route(BranchBankUtils.link.create, { bank: pagePropsData?.bank?.id })}>Tambah</Link>
            </Button>
          </div>
        }
      />
      {page}
    </RoleBasedLayout>
  );
};
