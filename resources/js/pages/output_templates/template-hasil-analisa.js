const templateAnalyst = `
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



`;

export default templateAnalyst;
