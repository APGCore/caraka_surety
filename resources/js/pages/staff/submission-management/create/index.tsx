import { CalendarPicker } from "@/components/common/calendar";
import RenderList from "@/components/common/render-list";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
              <Input className="text-md" />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">NPWP</Label>
              <Input className="text-md" />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">No. Telepon</Label>
              <Input className="text-md" />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">NIB</Label>
              <Input className="text-md" />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">SIUP/SIUJK</Label>
              <Input className="text-md" />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">Nama Direksi</Label>
              <Input className="text-md" />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">Jabatan</Label>
              <Input className="text-md" />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">Nomor Handphone</Label>
              <Input className="text-md" />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">Komisaris</Label>
              <Input className="text-md" />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">Perusahaan Berdiri Tahun</Label>
              <Input className="text-md" />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">Akte Perubahan Terakhir</Label>
              <Input className="text-md" />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">Alamat</Label>
              <Textarea className="text-md" />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-3">Kontrak</h2>
          <div className="grid gap-4">
            <div className="grid gap-[5px]">
              <Label className="text-md">Produk</Label>
              <SumberDanaPengajuanSelect />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">Jenis Jaminan</Label>
              <SumberDanaPengajuanSelect />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">Obligee</Label>
              <SumberDanaPengajuanSelect />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">Jenis Dokumen</Label>
              <Input className="text-md" />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">Nomor Dokumen</Label>
              <Input className="text-md" />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">Tanggal Dokumen</Label>
              <Input className="text-md" />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">Nilai Kontrak</Label>
              <Input className="text-md" />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">Nilai Jaminan</Label>
              <Input className="text-md" />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">Jangka Waktu</Label>
              <Input className="text-md" type="number" />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">Tanggal Terbit Jaminan</Label>
              <CalendarPicker />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">Lokasi Proyek</Label>
              <Textarea className="text-md" />
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
              <Input className="text-md" />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">Copy Akte Pendirian Perusahaan</Label>
              <Input className="text-md" />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">Copy KTP (Kartu Tanda Penduduk)</Label>
              <Input className="text-md" />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">Copy TDP (Tanda Daftar Perusahaan)</Label>
              <Input className="text-md" />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">Surat Izin Usaha Perdagangan (SIUP)</Label>
              <Input className="text-md" />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">Copy Nomor Pokok Wajib Pajak (NPWP)</Label>
              <Input className="text-md" />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">Surat Keterangan Domisili (SKDP/SITU)</Label>
              <Input className="text-md" />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">Copy Tanda Keanggotaan dari asosiasi Profesi KADIN/ GAPENSI/ARDIN</Label>
              <Input className="text-md" />
            </div>
            <div className="grid gap-[5px]">
              <Label className="text-md">Copy Neraca Laba Principal untuk 2 (dua) tahun terakhir</Label>
              <Input className="text-md" />
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
                    <Label className="text-xl">{scoringCategories?.name}</Label>
                    <div className="space-y-8">
                      <RenderList
                        of={scoringCategories?.questions}
                        render={(scoringQuestions) => {
                          return (
                            <div className="space-y-3">
                              <span>{scoringQuestions?.name}</span>
                              <RadioGroup defaultValue="option-one" className="flex justify-between">
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
