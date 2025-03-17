import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from "@/components/_shadcn-ui/breadcrumb";
import { Button } from "@/components/_shadcn-ui/button";
import RoleBasedLayout from "@/layouts/role-based-layout";
import { Head, Link } from "@inertiajs/react";
// import templateDraftSurety from "../template-draft-surety";
// import templateAnalyst from "../template-hasil-analisa";
// import templateContent from "../template-surat-pelaksanaan";
// import secondTemplateContent from "../template-surat-permohonan";
import { SubmissionDetailPageProps } from "./submission-detail-page.type";

const SubmissionDetailPage: SubmissionDetailPageProps = ({ submission, status }) => {
    return (
        <main className="space-y-5">
            <h1 className="text-2xl font-semibold">Detail Pengajuan</h1>
            <div className="border rounded-lg p-4 space-y-4 bg-white">
                <div>
                    <strong>Status:</strong>{" "}
                    <span
                        className={`px-2 py-1 text-xs font-semibold rounded ${
                            status === "Approved"
                                ? "bg-green-100 text-green-800"
                                : status === "Rejected"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                        }`}>
                        {status}
                    </span>
                </div>
                <div>
                    <strong>Nama Perusahaan :</strong> <span>{submission}</span>
                </div>
                <div>
                    <strong>Alamat Perusahaan:</strong> <span>{submission}</span>
                </div>
                <div>
                    <strong>NPWP :</strong> <span>{submission}</span>
                </div>
                <div>
                    <strong>No Telp Perusahaan:</strong> <span>{submission}</span>
                </div>
                <div>
                    <strong>NIB :</strong> <span>{submission}</span>
                </div>
                <div>
                    <strong>SIUP / SIUJK :</strong> <span>{submission}</span>
                </div>
                <div>
                    <strong>Nama Direksi :</strong> <span>{submission}</span>
                </div>
                <div>
                    <strong>Jabatan :</strong> <span>{submission}</span>
                </div>
                <div>
                    <strong>Nomor Handphone :</strong> <span>{submission}</span>
                </div>
                <div>
                    <strong>Komisiaris :</strong> <span>{submission}</span>
                </div>
                <div>
                    <strong>Perusahaan Berdiri Tahun :</strong> <span>{submission}</span>
                </div>
                <div>
                    <strong>Akte Perubahan Terakhir :</strong> <span>{submission}</span>
                </div>
                <div>
                    <strong>Detail Pengajuan:</strong>
                    <p>{submission}</p>
                </div>
            </div>
            <h1 className="text-2xl font-semibold">Output Surat</h1>
            <p className="text-xl font-semibold">Jaminan Pelaksanaan</p>
            <textarea id="surat-pelaksanaan"></textarea>
            <br />
            <p className="text-xl font-semibold">Surat Permohonan</p>
            <textarea id="surat-permohonan"></textarea>
            <br />
            <p className="text-xl font-semibold">Hasil Analisa</p>
            <textarea id="hasil-analisa"></textarea>
            <br />
            <p className="text-xl font-semibold">Draft Surety</p>
            <textarea id="draft-surety"></textarea>

            <div className="flex justify-end gap-3">
                <Button asChild>
                    <Link href={route("submission.index")}>Kembali</Link>
                </Button>
            </div>
        </main>
    );
};

export default SubmissionDetailPage;

SubmissionDetailPage.layout = (page: any) => {
    const pagePropsData = page.props;

    return (
        <RoleBasedLayout propsData={pagePropsData}>
            <Head title={`Detail Pengajuan - ${pagePropsData?.submission?.applicant_name ?? "Pengajuan"}`} />
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href={route("submission.index")}>Kelola Pengajuan</BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            {page}
        </RoleBasedLayout>
    );
};
