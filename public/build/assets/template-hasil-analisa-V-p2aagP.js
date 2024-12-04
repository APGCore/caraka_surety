const t=`
<h2 style="text-align: center;">SURETY BOND</h2>

<p style="text-align: justify; margin-bottom: 10px;">Nomor Surety Bond   : [NOMOR_SURETY_BOND]</p>
<p style="text-align: justify; margin-bottom: 10px;">Nilai Jaminan :  [NILAI_JAMINAN]</p>

<table style="width: 100%; border-collapse: collapse; line-height: 1.5;">
    <tr>
        <td style="width: 30px; vertical-align: top;">1.</td>
        <td style="text-align: justify;">Kami yang bertanda tangan di bawah ini: [NAMA_PENJAMIN], berkantor di [ALAMAT_PENJAMIN], selanjutnya disebut sebagai PENJAMIN, menyatakan dengan ini menjamin kewajiban [NAMA_PRINCIPAL2], berkantor di Jl. Agave Raya Blok A1 No. 19A, Jakarta Barat [ALAMAT_PRINCIPAL], selanjutnya disebut sebagai PRINCIPAL, terhadap [NAMA_OBLIGEE], berkantor di [ALAMAT_OBLIGEE], yang selanjutnya disebut sebagai OBLIGEE.</td>
    </tr>
    <tr>
        <td style="vertical-align: top;">2.</td>
        <td style="text-align: justify;">PENJAMIN bertanggung jawab untuk membayar kepada OBLIGEE sejumlah [BESARAN_NILAI_JAMINAN] dalam hal PRINCIPAL gagal memenuhi kewajibannya dalam menyelesaikan Pekerjaan Pengadaan Alat Laboratorium Politeknik Kesehatan Jakarta III [NAMA_PEKERJAAN] sesuai dengan ketentuan dalam kontrak Nomor KN.01.01/V/6747/2019 [NOMOR_KONTRAK] tanggal 30 September 2019 [TANGGAL_KONTRAK].</td>
    </tr>
    <tr>
        <td style="vertical-align: top;">3.</td>
        <td style="text-align: justify;">Jaminan ini berlaku efektif sejak tanggal [START_DATE] dan berakhir pada [END_DATE], atau sampai dengan berakhirnya masa pemeliharaan yang telah disepakati dalam kontrak, mana yang lebih lama.</td>
    </tr>
    <tr>
        <td style="vertical-align: top;">4.</td>
        <td style="text-align: justify;">Jaminan ini akan berlaku apabila PRINCIPAL gagal melaksanakan kewajiban sebagaimana ditentukan dalam kontrak, termasuk tetapi tidak terbatas pada keterlambatan penyelesaian pekerjaan atau pemutusan kontrak karena kelalaian PRINCIPAL.</td>
    </tr>
    <tr>
        <td style="vertical-align: top;">5.</td>
        <td style="text-align: justify;">PENJAMIN akan membayar kepada OBLIGEE tanpa syarat dalam jangka waktu paling lambat [TIME_PERIOD] hari kerja setelah menerima tuntutan tertulis dari OBLIGEE berdasarkan pernyataan bahwa PRINCIPAL gagal memenuhi kewajiban.</td>
    </tr>
    <tr>
        <td style="vertical-align: top;">6.</td>
        <td style="text-align: justify;">Tuntutan pencairan jaminan ini harus diajukan oleh OBLIGEE selambat-lambatnya 30 (tiga puluh) hari setelah berakhirnya masa berlaku jaminan ini.</td>
    </tr>
</table>

<table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
    <tr>
        <td style="text-align: left;">Dikeluarkan di Jakarta pada tanggal [TANGGAL_PENERBITAN]</td>
        <td></td> <!-- Kolom kosong untuk menjaga keselarasan -->
    </tr>
    <tr>
        <td style="text-align: left;">[NAMA_PENJAMIN_TTD]</td>
        <td style="text-align: right;">[NAMA_PRINCIPAL_TTD]</td>
    </tr>
    <tr>
        <td style="text-align: left;"><br></td>
        <td></td>
    </tr>
    <tr>
        <td style="text-align: left;">
            [NAMA_PENANGGUNG_JAWAB_PENJAMIN]<br>
            [JABATAN_PENJAMIN]
        </td>
        <td style="text-align: right;">
            [NAMA_KEPALA_CABANG]<br>
            Kepala Cabang
        </td>
    </tr>
</table>
`,a=`
<h2 style="text-align: center;">JAMINAN PELAKSANAAN (DUMMY)</h2>

<p style="text-align: justify; margin-bottom: 10px;">Nomor Surat   :  40.91.02.AAAAAAA.11.22</p>
<p style="text-align: justify; margin-bottom: 10px;">Nilai Jaminan :  [NILAI_JAMINAN]</p>

<table style="width: 100%; border-collapse: collapse; line-height: 1.5;">
    <tr>
        <td style="width: 30px; vertical-align: top;">1.</td>
        <td style="text-align: justify;">Dengan ini dinyatakan, bahwa kami: [NAMA_PRINCIPAL], [ALAMAT_PRINCIPAL]
        sebagai Penyedia, selanjutnya disebut TERJAMIN, dan PT. ASURANSI UMUM VIDEI,
        Graha Mustika Ratu, Lantai 1, Jl. Jend. Gatot Subroto Kav. 74-75, Jakarta 12870 sebagai Asuransi,
        selanjutnya disebut sebagai PENJAMIN, bertanggung jawab dan dengan tegas terikat pada Pejabat Penandatangan Kontrak
        Politeknik Kesehatan Jakarta III [NAMA_OBLIGEE], [ALAMAT_OBLIGEE]
        sebagai Pemilik Pekerjaan, selanjutnya disebut PENERIMA JAMINAN atas uang sejumlah [BESARAN_NILAI_JAMINAN].</td>
    </tr>
    <tr>
        <td style="vertical-align: top;">2.</td>
        <td style="text-align: justify;">Maka kami, TERJAMIN dan PENJAMIN dengan ini mengikatkan diri untuk melakukan pembayaran jumlah tersebut di atas
        dengan baik dan benar bilamana TERJAMIN tidak memenuhi kewajiban dalam melaksanakan pelelangan Pekerjaan
        [NAMA_PEKERJAAN] yang telah dipercayakan kepadanya atas dasar  [NAMA_DOKUMEN]
        Nomor: [NOMOR_DOKUMEN] tanggal [TANGGAL_DOKUMEN].</td>
    </tr>
    <tr>
        <td style="vertical-align: top;">3.</td>
        <td style="text-align: justify;">Surat Jaminan ini berlaku selama [JANGKA_WAKTU] hari kalender dan efektif mulai dari [START_DATE]
        sampai dengan tanggal [END_DATE].</td>
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
        <td style="text-align: left;">Dikeluarkan di Jakarta pada tanggal 01 Oktober 2019 [TANGGAL_PENERBITAN]</td>
        <td></td> <!-- Kolom kosong untuk menjaga keselarasan -->
    </tr>
    <tr>
        <td style="text-align: left;">[NAMA_ASURANSI]</td>
        <td style="text-align: right;">[NAMA_PRINCIPAL_TTD]</td>
    </tr>
    <tr>
        <td style="text-align: left;"><br></td>
        <td></td>
    </tr>
    <tr>
        <td style="text-align: left;">
            [NAMA_DIREKTUR]<br>
            D i r e k t u r [JABATAN]
        </td>
        <td style="text-align: right;">
            [NAMA_KEPALA_CABANG_TTD]<br>
            Kepala Cabang
        </td>
    </tr>
</table>
`,e=`
<div style="font-family: Calibri, sans-serif;">

    <!-- Header Section -->
    <p style="text-align: right;">Jakarta, [TANGGAL_SURAT]</p>
    <table style="width: 100%; margin-bottom: 20px;">
        <tr>
            <td style="width: 70%; padding: 10px;">
                <p> Nomor	: [NOMOR_SURAT] </p>
                <p> Lamp. 	: 1 (satu) Bundle </p>
                <p> Perihal	: Permohonan Penjaminan </p>
            </td>
            <td style="width: 30%; text-align: left;">
                <br>
                <p> Kepada Yth, </p>
                <p> [NAMA_PENJAMIN] </p>
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
                <p>:[JANGKA_WAKTU] hari</p>
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
        <strong><u>[NAMA_PENANGGUNG_JAWAB]</strong><br>
        <i>Direktur</i>
    </p>

</div>
`,r=`
<table style="width: 100%; text-align: center; border-collapse: collapse;" border="1">
    <tr>
        <td colspan="2">
            <strong>RESUME ANALISA PENJAMINAN</strong><br>
            <strong>SURETY BOND</strong><br>
            [NAMA_JAMINAN]<br>
            [NAMA_PRINCIPAL]<br>
            Nomor : [NOMOR_SURAT]
        </td>
    </tr>
     <tr style="width: 100%;">
        <td style="width: 50%;">Hari, Tanggal Pengajuan</td>
        <td style="width: 50%;">[TGL_PENGAJUAN]</td>
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
  <tr>
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

<!-- Tabel SUSUNAN PENGURUS dengan 3 kolom -->
<table style="width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 10px;" border="1">
  <tr>
    <td colspan="3" style="text-align: center"><strong>SUSUNAN PENGURUS</strong></td>
  </tr>
  <tr>
    <th>No</th>
    <th>Nama</th>
    <th>Jabatan</th>
  </tr>
  <tr>
    <td style="text-align: center; vertical-align: middle;">1</td>
    <td>[NAMA_PENGURUS_1]</td>
    <td>[JABATAN_PENGURUS_1]</td>
  </tr>
  <tr>
    <td style="text-align: center; vertical-align: middle;">2</td>
    <td>[NAMA_PENGURUS_2]</td>
    <td>[JABATAN_PENGURUS_2]</td>
  </tr>
</table>



<table style="width: 100%; border-collapse: collapse;" border="1">
  <colgroup>
    <col style="width: 30%;">
    <col style="width: 35%;">
    <col style="width: 35%;">
  </colgroup>

  <!-- INFORMASI OBLIGEE -->
  <tr>
    <td colspan="3" style="border-left: 1px solid black; border-right: 1px solid black; text-align: center;">
      <strong>INFORMASI OBLIGEE</strong>
    </td>
  </tr>
  <tr>
    <td>Obligee</td>
    <td colspan="2">: [NAMA_OBLIGEE]</td>
  </tr>
  <tr>
    <td>Nama PPK</td>
    <td colspan="2">: [NAMA_PPK]</td>
  </tr>
  <tr>
    <td>Alamat Obligee</td>
    <td colspan="2">: [ALAMAT_OBLIGEE]</td>
  </tr>
  <tr>
    <td>Sumber Dana</td>
    <td colspan="2">: [SUMBER_DANA]</td>
  </tr>

  <!-- INFORMASI PENGAJUAN -->
  <tr>
    <td colspan="3" style="border-left: 1px solid black; border-right: 1px solid black; text-align: center;">
      <strong>INFORMASI PENGAJUAN</strong>
    </td>
  </tr>
  <tr>
    <td>Nilai Kontrak</td>
    <td colspan="2">: [NILAI_KONTRAK]</td>
  </tr>
  <tr>
    <td>Nilai Jaminan</td>
    <td colspan="2">: [NILAI_JAMINAN]</td>
  </tr>
  <tr>
    <td>Jenis Jaminan</td>
    <td colspan="2">: [JENIS_JAMINAN]</td>
  </tr>
  <tr>
    <td>Jangka Waktu</td>
    <td colspan="2">: [JANGKA_WAKTU]</td>
  </tr>
  <tr>
    <td>Nama Pekerjaan</td>
    <td colspan="2">: [NAMA_PEKERJAAN]</td>
  </tr>
  <tr>
    <td>Lokasi Proyek</td>
    <td colspan="2">: [LOKASI_PROYEK]</td>
  </tr>
  <tr>
    <td>Dasar Dokumen</td>
    <td colspan="2">: [UNDERLYING]</td>
  </tr>
</table>


<br>
<table style="width: 100%; border-collapse: collapse;"  border="1">
    <tr>
        <td style="width: 5%; text-align:center;"><strong> II </strong></td>
        <td><strong> HASIL EVALUASI DAN VERIFIKASI</strong></td>
    </tr>
</table>


<table style="width: 100%; border-collapse: collapse; text-align: center;" border="1">
  <tr >
    <td colspan="5" style="border-left: 1px solid black; border-right: 1px solid black; text-align: center;"><strong>PENGALAMAN KERJA</strong></td>
  </tr>
  <tr>
    <td colspan="5" style="text-align:left"><strong>Berikut Pengalaman Kerja PT [NAMA_PRINCIPAL2]</strong></td>
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
      ≤ 60 Dipertimbangkan untuk ditambahkan mitigasi risiko [KETERANGAN]
    </td>
  </tr>
</table>

<br>
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



`;export{r as a,t as b,e as s,a as t};
