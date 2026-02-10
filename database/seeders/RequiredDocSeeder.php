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
                'no' => 1,
                'name' => 'Akte Pendirian Perusahaan',
                'is_required' => true,
            ],
            [
                'no' => 2,
                'name' => 'Nomor Induk Berusaha (NIB)',
                'is_required' => true,
            ],
            [
                'no' => 3,
                'name' => 'NPWP Perusahaan',
                'is_required' => true,
            ],
            [
                'no' => 4,
                'name' => 'Laporan Keuangan 2023',
                'is_required' => true,
            ],
            [
                'no' => 5,
                'name' => 'Laporan Keuangan 2024',
                'is_required' => true,
            ],
            [
                'no' => 6,
                'name' => 'List Pengalaman Perusahaan',
                'is_required' => true,
            ],
            [
                'no' => 7,
                'name' => 'Copy KTP (Kartu Tanda Penduduk)',
                'is_required' => false,
            ],
            [
                'no' => 8,
                'name' => 'Copy TDP (Tanda Daftar Perusahaan)',
                'is_required' => false,
            ],
            [
                'no' => 9,
                'name' => 'Surat Izin Usaha Perdagangan (SIUP)',
                'is_required' => false,
            ],
            [
                'no' => 10,
                'name' => 'Surat Keterangan Domisili (SKDP/SITU)',
                'is_required' => false,
            ],
            [
                'no' => 11,
                'name' => 'Copy Tanda Keanggotaan dari asosiasi Profesi KADIN/GAPENSI/ARDIN',
                'is_required' => false,
            ],
            [
                'no' => 12,
                'name' => 'Copy Bukti Kepemilikan Agunan yang berupa Non Cash Collateral (jika ada)',
                'is_required' => false,
            ],

            // khusus
            [
                'no' => 13,
                'name' => 'Copy Surat Permohonan Penetapan Izin Baru / Perpanjangan ke Kemenag',
                'is_required' => false,
            ],
            [
                'no' => 14,
                'name' => 'Copy Izin Umrah/Haji/Provider Visa sebelumnya (untuk Perpanjangan)',
                'is_required' => false,
            ],
            [
                'no' => 15,
                'name' => 'Copy Surat Rekomendasi Kanwil Kemenag (jika ada)',
                'is_required' => false,
            ],
            [
                'no' => 16,
                'name' => 'Surat Penerbitan Bank Garansi dari Obligee',
                'is_required' => false,
            ],
            [
                'no' => 17,
                'name' => 'Copy/salinan surat keterangan terdaftar dari Ditjen Migas atau Sitjen EBTKE',
                'is_required' => false,
            ],
            [
                'no' => 18,
                'name' => 'Copy/salinan Surat Izin Usaha Pelayaran (Pelayaran bagi sektor Migas)',
                'is_required' => false,
            ],
            [
                'no' => 19,
                'name' => 'Copy SIUJK (Surat Ijin Usaha Jasa Konstruksi)',
                'is_required' => false,
            ],
            [
                'no' => 20,
                'name' => 'Kontrak awal',
                'is_required' => false,
            ],
            [
                'no' => 21,
                'name' => 'Kontrak Amandemen 1',
                'is_required' => false,
            ],
            [
                'no' => 22,
                'name' => 'Copy Warkat Bank Garansi',
                'is_required' => false,
            ],
            [
                'no' => 23,
                'name' => 'Surat Pernyataan dan Kesanggupan Bertanggung Jawab Mutlak (SPKBJM)',
                'is_required' => false,
            ],
        ];

        foreach ($datas as $data) {
            RequiredDoc::query()->updateOrCreate(
                ['no' => $data['no']],
                $data
            );
        }
    }
}
