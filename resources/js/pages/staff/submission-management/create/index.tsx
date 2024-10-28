import { CalendarPicker } from "@/components/common/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import StaffLayoutPage from "@/layouts/staff";
import SubmissionCreateHeader from "./_partials/create-page-header";
import SumberDanaPengajuanSelect from "./_partials/sumber-dana";
import { SubmissionCreatePageProps } from "./create-page.type";

const SubmissionCreatePage: SubmissionCreatePageProps = () => {
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
            <div className="grid gap-[14px]">
              <Label className="text-xl">Character</Label>
              <div className="space-y-8">
                <div className="space-y-3">
                  <span>1. Lama Operasional Usaha</span>
                  <RadioGroup defaultValue="option-one" className="flex justify-between">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-one" id="option-one" />
                      <Label htmlFor="option-one"> {">"} 5 Tahun </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-two" id="option-two" />
                      <Label htmlFor="option-two">{"≥  3 thn s/d ≤ 5 thn"}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-three" id="option-three" />
                      <Label htmlFor="option-three">{"< 3 thn"}</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-3">
                  <span>2. Hubungan dgn Obligee</span>
                  <RadioGroup defaultValue="option-one" className="flex justify-between">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-one" id="option-one" />
                      <Label htmlFor="option-one">Sangat Baik</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-two" id="option-two" />
                      <Label htmlFor="option-two">Baik</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-three" id="option-three" />
                      <Label htmlFor="option-three">Cukup</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
            <div className="grid gap-[14px]">
              <Label className="text-xl">Capacity</Label>
              <div className="space-y-8">
                <div className="space-y-3">
                  <span>1. Pengalaman thd Jenis Pekerjaan</span>
                  <RadioGroup defaultValue="option-one" className="flex justify-between">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-one" id="option-one" />
                      <Label htmlFor="option-one">{">"} 4 Proyek yang sama</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-two" id="option-two" />
                      <Label htmlFor="option-two">{"> 1 < 4 Proyek yang Sama"}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-three" id="option-three" />
                      <Label htmlFor="option-three">{"Belum Pernah"}</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-3">
                  <span>2. Tenaga Ahli Sesuai Proyek</span>
                  <RadioGroup defaultValue="option-one" className="flex justify-between">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-one" id="option-one" />
                      <Label htmlFor="option-one">{"> 5 Tenaga Ahli"}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-two" id="option-two" />
                      <Label htmlFor="option-two">{"> 2 < 5 Tenaga Ahli"}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-three" id="option-three" />
                      <Label htmlFor="option-three">{"1 Tenaga Ahli"}</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-3">
                  <span>3. Peralatan mengerjakan proyek</span>
                  <RadioGroup defaultValue="option-one" className="flex justify-between">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-one" id="option-one" />
                      <Label htmlFor="option-one">{"Cukup, Milik Sendiri"}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-two" id="option-two" />
                      <Label htmlFor="option-two">{"Sewa Rutin dengan Supplier"}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-three" id="option-three" />
                      <Label htmlFor="option-three">{"Rencana Sewa"}</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
            <div className="grid gap-[14px]">
              <Label className="text-xl">Capital</Label>
              <div className="space-y-8">
                <div className="space-y-3">
                  <span>1. Rasio Likuiditas</span>
                  <RadioGroup defaultValue="option-one" className="flex justify-between">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-one" id="option-one" />
                      <Label htmlFor="option-one">{"> 1"}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-two" id="option-two" />
                      <Label htmlFor="option-two">{"= 1"}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-three" id="option-three" />
                      <Label htmlFor="option-three">{"< 1"}</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-3">
                  <span>2. Rasio Profitabilitas</span>
                  <RadioGroup defaultValue="option-one" className="flex justify-between">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-one" id="option-one" />
                      <Label htmlFor="option-one">{"> 20%"}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-two" id="option-two" />
                      <Label htmlFor="option-two">{"= 10 - 20%"}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-three" id="option-three" />
                      <Label htmlFor="option-three">{"< 10%"}</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-3">
                  <span>3. Rasio Solvabilitas</span>
                  <RadioGroup defaultValue="option-one" className="flex justify-between">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-one" id="option-one" />
                      <Label htmlFor="option-one">{"< 1"}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-two" id="option-two" />
                      <Label htmlFor="option-two">{"= 1"}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-three" id="option-three" />
                      <Label htmlFor="option-three">{"> 1"}</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-3">
                  <span>4 . Audit Laporan Keuangan</span>
                  <RadioGroup defaultValue="option-one" className="flex justify-between">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-one" id="option-one" />
                      <Label htmlFor="option-one">{"< 1"}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-two" id="option-two" />
                      <Label htmlFor="option-two">{"= 1"}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-three" id="option-three" />
                      <Label htmlFor="option-three">{"> 1"}</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
            <div className="grid gap-[14px]">
              <Label className="text-xl">Condition</Label>
              <div className="space-y-8">
                <div className="space-y-3">
                  <span>1. Syarat dalam Kontrak</span>
                  <RadioGroup defaultValue="option-one" className="flex justify-between">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-one" id="option-one" />
                      <Label htmlFor="option-one">{"Mudah dikerjakan"}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-two" id="option-two" />
                      <Label htmlFor="option-two">{"Masih dapat Dikerjakan"}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-three" id="option-three" />
                      <Label htmlFor="option-three">{"Sulit dikerjakan"}</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-3">
                  <span>2. Periode Kontrak Proyek</span>
                  <RadioGroup defaultValue="option-one" className="flex justify-between">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-one" id="option-one" />
                      <Label htmlFor="option-one">{"< 1 Tahun"}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-two" id="option-two" />
                      <Label htmlFor="option-two">{"s/d 1 Tahun"}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-three" id="option-three" />
                      <Label htmlFor="option-three">{"> 1 Tahun"}</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-3">
                  <span>3. Lokasi Proyek thd Kantor Pusat</span>
                  <RadioGroup defaultValue="option-one" className="flex justify-between">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-one" id="option-one" />
                      <Label htmlFor="option-one">{"Provinsi yang sama"}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-two" id="option-two" />
                      <Label htmlFor="option-two">{"Provinsi Lain"}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-three" id="option-three" />
                      <Label htmlFor="option-three">{"Luar Negeri"}</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-3">
                  <span>4. Supply Bahan Baku Proyek</span>
                  <RadioGroup defaultValue="option-one" className="flex justify-between">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-one" id="option-one" />
                      <Label htmlFor="option-one">{"dari Provinsi Sendiri"}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-two" id="option-two" />
                      <Label htmlFor="option-two">{"dari Provinsi Terdekat"}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-three" id="option-three" />
                      <Label htmlFor="option-three">{"dari Provinsi Lain"}</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
            <div className="grid gap-[14px]">
              <Label className="text-xl">Collateral</Label>
              <div className="space-y-8">
                <div className="space-y-3">
                  <span>1. Bentuk Collateral</span>
                  <RadioGroup defaultValue="option-one" className="flex justify-between">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-one" id="option-one" />
                      <Label htmlFor="option-one">{"Cash Collateral"}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-two" id="option-two" />
                      <Label htmlFor="option-two">{"Assets Collateral"}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-three" id="option-three" />
                      <Label htmlFor="option-three">{"Non Collateral"}</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-3">
                  <span>2. Nilai Collateral</span>
                  <RadioGroup defaultValue="option-one" className="flex justify-between">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-one" id="option-one" />
                      <Label htmlFor="option-one">{"> 50% Penal Sum"}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-two" id="option-two" />
                      <Label htmlFor="option-two">{"> 10% < 50%"}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-three" id="option-three" />
                      <Label htmlFor="option-three">{"s/d 10%"}</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-3">
                  <span>3. Indemnity Agreement</span>
                  <RadioGroup defaultValue="option-one" className="flex justify-between">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-one" id="option-one" />
                      <Label htmlFor="option-one">{"Sign By Dir dan PS"}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-two" id="option-two" />
                      <Label htmlFor="option-two">{"Sign By Dir dan Kom"}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-three" id="option-three" />
                      <Label htmlFor="option-three">{"Sign By Direktur"}</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="space-y-3">
                  <span>4. Legalitas Ind. Agreement</span>
                  <RadioGroup defaultValue="option-one" className="flex justify-between">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-one" id="option-one" />
                      <Label htmlFor="option-one">{"Dibuat Notaris"}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-two" id="option-two" />
                      <Label htmlFor="option-two">{"Didaftar ke Notaris"}</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-three" id="option-three" />
                      <Label htmlFor="option-three">{"Tanpa Notaris"}</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
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
