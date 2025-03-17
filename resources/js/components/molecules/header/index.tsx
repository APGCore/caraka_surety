import { PageProps } from "@/types";
import { Head } from "@inertiajs/react";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../_shadcn-ui/breadcrumb";
import RenderList from "../../atoms/render-list";
import Show from "../../atoms/show";

interface IHeaderPage extends PageProps {}

const HeaderPage: React.FC<IHeaderPage> = (props) => {
  return (
    <>
      <Head title={props?.page_settings?.title} />
      <Breadcrumb>
        <BreadcrumbList>
          <RenderList
            of={props?.page_settings?.breadcrumb}
            render={(item: { title: string }, index) => {
              return (
                <>
                  <BreadcrumbItem>
                    <Show when={index !== props?.page_settings?.breadcrumb?.length - 1}>
                      <BreadcrumbLink href={route("products.index")}>{item?.title}</BreadcrumbLink>
                    </Show>
                    <Show when={index === props?.page_settings?.breadcrumb?.length - 1}>
                      <BreadcrumbPage>{item?.title}</BreadcrumbPage>
                    </Show>
                  </BreadcrumbItem>
                  <Show when={index !== props?.page_settings?.breadcrumb?.length - 1}>
                    <BreadcrumbSeparator />
                  </Show>
                </>
              );
            }}
          />
        </BreadcrumbList>
      </Breadcrumb>
    </>
  );
};

export default HeaderPage;
