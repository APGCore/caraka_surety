import { CalendarPicker } from "@/components/common/calendar";
import { FileInput } from "@/components/common/input-file";
import RenderList from "@/components/common/render-list";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import StaffLayoutPage from "@/layouts/staff";
import axios from "axios";
import { useEffect, useState } from "react";
import SubmissionCreateHeader from "./_partials/create-page-header";
import SumberDanaPengajuanSelect from "./_partials/sumber-dana";
import { SubmissionCreatePageProps } from "./create-page.type";

const SubmissionCreatePage: SubmissionCreatePageProps = () => {
  const [scoring, setScoring] = useState<any[]>([]);
  const [selectedOptions, setSelectedOptions] = useState({});

  const scoringOptionIds = Object.values(selectedOptions);

  const handleOptionChange = (questionId: string, optionId: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  console.log({
    selectedOptions,
    scoringOptionIds,
  });

  useEffect(() => {
    axios
      .get(route("staff-scoring-get.byId", { scoring: 1 }))
      .then((response) => {
        // console.log(response.data.categories);
        setScoring(response.data.categories);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="w-[800px] mt-[50px] mx-auto ">
      <form className="space-y-16">
        <div>
          <h2 className="text-2xl font-bold mb-3">Data Perusahaan</h2>
          <div className="grid gap-4">
            <div className="grid gap-[5px]">
              <Label className="text-md">Nama</Label>
              <Input className="text-md" placeholder="Nama perusahaan" />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">NPWP</Label>
              <Input className="text-md" placeholder="No NPWP" />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">No. Telepon</Label>
              <Input className="text-md" placeholder="No PIC Perusahaan" />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">NIB</Label>
              <Input className="text-md" placeholder="No NIB" />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">SIUP/SIUJK</Label>
              <Input className="text-md" placeholder="No SIUP/SIUJK" />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">Nama Direksi</Label>
              <Input className="text-md" placeholder="Nama Direksi Perusahaan" />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">Jabatan</Label>
              <Input className="text-md" placeholder="Jabatan PIC" />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">Nomor Handphone</Label>
              <Input className="text-md" placeholder="Nomor telepon Jabatan" />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">Komisaris</Label>
              <Input className="text-md" placeholder="Komisaris" />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">Perusahaan Berdiri Tahun</Label>
              <Input className="text-md" type="number" placeholder="Tahun berdiri perusahaan" />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">Akte Perubahan Terakhir</Label>
              <Input className="text-md" placeholder="Akte perubahan terakir" />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">Alamat</Label>
              <Textarea className="text-md" placeholder="Alamat perusahaan" />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-3">Kontrak</h2>
          <div className="grid gap-4">
            <div className="grid gap-[5px]">
              <Label className="text-md">Produk</Label>
              <SumberDanaPengajuanSelect placeholder="Pilih Produk" />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">Asuransi/Penjamin</Label>
              <SumberDanaPengajuanSelect placeholder="Pilih Asuransi/Penjamin" />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">Jenis Jaminan</Label>
              <SumberDanaPengajuanSelect placeholder="Pilih Jenis Jaminan" />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">Obligee</Label>
              <SumberDanaPengajuanSelect placeholder="Pilih Obligee" />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">Jenis Dokumen</Label>
              <SumberDanaPengajuanSelect placeholder="Pilih Jenis Dokumen" />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">Nomor Dokumen</Label>
              <Input className="text-md" type="number" placeholder="Nomor Dokumen" />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">Tanggal Dokumen</Label>
              <CalendarPicker />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">Nilai Kontrak</Label>
              <Input className="text-md" type="number" placeholder="Nilai Kontrak" />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">Nilai Jaminan</Label>
              <Input className="text-md" type="number" placeholder="Nilai Jaminan" />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">Jangka Waktu</Label>
              <Input className="text-md" type="number" placeholder="Jangka Waktu" />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">Tanggal Terbit Jaminan</Label>
              <CalendarPicker />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">Lokasi Proyek</Label>
              <Textarea className="text-md" placeholder="Lokasi Proyek" />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">Sumber Dana</Label>
              <SumberDanaPengajuanSelect />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-3">Dokumen Perusahaan</h2>
          <div className="grid gap-4">
            <div className="grid gap-[5px]">
              <Label className="text-md">Profil Perusahaan Principal</Label>
              <FileInput />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">Copy Akte Pendirian Perusahaan</Label>
              <FileInput />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">Copy KTP (Kartu Tanda Penduduk)</Label>
              <FileInput />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">Copy TDP (Tanda Daftar Perusahaan)</Label>
              <FileInput />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">Surat Izin Usaha Perdagangan (SIUP)</Label>
              <FileInput />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">Copy Nomor Pokok Wajib Pajak (NPWP)</Label>
              <FileInput />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">Surat Keterangan Domisili (SKDP/SITU)</Label>
              <FileInput />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">Copy Tanda Keanggotaan dari asosiasi Profesi KADIN/ GAPENSI/ARDIN</Label>
              <FileInput />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">Copy Neraca Laba Principal untuk 2 (dua) tahun terakhir</Label>
              <FileInput />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-8">Skoring</h2>
          <div className="grid gap-16">
            <RenderList
              of={scoring}
              render={(scoringCategories) => {
                return (
                  <div className="grid gap-[14px]">
                    <Label className="text-xl underline underline-offset-4">Kategori {scoringCategories?.name}</Label>
                    <div className="space-y-8">
                      <RenderList
                        of={scoringCategories?.questions}
                        render={(scoringQuestions, idx) => {
                          return (
                            <div className="space-y-3">
                              <div className="font-[600]">
                                {" "}
                                <span className="mr-3">{idx + 1}.</span>
                                <span>{scoringQuestions?.name}</span>
                              </div>
                              <RadioGroup defaultValue="option-one" className="flex flex-col gap-y-3.5 ml-6">
                                <RenderList
                                  of={scoringQuestions?.options}
                                  render={(scoringOptions) => {
                                    return (
                                      <div className="flex items-center space-x-2">
                                        <RadioGroupItem
                                          value={scoringOptions?.name}
                                          id={scoringOptions?.name}
                                          onClick={() =>
                                            handleOptionChange(
                                              scoringQuestions.id,
                                              scoringOptions.id,
                                              //   scoringOptions.points,
                                            )
                                          }
                                        />
                                        <Label htmlFor="option-one">{scoringOptions?.name}</Label>
                                      </div>
                                    );
                                  }}
                                />
                              </RadioGroup>
                            </div>
                          );
                        }}
                      />
                    </div>
                  </div>
                );
              }}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default SubmissionCreatePage;

SubmissionCreatePage.layout = (page: any) => {
  const pagePropsData = page.props;

  return (
    <StaffLayoutPage user={pagePropsData?.auth?.user}>
      <SubmissionCreateHeader title={pagePropsData?.page_settings?.title} />
      {page}
    </StaffLayoutPage>
  );
};
