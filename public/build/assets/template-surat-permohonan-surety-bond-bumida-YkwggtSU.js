const t=`
<h2 style="text-align: center;">SURETY BOND (DUMMY)</h2>

<p style="text-align: justify; margin-bottom: 10px;">Nomor Surety Bond   :  SB-40.91.02.AAAAAAA.11.22</p>
<p style="text-align: justify; margin-bottom: 10px;">Nilai Jaminan :  Rp. 34.000.000</p>

<table style="width: 100%; border-collapse: collapse; line-height: 1.5;">
    <tr>
        <td style="width: 30px; vertical-align: top;">1.</td>
        <td style="text-align: justify;">Kami yang bertanda tangan di bawah ini: PT. ASURANSI UMUM VIDEI (NAMA PENJAMIN), berkantor di Graha Mustika Ratu, Jl. Jend. Gatot Subroto, Jakarta (ALAMAT PENJAMIN), selanjutnya disebut sebagai PENJAMIN, menyatakan dengan ini menjamin kewajiban PT. MOTI BATARA ALKESINDO (NAMA PRINCIPAL), berkantor di Jl. Agave Raya Blok A1 No. 19A, Jakarta Barat (ALAMAT PRINCIPAL), selanjutnya disebut sebagai PRINCIPAL, terhadap PT. POLITEKNIK KESEHATAN JAKARTA III (NAMA OBLIGEE), berkantor di Jl. Arteri JORR, Bekasi (ALAMAT OBLIGEE), yang selanjutnya disebut sebagai OBLIGEE.</td>
    </tr>
    <tr>
        <td style="vertical-align: top;">2.</td>
        <td style="text-align: justify;">PENJAMIN bertanggung jawab untuk membayar kepada OBLIGEE sejumlah Rp. 34.000.000 (BESARAN NILAI JAMINAN) dalam hal PRINCIPAL gagal memenuhi kewajibannya dalam menyelesaikan Pekerjaan Pengadaan Alat Laboratorium Politeknik Kesehatan Jakarta III (NAMA PEKERJAAN) sesuai dengan ketentuan dalam kontrak Nomor KN.01.01/V/6747/2019 (NOMOR KONTRAK) tanggal 30 September 2019 (TANGGAL KONTRAK).</td>
    </tr>
    <tr>
        <td style="vertical-align: top;">3.</td>
        <td style="text-align: justify;">Jaminan ini berlaku efektif sejak tanggal 01 Oktober 2019 dan berakhir pada 29 Desember 2019 (MASA BERLAKU), atau sampai dengan berakhirnya masa pemeliharaan yang telah disepakati dalam kontrak, mana yang lebih lama.</td>
    </tr>
    <tr>
        <td style="vertical-align: top;">4.</td>
        <td style="text-align: justify;">Jaminan ini akan berlaku apabila PRINCIPAL gagal melaksanakan kewajiban sebagaimana ditentukan dalam kontrak, termasuk tetapi tidak terbatas pada keterlambatan penyelesaian pekerjaan atau pemutusan kontrak karena kelalaian PRINCIPAL.</td>
    </tr>
    <tr>
        <td style="vertical-align: top;">5.</td>
        <td style="text-align: justify;">PENJAMIN akan membayar kepada OBLIGEE tanpa syarat dalam jangka waktu paling lambat 14 (empat belas) hari kerja setelah menerima tuntutan tertulis dari OBLIGEE berdasarkan pernyataan bahwa PRINCIPAL gagal memenuhi kewajiban.</td>
    </tr>
    <tr>
        <td style="vertical-align: top;">6.</td>
        <td style="text-align: justify;">Tuntutan pencairan jaminan ini harus diajukan oleh OBLIGEE selambat-lambatnya 30 (tiga puluh) hari setelah berakhirnya masa berlaku jaminan ini.</td>
    </tr>
</table>

<table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
    <tr>
        <td style="text-align: left;">Dikeluarkan di Jakarta pada tanggal 01 Oktober 2019 (TANGGAL PENERBITAN)</td>
        <td></td> <!-- Kolom kosong untuk menjaga keselarasan -->
    </tr>
    <tr>
        <td style="text-align: left;">PT. ASURANSI UMUM VIDEI (PENJAMIN)</td>
        <td style="text-align: right;">PT. MOTI BATARA ALKESINDO (PRINCIPAL)</td>
    </tr>
    <tr>
        <td style="text-align: left;"><br></td>
        <td></td>
    </tr>
    <tr>
        <td style="text-align: left;">
            Muhammad Ridzqan Hanafis (NAMA PENANGGUNG JAWAB PENJAMIN)<br>
            Direktur (JABATAN PENJAMIN)
        </td>
        <td style="text-align: right;">
            Marthen F Surentu<br>
            Kepala Cabang
        </td>
    </tr>
</table>
`,a=`
<table style="width: 100%; text-align: center; border-collapse: collapse;" border="1">
    <tr>
        <td colspan="2">
            <strong>RESUME ANALISA PENJAMINAN</strong><br>
            <strong>SURETY BOND</strong><br>
            JAMINAN .............<br>
            PT..........<br>
            Nomor : ...../BPR/bulan/tahun
        </td>
    </tr>
     <tr style="width: 100%;">
        <td style="width: 50%;">Hari, Tanggal Pengajuan</td>
        <td style="width: 50%;"></td>
    </tr>
</table>

<br>


<table style="width: 100%; border-collapse: collapse;"  border="1">
    <tr>
        <td style="width: 5%; text-align:center;"><strong> I </strong></td>
        <td><strong> Informasi Penjaminan </strong></td>
    </tr>
</table>

<table style="width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 10px;">
  <tr>
    <td style="border-left: 1px solid black; border-right: 1px solid black; text-align: center;">
      <strong>INFORMASI PRINCIPAL</strong>
    </td>
  </tr>
</table>


<table style="width: 100%; border-collapse: collapse;" border="1">
  <tr >
    <td>Nama Terjamin</td>
    <td>: [NAMA_TERJAMIN]</td>
  </tr>
  <tr>
    <td>Alamat Terjamin</td>
    <td>: [ALAMAT_TERJAMIN]</td>
  </tr>
  <tr>
    <td>Nama Penanggung Jawab</td>
    <td>: [NAMA_PENANGGUNG_JAWAB]</td>
  </tr>
  <tr>
    <td>Jabatan</td>
    <td>: [JABATAN_PENANGGUNG_JAWAB]</td>
  </tr>
  <tr>
    <td colspan="2" style="text-align: center"><strong>LEGALITAS DAN IZIN USAHA</strong></td>
  </tr>
  <tr>
    <td>Akta Pendirian</td>
    <td>: [AKTA_PENDIRIAN]</td>
  </tr>
  <tr>
    <td>Akta Perubahan</td>
    <td>: [AKTA_PERUBAHAN]</td>
  </tr>
  <tr>
    <td>NPWP</td>
    <td>: [NPWP]</td>
  </tr>
  <tr>
    <td>NIB</td>
    <td>: [NIB]</td>
  </tr>

</table>

<table style="width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 10px;" border="1">
  <tr>
    <td style="text-align: center;" colspan="3">
      <strong>SUSUNAN PENGURUS</strong>
    </td>
  </tr>
  <tr>
    <th>No</th>
    <th>Nama</th>
    <th>Jabatan</th>
  </tr>
  <tr>
    <td>1</td>
    <td>[NAMA_PENGURUS_1]</td>
    <td>[JABATAN_PENGURUS_1]</td>
  </tr>
  <tr>
    <td>2</td>
    <td>[NAMA_PENGURUS_2]</td>
    <td>[JABATAN_PENGURUS_2]</td>
  </tr>
</table>


<table style="width: 100%; border-collapse: collapse;"  border="1">
  <tr >
    <td colspan="2" style="text-align:center"><strong>INFORMASI OBLIGEE</strong></td>
  </tr>
  <tr>
    <td>Obligee</td>
    <td>: [NAMA_OBLIGEE]</td>
  </tr>
  <tr>
    <td>Nama PPK</td>
    <td>: [NAMA_PPK]</td>
  </tr>
  <tr>
    <td>Alamat Obligee</td>
    <td>: [ALAMAT_OBLIGEE]</td>
  </tr>
  <tr>
    <td>Sumber Dana</td>
    <td>: [SUMBER_DANA]</td>
  </tr>
</table>

<table style="width: 100%; border-collapse: collapse;" border="1">
  <tr  style="text-align:center;">
    <td colspan="2"><strong>INFORMASI PENGAJUAN</strong></td>
  </tr>
  <tr>
    <td>Nilai Kontrak</td>
    <td>: [NILAI_KONTRAK]</td>
  </tr>
  <tr>
    <td>Nilai Jaminan</td>
    <td>: [NILAI_JAMINAN]</td>
  </tr>
  <tr>
    <td>Jenis Jaminan</td>
    <td>: [JENIS_JAMINAN]</td>
  </tr>
  <tr>
    <td>Jangka Waktu</td>
    <td>: [JANGKA_WAKTU]</td>
  </tr>
  <tr>
    <td>Nama Pekerjaan</td>
    <td>: [NAMA_PEKERJAAN]</td>
  </tr>
  <tr>
    <td>Lokasi Proyek</td>
    <td>: [LOKASI_PROYEK]</td>
  </tr>
  <tr>
    <td>Underlying</td>
    <td>: [UNDERLYING]</td>
  </tr>
</table>

<table style="width: 100%; margin-top: 10px; margin-bottom: 10px; border-collapse: collapse;"  border="1">
    <tr>
        <td style="width: 5%; text-align:center;"><strong> II </strong></td>
        <td><strong> HASIL EVALUASI DAN VERIFIKASI </strong></td>
    </tr>
</table>


<table style="width: 100%; border-collapse: collapse; text-align: center;" border="1">
  <tr >
    <td colspan="5"><strong>PENGALAMAN KERJA</strong></td>
  </tr>
  <tr>
    <td colspan="5" style="text-align:left"><strong>Berikut Pengalaman Kerja PT......</strong></td>
  </tr>
  <tr>
    <th>No</th>
    <th>Obligee</th>
    <th>Nama Proyek</th>
    <th>Nilai Proyek</th>
    <th>Tahun</th>
  </tr>
  <tr>
    <td>1</td>
    <td>[OBLIGEE]</td>
    <td>[NAMA_PROYEK]</td>
    <td>[NILAI_PROYEK]</td>
    <td>[TAHUN]</td>
  </tr>
</table>

<table style="width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 10px;">
  <tr>
    <td style="border-left: 1px solid black; border-right: 1px solid black; text-align: center;">
      <strong>ANALISA 5C</strong>
    </td>
  </tr>
</table>

<table style="width: 100%; border-collapse: collapse;" border="1">
  <tr>
    <td colspan="2">
        <strong>ANALISA 5C</strong>
    </td>
  </tr>
  <tr>
    <td>Character</td>
    <td>: [ANALISA_CHARACTER]</td>
  </tr>
  <tr>
    <td>Capacity</td>
    <td>: [ANALISA_CAPACITY]</td>
  </tr>
  <tr>
    <td>Capital</td>
    <td>: [ANALISA_CAPITAL]</td>
  </tr>
  <tr>
    <td>Condition</td>
    <td>: [ANALISA_CONDITION]</td>
  </tr>
  <tr>
    <td>Collateral</td>
    <td>: [ANALISA_COLLATERAL]</td>
  </tr>
</table>

<table style="width: 100%; border-collapse: collapse; text-align: left;" border="1">
  <tr>
    <td><strong>Hasil Scoring</strong>: [HASIL_SCORING]</td>
  </tr>
  <tr>
    <td><strong>Keterangan:</strong> <br>
      60 &lt; Hasil Skoring &lt; 100 Dipertimbangkan untuk disetujui <br>
      ≤ 60 Dipertimbangkan untuk ditambahkan mitigasi risiko
    </td>
  </tr>
</table>


<table style="width: 100%; margin-top: 10px; margin-bottom: 10px; border-collapse: collapse;"  border="1">
    <tr>
        <td style="width: 5%; text-align:center;"><strong> III </strong></td>
        <td><strong> REKOMENDASI </strong></td>
    </tr>
</table>
<table style="width: 100%; border-collapse: collapse; text-align: left; margin-top: 10px; margin-bottom: 10px" border="1">
  <tr>
    <td style="width: 80%;">Berdasarkan Pertimbangan Informasi Terjamin, Hasil Evaluasi dan Analisa 5C, maka penjaminan dapat disetujui/ditolak.
    </td>
  </tr>
</table>
<br>

<table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
    <tr>
        <td style="width: 50%;"></td>
        <td style="width: 50%;">
            <table style="width: 100%; border-collapse: collapse;" border="1">
                <tr>
                    <td style="text-align: center;" colspan="2">Jakarta, [TANGGAL]</td>
                </tr>
                <tr>
                    <td style="text-align: center;">
                        <u>.......</u> <br>
                        Analis: [NAMA_ANALIS]
                    </td>
                    <td style="width: 50%;"></td>
                </tr>
                <tr>
                    <td style="text-align: center;">
                        <u>.......</u> <br>
                        Manajer Teknik: [NAMA_MANAJER]
                    </td>
                    <td style="width: 50%;"></td>
                </tr>
            </table>
        </td>
    </tr>
</table>



`,e=`
<h2 style="text-align: center;">JAMINAN PELAKSANAAN (DUMMY)</h2>

<p style="text-align: justify; margin-bottom: 10px;">Nomor Surat   :  40.91.02.AAAAAAA.11.22</p>
<p style="text-align: justify; margin-bottom: 10px;">Nilai Jaminan :  Rp. 34.000.000</p>

<table style="width: 100%; border-collapse: collapse; line-height: 1.5;">
    <tr>
        <td style="width: 30px; vertical-align: top;">1.</td>
        <td style="text-align: justify;">Dengan ini dinyatakan, bahwa kami: PT. MOTI BATARA ALKESINDO (NAMA PRINCIPAL),
        Jl. Agave Raya Blok A1 No. 19A RT. 09 RW. 04 Kedoya Selatan, Kebon Jeruk, Jakarta Barat (ALAMAT PRINCIPAL)
        sebagai Penyedia, selanjutnya disebut TERJAMIN, dan PT. ASURANSI UMUM VIDEI,
        Graha Mustika Ratu, Lantai 1, Jl. Jend. Gatot Subroto Kav. 74-75, Jakarta 12870 sebagai Asuransi,
        selanjutnya disebut sebagai PENJAMIN, bertanggung jawab dan dengan tegas terikat pada Pejabat Penandatangan Kontrak
        Politeknik Kesehatan Jakarta III (NAMA OBLIGEE), Jl. Arteri JORR, Jatiwarna, Kec. Pondok Melati, Bekasi (ALAMAT OBLIGEE)
        sebagai Pemilik Pekerjaan, selanjutnya disebut PENERIMA JAMINAN atas uang sejumlah Rp. 32.077.650,-
        (terbilang: Tiga Puluh Dua Juta Tujuh Puluh Tujuh Ribu Enam Ratus Lima Puluh Rupiah) (BESARAN NILAI JAMINAN).</td>
    </tr>
    <tr>
        <td style="vertical-align: top;">2.</td>
        <td style="text-align: justify;">Maka kami, TERJAMIN dan PENJAMIN dengan ini mengikatkan diri untuk melakukan pembayaran jumlah tersebut di atas
        dengan baik dan benar bilamana TERJAMIN tidak memenuhi kewajiban dalam melaksanakan pelelangan Pekerjaan
        Pengadaan Alat Laboratorium Jurusan Keperawatan Poltekkes Kemenkes Jakarta III (NAMA PEKERJAAN)
        yang telah dipercayakan kepadanya atas dasar Surat Penunjukan Penyedia Barang/Jasa (SPPBJ) (NAMA DOKUMEN)
        Nomor: KN.01.01/V/6747/2019 (NOMOR DOKUMEN) tanggal 30 September 2019 (TANGGAL DOKUMEN).</td>
    </tr>
    <tr>
        <td style="vertical-align: top;">3.</td>
        <td style="text-align: justify;">Surat Jaminan ini berlaku selama 90 (Sembilan Puluh) hari kalender dan efektif mulai dari 01 Oktober 2019
        sampai dengan tanggal 29 Desember 2019 (JANGKA WAKTU).</td>
    </tr>
    <tr>
        <td style="vertical-align: top;">4.</td>
        <td style="text-align: justify;">Jaminan ini berlaku apabila:</td>
    </tr>
    <tr>
        <td style="vertical-align: top;"></td>
        <td>
            <ul style="text-align: justify; line-height: 1.5;">
                <li>TERJAMIN tidak menyelesaikan pekerjaan tersebut pada waktunya dengan baik dan benar sesuai dengan ketentuan dalam Kontrak;</li>
                <li>Pemutusan kontrak akibat kesalahan TERJAMIN.</li>
            </ul>
        </td>
    </tr>
    <tr>
        <td style="vertical-align: top;">5.</td>
        <td style="text-align: justify;">PENJAMIN akan membayar kepada PENERIMA JAMINAN sejumlah nilai jaminan tersebut di atas dalam waktu paling lambat
        14 (empat belas) hari kerja tanpa syarat setelah menerima tuntutan pencairan secara tertulis dari PENERIMA JAMINAN
        berdasar Keputusan PENERIMA JAMINAN mengenai pengenaan sanksi akibat TERJAMIN cidera janji.</td>
    </tr>
    <tr>
        <td style="vertical-align: top;">6.</td>
        <td style="text-align: justify;">Menunjuk pada Pasal 1832 KUH Perdata dengan ini ditegaskan kembali bahwa PENJAMIN melepaskan hak-hak istimewa
        untuk menuntut supaya harta benda TERJAMIN lebih dahulu disita dan dijual guna dapat melunasi hutangnya
        sebagaimana dimaksud dalam Pasal 1831 KUH Perdata.</td>
    </tr>
    <tr>
        <td style="vertical-align: top;">7.</td>
        <td style="text-align: justify;">Tuntutan Pencairan terhadap PENJAMIN berdasarkan Jaminan ini harus sudah diajukan selambat-lambatnya
        dalam waktu 30 (tiga puluh) hari kalender sesudah berakhirnya masa berlaku Jaminan ini.</td>
    </tr>
</table>

<table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
    <tr>
        <td style="text-align: left;">Dikeluarkan di Jakarta pada tanggal 01 Oktober 2019 (TANGGAL PENERBITAN)</td>
        <td></td> <!-- Kolom kosong untuk menjaga keselarasan -->
    </tr>
    <tr>
        <td style="text-align: left;">PT. ASURANSI UMUM VIDEI (TERJAMIN) (PENJAMIN)</td>
        <td style="text-align: right;">PT. MOTI BATARA ALKESINDO (NAMA PRINCIPAL)</td>
    </tr>
    <tr>
        <td style="text-align: left;"><br></td>
        <td></td>
    </tr>
    <tr>
        <td style="text-align: left;">
            Muhammad Ridzqan Hanafis (NAMA PENANGGUNG JAWAB)<br>
            D i r e k t u r (JABATAN PJ)
        </td>
        <td style="text-align: right;">
            Marthen F Surentu<br>
            Kepala Cabang
        </td>
    </tr>
</table>
`,r=`
<div style="font-family: Calibri, sans-serif;">

    <!-- Header Section -->
    <p style="text-align: right;">Jakarta, :[TANGGAL_SURAT]</p>
    <table style="width: 100%; margin-bottom: 20px;">
        <tr>
            <td style="width: 70%; padding: 10px;">
                <p> Nomor	: ………………. </p>
                <p> Lamp. 	: 1 (satu) Bundle </p>
                <p> Perihal	: Permohonan Penjaminan </p>
            </td>
            <td style="width: 30%; text-align: left;">
                <br>
                <p> Kepada Yth, </p>
                <p> PT. ASURANSI UMUM BUMIPUTERA MUDA 1967 </p>
                <p> di. Tempat </p>
            </td>
        </tr>
    </table>


    <!-- Identitas Pemohon Section -->
    <p>Yang Bertanda tangan di bawah ini:</p>
    <table style="width: 100%; table-layout: fixed; border-collapse: collapse; margin-bottom: 20px;">
        <tr>
            <td style="width: 30%; border: 1px solid black;">
                <p>Nama Perusahaan/Prinsipal </p>
            </td>
            <td style="width: 70%; border: 1px solid black;">
                <p>:[NAMA_PERUSAHAAN]</p>
            </td>
        </tr>
        <tr>
            <td style="width: 30%; border: 1px solid black;">
                <p>Alamat</p>
            </td>
            <td style="width: 70%; border: 1px solid black;">
                <p>:[ALAMAT_PERUSAHAAN]</p>
            </td>
        </tr>
        <tr>
            <td style="width: 30%; border: 1px solid black;">
                <p>Nama Penanggung Jawab</p>
            </td>
            <td style="width: 70%; border: 1px solid black;">
                <p>:[PIC]</p>
            </td>
        </tr>
    </table>

    <!-- Data Jaminan Section -->
    <p><strong>&nbsp</strong></p>
    <table style="width: 100%; table-layout: fixed; border-collapse: collapse; margin-bottom: 20px;">
        <tr>
            <td style="width: 30%; border: 1px solid black;">
                <p>Nama Jaminan</p>
            </td>
            <td style="width: 70%; border: 1px solid black;">
                <p>:[NAMA_JAMINAN]</p>
            </td>
        </tr>
        <tr>
            <td style="width: 30%; border: 1px solid black;">
                <p>Nilai Jaminan</p>
            </td>
            <td style="width: 70%; border: 1px solid black;">
                <p>:[NILAI_JAMINAN]</p>
            </td>
        </tr>
        <tr>
            <td style="width: 30%; border: 1px solid black;">
                <p>Jangka Waktu</p>
            </td>
            <td style="width: 70%; border: 1px solid black;">
                <p>:[JANGKA_WAKTU]</p>
            </td>
        </tr>
        <tr>
            <td style="width: 30%; border: 1px solid black;">
                <p>Nama Proyek/Pekerjaan</p>
            </td>
            <td style="width: 70%; border: 1px solid black;">
                <p>:[NAMA_PROYEK]</p>
            </td>
        </tr>
        <tr>
            <td style="width: 30%; border: 1px solid black;">
                <p>Dasar Jaminan</p>
            </td>
            <td style="width: 70%; border: 1px solid black;">
                <p>:[DASAR_JAMINAN]</p>
            </td>
        </tr>
    </table>

    <!-- Data Obligee Section -->
    <p>Atas Kepentingan:</p>
    <table style="width: 100%; table-layout: fixed; border-collapse: collapse; margin-bottom: 20px;">
        <tr>
            <td style="width: 30%; border: 1px solid black;">
                <p>Pemilik Proyek/Obligee</p>
            </td>
            <td style="width: 70%; border: 1px solid black;">
                <p>:[NAMA_OBLIGEE]</p>
            </td>
        </tr>
        <tr>
            <td style="width: 30%; border: 1px solid black;">
                <p>Alamat Pemilik Proyek</p>
            </td>
            <td style="width: 70%; border: 1px solid black;">
                <p>:[ALAMAT_OBLIGEE]</p>
            </td>
        </tr>
    </table>


    <!-- Footer Section -->
    <p>Demikianlah permohonan yang dapat kami sampaikan sekiranya dapat diproses secepatnya, atas perhatian dan kerjasamanya kami ucapkan terimakasih.</p>
    <p style="text-align: left;">
        Hormat Kami,<br>
        <strong>PEMOHON</strong><br><br><br><br>
        <strong><u>NAMA PJ</strong><br>
        <i>Direktur</i>
    </p>

</div>
`;export{a,t as b,r as s,e as t};
