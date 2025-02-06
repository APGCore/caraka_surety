import { textCurrency } from "@/common/utils/text-currency";
import RenderList from "@/components/atoms/render-list";
import Show from "@/components/atoms/show";
import { RecentSalesPageProps } from "./recent-sales.type";

const RecentSales: RecentSalesPageProps = ({ submissions }) => {
  return (
    <div className="space-y-8 max-h-[350px] overflow-y-auto pr-5">
      <Show when={submissions?.length > 0}>
        <RenderList
          of={submissions}
          render={(e: any) => {
            return (
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">{e.principal.name}</p>
                  <p className="text-sm text-muted-foreground">{e.product.name}</p>
                </div>
                <div className="ml-auto">
                  <p className="text-sm font-medium leading-none">Rp. {textCurrency(e.contract_value)}</p>
                </div>
              </div>
            );
          }}
        />
      </Show>
    </div>
  );
};

export { RecentSales };
