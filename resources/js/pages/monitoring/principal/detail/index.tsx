import { formatCurrency } from "@/_features/_common/utils/format-currency";
import { Button } from "@/components/_shadcn-ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/_shadcn-ui/table";
import RenderList from "@/components/atoms/render-list";
import RoleBasedLayout from "@/layouts/role-based-layout";
import { Link } from "@inertiajs/react";
import React from "react";
import PrincipalDetailHeader from "./_partials/principal-detail-page-header";

interface ActiveSubmission {
  id: number;
  job_name: string | null;
  no_guarantee: string;
  no_policy: string | null;
  guarantee_value: string | number;
  start_date: string | null;
  end_date: string | null;
}

interface PrincipalDetailPageProps {
  page_settings: { title: string };
  principal: any;
  active_submissions: ActiveSubmission[];
  total_guarantee_value: number;
}

type PrincipalDetailPage = React.FC<PrincipalDetailPageProps> & {
  layout?: (page: any) => JSX.Element;
};

const InfoRow: React.FC<{ label: string; value?: string | number | null }> = ({ label, value }) => (
  <TableRow>
    <TableCell className="w-1/3 font-medium text-muted-foreground bg-muted/30">{label}</TableCell>
    <TableCell>{value || "-"}</TableCell>
  </TableRow>
);

const GroupHeader: React.FC<{ title: string }> = ({ title }) => (
  <TableRow className="hover:bg-transparent">
    <TableCell
      colSpan={2}
      className="py-2 px-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground bg-muted/60 border-t">
      {title}
    </TableCell>
  </TableRow>
);

const PrincipalDetailPage: PrincipalDetailPage = ({ principal, active_submissions, total_guarantee_value }) => {
  const fullAddress = [principal.village, principal.district?.name, principal.regency?.name, principal.province?.name]
    .filter(Boolean)
    .join(", ");

  return (
    <main className="space-y-8">
      {/* Header actions */}
      <div className="flex justify-end">
        <Link href={route("monitoring.principal.index")}>
          <Button variant="outline" size="sm">
            Kembali
          </Button>
        </Link>
      </div>

      {/* Section 1: Profile Perusahaan */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Profile Perusahaan</h2>
        <Table>
          <TableBody>
            <GroupHeader title="Identitas Perusahaan" />
            <InfoRow label="Nama Perusahaan" value={principal.name} />
            <InfoRow label="Bidang Usaha" value={principal.business_fields} />
            <InfoRow label="Tahun Berdiri" value={principal.year_established} />
            <InfoRow label="NPWP" value={principal.npwp} />
            <InfoRow label="NIB" value={principal.nib} />
            <InfoRow label="Nomor Telepon" value={principal.telephone} />

            <GroupHeader title="Akta" />
            <InfoRow label="Akta Pendirian" value={principal.est_deed} />
            <InfoRow label="Akta Perubahan Terakhir" value={principal.last_deed} />

            <GroupHeader title="Pimpinan" />
            <InfoRow label="Nama Direktur" value={principal.director_name} />
            <InfoRow label="Jabatan" value={principal.director_position} />
            <InfoRow label="No. Telepon Direktur" value={principal.director_phone} />
            <InfoRow label="Alamat Direktur" value={principal.director_address} />

            <GroupHeader title="Komisaris" />
            <InfoRow label="Nama Komisaris" value={principal.commissioner} />
            <InfoRow label="Jabatan Komisaris" value={principal.commissioner_position} />

            <GroupHeader title="Alamat Perusahaan" />
            <InfoRow label="Provinsi" value={principal.province?.name} />
            <InfoRow label="Kabupaten / Kota" value={principal.regency?.name} />
            <InfoRow label="Kecamatan" value={principal.district?.name} />
            <InfoRow label="Desa / Kelurahan" value={principal.village} />
            <InfoRow label="Alamat Lengkap" value={principal.address} />
            <InfoRow label="Kode Pos" value={principal.postal_code} />
          </TableBody>
        </Table>
      </section>

      {/* Section 2: Daftar Proyek Aktif */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Daftar Proyek Aktif</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-0">#</TableHead>
              <TableHead>Nama Pekerjaan</TableHead>
              <TableHead>No Polis / No Jaminan</TableHead>
              <TableHead>Masa Berlaku</TableHead>
              <TableHead className="text-right">Nilai Jaminan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <RenderList
              of={active_submissions}
              render={(submission: ActiveSubmission, index: number) => (
                <TableRow key={submission.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{submission.job_name ?? "-"}</TableCell>
                  <TableCell className="font-mono text-sm">{submission.no_policy || submission.no_guarantee}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {submission.start_date && submission.end_date
                      ? `${submission.start_date} — ${submission.end_date}`
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right">{formatCurrency(submission.guarantee_value)}</TableCell>
                </TableRow>
              )}
              renderFallback={() => (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Tidak ada proyek aktif
                  </TableCell>
                </TableRow>
              )}
            />
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4} className="text-right font-semibold">
                TOTAL NILAI JAMINAN AKTIF
              </TableCell>
              <TableCell className="text-right font-semibold">{formatCurrency(total_guarantee_value)}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </section>
    </main>
  );
};

export default PrincipalDetailPage;

PrincipalDetailPage.layout = (page: any) => {
  const pagePropsData = page.props;
  return (
    <RoleBasedLayout propsData={pagePropsData}>
      <PrincipalDetailHeader title={pagePropsData?.page_settings?.title} />
      {page}
    </RoleBasedLayout>
  );
};
