const suratPermohonan = `
<div style="text-align: center; font-family: Calibri;">
    <h3><strong><u>SURAT PERMOHONAN PENERBITAN SURETY BOND<u></strong></h3>
</div>

<div style="text-align: center; font-family: Calibri;">
    <label>
        <input type="checkbox"> KONSTRUKSI
    </label>
    &nbsp; | &nbsp;
    <label>
        <input type="checkbox"> NON-KONSTRUKSI
    </label>
</div>

<p style="font-family: Calibri;">Yang bertanda tangan di bawah ini (selanjutnya disebut Pemohon) dengan ini mengajukan permintaan Jaminan Surety Bond dengan data-data sebagai berikut:</p>

<!-- DATA PEMOHON / PRINCIPAL -->
<p style="font-family: Calibri;"><strong>A. DATA PEMOHON / PRINCIPAL</strong></p>
<p style="font-family: Calibri;">1. Nama Perusahaan (Principal) : [PRINCIPAL_NAME]</p>
<p style="font-family: Calibri;">2. Alamat Perusahaan : [PRINCIPAL_ADDRESS]</p>
<p style="font-family: Calibri;">3. Nama Direksi Perusahaan : [DIRECTOR_NAME]</p>
<p style="font-family: Calibri;">4. Kontak Person Pengurus : [TELEPHONE]</p>
<p style="font-family: Calibri;">5. Bidang Usaha : [BUSSINESS_FIELD]</p>


<!-- JAMINAN YANG DIMOHON -->
<p style="font-family: Calibri;"><strong>B. JAMINAN YANG DIMOHON</strong></p>
<p style="font-family: Calibri;">1. Jenis Jaminan : [GUARANTEE_TYPE]</p>
<p style="font-family: Calibri;">2. Nilai Penjaminan : [GUARANTEE_VALUE]</p>
<p style="font-family: Calibri;">3. Periode Jaminan : [TIME_PERIOD]</p>
<p style="font-family: Calibri;">4. Tanggal Penerbitan : [GUARANTEE_ISSUE_DATE]</p>


<!-- DATA PROYEK PEKERJAAN -->
<p style="font-family: Calibri;"><strong>C. DATA PROYEK PEKERJAAN</strong></p>
<p style="font-family: Calibri;">1. Nama Pemilik Proyek (Obligee) : [OBLIGEE_NAME]</p>
<p style="font-family: Calibri;">2. Alamat Pemilik Proyek (Obligee) : [OBLIGEE_ADDRESS]</p>
<p style="font-family: Calibri;">3. Nama Proyek Pekerjaan : [PPK_NAME]</p>
<p style="font-family: Calibri;">4. Lokasi Proyek Pekerjaan : [JOB_LOCATION]</p>
<p style="font-family: Calibri;">5. Nilai Proyek / Kontrak : [CONTRACT_VALUE]</p>
<p style="font-family: Calibri;">6. Sesuai dengan Dokumen/Surat : [CONTRACT_DOC_NUMBER]</p>


<!-- PERNYATAAN -->
<p style="font-family: Calibri;">Selanjutnya, dengan ini kami menyatakan:</p>
<ol type="a" style="font-family: Calibri;">
    <li>Bahwa keterangan-keterangan tersebut di atas dibuat dengan sejujur-jujurnya dan sesuai dengan keadaan yang sebenarnya.</li>
    <li>Menyadari bahwa keterangan tersebut digunakan serta merupakan bagian dari Jaminan/Polis Surety Bond yang akan diterbitkan, dan kami bersedia bertanggung jawab penuh apabila terjadi wanprestasi (default) atas proyek kepada PT. Asuransi Umum Videi.</li>
    <li>Mengerti bahwa pertanggungan yang diminta ini baru berlaku setelah mendapat pemberitahuan persetujuan dari Surety (PT. Asuransi Umum Videi) dan kami bersedia membayar jasa penjaminan, biaya administrasi serta biaya meterai langsung kepada PT Asuransi Umum Videi.</li>
</ol>


<!-- TANGGAL DAN TANDA TANGAN -->
<table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-family: Calibri;">
    <tr>
        <td style="text-align: left; vertical-align: top;">
            Jakarta, [TANGGAL_SURAT]
            <br><br><br><br>
            Nama : [DIRECTOR_NAME]<br>
            Jabatan : Direktur
        </td>
        <td style="text-align: right; vertical-align: top;">
            <strong>Diisi oleh PT. Asuransi Umum Videi</strong>
            <br>Disposisi Underwriting:
            <br><br><br><br>
            ( ………………………………………… )
        </td>
    </tr>
</table>
<p style="font-family: Calibri; font-size: small;">*) coret yang tidak perlu</p>
`;

export default suratPermohonan;
