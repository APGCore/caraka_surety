import { getQueryParameter } from "@/lib/get-query-parameter";
import { router } from "@inertiajs/react";
import { pickBy } from "lodash";
import React, { useState } from "react";

interface IUseEmployee {
  office_id: number;
}

const useEmployee = ({ office_id }: IUseEmployee) => {
  const [perpage, setPerpage] = useState(() => getQueryParameter("per_page") || "10");
  const [search, setSearch] = useState(() => getQueryParameter("search") || "");

  const getData = (perpage: string, search: string, office_id: number) => {
    return router.get(
      route("employee.index"),
      pickBy({
        per_page: perpage,
        search,
        office_id: office_id,
      }),
      { preserveState: true, preserveScroll: true },
    );
  };

  const handlePerpage = (perpage: string) => {
    setPerpage(perpage);
    getData(perpage, search, office_id);
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    getData(perpage, search, office_id);
  };

  const deleteData = (employee: any) => {
    router.delete(route("employee.destroy", employee.id));
  };

  return {
    perpage,
    search,
    handlePerpage,
    handleSearchSubmit,
    getData,
    deleteData,
    setSearch,
    setPerpage,
  };
};

export default useEmployee;
