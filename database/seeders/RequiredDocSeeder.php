<?php

namespace Database\Seeders;

use App\Models\Document\RequiredDoc;
use Illuminate\Database\Seeder;

class RequiredDocSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $datas = [
            [
                'name' => 'Copy Akte Pendirian Perusahaan, berikut perubahannya',
            ],
            [
                'name' => 'Copy KTP (Kartu Tanda Penduduk)',
            ],
            [
                'name' => 'Copy TDP (Tanda Daftar Perusahaan)',
            ],
            [
                'name' => 'Surat Izin Usaha Perdagangan (SIUP)',
            ],
            [
                'name' => 'Copy Nomor Pokok Wajib Pajak (NPWP)',
            ],
            [
                'name' => 'Surat Keterangan Domisili (SKDP/SITU)',
            ],
            [
                'name' => 'Copy Tanda Keanggotaan dari asosiasi Profesi KADIN/ GAPENSI/ARDIN',
            ],
            [
                'name' => 'Copy Bukti Kepemilikan Agunan yang berupa Non Cash Collateral (jika ada)',
            ],
            [
                'name' => 'Copy Neraca Laba Principal untuk 2 (dua) tahun terakhir',
            ],

            // khusus
            [
                'name' => 'Copy Surat Permohonan Penetapan Izin Baru / Perpanjangan ke Kemenag',
            ],
            [
                'name' => 'Copy Izin Umrah/Haji/Provider Visa sebelumnya (untuk Perpanjangan)',
            ],
            [
                'name' => 'Copy Surat Rekomendasi Kanwil Kemenag (jika ada)',
            ],
            [
                'name' => 'Surat Penerbitan Bank Garansi dari Obligee',
            ],
            [
                'name' => 'Copy/salinan surat keterangan terdaftar dari Ditjen Migas atau Sitjen EBTKE ( Energi Baru, Terbaharukan dan Konservasi Energi)',
            ],
            [
                'name' => 'Copy/salinan Surat Izin Usaha Pelayaran (Pelayaran bagi sektor Migas)',
            ],
            [
                'name' => 'Copy SIUJK (Surat Ijin Usaha Jasa Konstruksi)',
            ],
            [
                'name' => 'Kontrak awal',
            ],
            [
                'name' => 'Kontrak Amandemen 1',
            ],

            [
                'name' => 'Copy Warkat Bank Garansi',
            ],
            [
                'name' => 'Surat Pernyataan dan Kesanggupan Bertanggung Jawab Mutlak (SPKBJM)',
            ],
        ];

        foreach ($datas as $data) {
            RequiredDoc::create($data);
        }
    }
}
