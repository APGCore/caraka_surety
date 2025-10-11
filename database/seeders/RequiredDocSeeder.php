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
        'name' => 'Copy Akte Pendirian Perusahaan, berikut perubahannya',
      ],
      [
        'no' => 2,
        'name' => 'Copy KTP (Kartu Tanda Penduduk)',
      ],
      [
        'no' => 3,
        'name' => 'Copy TDP (Tanda Daftar Perusahaan)',
      ],
      [
        'no' => 4,
        'name' => 'Surat Izin Usaha Perdagangan (SIUP)',
      ],
      [
        'no' => 5,
        'name' => 'Copy Nomor Pokok Wajib Pajak (NPWP)',
      ],
      [
        'no' => 6,
        'name' => 'Surat Keterangan Domisili (SKDP/SITU)',
      ],
      [
        'no' => 7,
        'name' => 'Copy Tanda Keanggotaan dari asosiasi Profesi KADIN/ GAPENSI/ARDIN',
      ],
      [
        'no' => 8,
        'name' => 'Copy Bukti Kepemilikan Agunan yang berupa Non Cash Collateral (jika ada)',
      ],
      [
        'no' => 9,
        'name' => 'Copy Neraca Laba Principal untuk 2 (dua) tahun terakhir',
      ],

      // khusus
      [
        'no' => 10,
        'name' => 'Copy Surat Permohonan Penetapan Izin Baru / Perpanjangan ke Kemenag',
      ],
      [
        'no' => 11,
        'name' => 'Copy Izin Umrah/Haji/Provider Visa sebelumnya (untuk Perpanjangan)',
      ],
      [
        'no' => 12,
        'name' => 'Copy Surat Rekomendasi Kanwil Kemenag (jika ada)',
      ],
      [
        'no' => 13,
        'name' => 'Surat Penerbitan Bank Garansi dari Obligee',
      ],
      [
        'no' => 14,
        'name' => 'Copy/salinan surat keterangan terdaftar dari Ditjen Migas atau Sitjen EBTKE ( Energi Baru, Terbaharukan dan Konservasi Energi)',
      ],
      [
        'no' => 15,
        'name' => 'Copy/salinan Surat Izin Usaha Pelayaran (Pelayaran bagi sektor Migas)',
      ],
      [
        'no' => 16,
        'name' => 'Copy SIUJK (Surat Ijin Usaha Jasa Konstruksi)',
      ],
      [
        'no' => 17,
        'name' => 'Kontrak awal',
      ],
      [
        'no' => 18,
        'name' => 'Kontrak Amandemen 1',
      ],
      [
        'no' => 19,
        'name' => 'Copy Warkat Bank Garansi',
      ],
      [
        'no' => 20,
        'name' => 'Surat Pernyataan dan Kesanggupan Bertanggung Jawab Mutlak (SPKBJM)',
      ],
    ];

    foreach ($datas as $data) {
      RequiredDoc::query()->create($data);
    }
  }
}
