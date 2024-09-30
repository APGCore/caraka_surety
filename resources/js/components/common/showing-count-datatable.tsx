export const ShowingCountDatatable = ({ meta }: { meta: any }) => {
  return (
    <div className="text-sm text-gray-500">
      Menampilkan {meta?.from} hingga {meta?.to} dari {meta?.total} hasil
    </div>
  );
};
