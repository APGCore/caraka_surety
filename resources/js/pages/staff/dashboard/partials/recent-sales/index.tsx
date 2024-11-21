import RenderList from "@/components/common/render-list";
import Show from "@/components/common/show";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const data = [
  {
    pt: "PT KAM",
    jumlah: "Rp 1.000.000",
    produk: "Surety Bond",
  },
  {
    pt: "PT ABC",
    jumlah: "Rp 2.500.000",
    produk: "Custom Bond",
  },
  {
    pt: "PT XYZ",
    jumlah: "Rp 1.750.000",
    produk: "Performance Bond",
  },
  {
    pt: "PT DEF",
    jumlah: "Rp 3.000.000",
    produk: "Bid Bond",
  },
  {
    pt: "PT GHI",
    jumlah: "Rp 2.200.000",
    produk: "Maintenance Bond",
  },
  {
    pt: "PT KAM",
    jumlah: "Rp 1.000.000",
    produk: "Surety Bond",
  },
  {
    pt: "PT ABC",
    jumlah: "Rp 2.500.000",
    produk: "Custom Bond",
  },
  {
    pt: "PT XYZ",
    jumlah: "Rp 1.750.000",
    produk: "Performance Bond",
  },
  {
    pt: "PT DEF",
    jumlah: "Rp 3.000.000",
    produk: "Bid Bond",
  },
  {
    pt: "PT GHI",
    jumlah: "Rp 2.200.000",
    produk: "Maintenance Bond",
  },
];

const RecentSales = () => {
  return (
    <div className="space-y-8 max-h-[350px] overflow-y-auto pr-5">
      <Show when={data?.length > 0}>
        <RenderList
          of={data}
          render={(e) => {
            return (
              <div className="flex items-center">
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">{e.pt}</p>
                  <p className="text-sm text-muted-foreground">{e.produk}</p>
                </div>
                <div className="ml-auto">
                  <p className="text-sm font-medium leading-none">{e.jumlah}</p>
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
