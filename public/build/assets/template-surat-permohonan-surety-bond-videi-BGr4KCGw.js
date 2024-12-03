import{r as t}from"./app-Djvbadb0.js";const m="/build/assets/jastan-BYYHO1xn.jpg",y=a=>{const[n,r]=t.useState(()=>a),[o,l]=t.useState(()=>a[0].name),s=t.useCallback(e=>{const A=n.findIndex(i=>i.name===e),b=n.map((i,g)=>({...i,isActive:g<=A}));r(b)},[]),p=t.useCallback(e=>{l(e),s(e),window.scrollTo({top:0,behavior:"smooth"})},[s]),d=t.useCallback(()=>{r(a),l(a[0].name)},[a]);return{currentStep:o,steps:n,gotoStep:p,resetSteps:d}},u=a=>new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR"}).format(Number(a)),P=`
<h2 style="text-align: center;">SURAT PERMOHONAN JAMINAN</h2>

<div style="width: 100%; overflow: hidden;">
    <div style="float: left; width: 50%;">
        <p style="margin-bottom: 10px;">Perihal: Permohonan Jaminan</p>
    </div>
    <div style="float: right; width: 50%; text-align: right;">
        <p style="margin-bottom: 10px;">Jakarta, [TANGGAL_PENERBITAN_PERMOHONAN]</p>
        <p style="margin-bottom: 10px;">Kepada Yth.<br>PT. [NAMA_BANK]<br>di Tempat</p>
    </div>
</div>

<p style="text-align: justify; margin-bottom: 10px;">Yang Bertandatangan di bawah ini:</p>
<table style="width: 100%; border-collapse: collapse; line-height: 1.5;">
    <tr>
        <td style="width: 200px; vertical-align: top;">Nama Perusahaan</td>
        <td>: [NAMA_PRINCIPAL]</td>
    </tr>
    <tr>
        <td style="vertical-align: top;">Alamat Kantor</td>
        <td>: [ALAMAT_PRINCIPAL]</td>
    </tr>
    <tr>
        <td style="vertical-align: top;">NPWP Perusahaan</td>
        <td>: [NPWP]</td>
    </tr>
    <tr>
        <td style="vertical-align: top;">Nama Penanggung Jawab</td>
        <td>: [NAMA_PENANGGUNG_JAWAB]</td>
    </tr>
    <tr>
        <td style="vertical-align: top;">Jabatan Penanggung Jawab</td>
        <td>: [JABATAN_PENANGGUNG_JAWAB]</td>
    </tr>
</table>

<p style="text-align: justify; margin-bottom: 10px;">Dengan ini mengajukan permohonan Kontra Bank Garansi, dengan ketentuan sebagai berikut:</p>
<table style="width: 100%; border-collapse: collapse; line-height: 1.5;">
    <tr>
        <td style="width: 200px; vertical-align: top;">Jenis Jaminan</td>
        <td>: [JENIS_JAMINAN]</td>
    </tr>
    <tr>
        <td style="vertical-align: top;">Penerbit Bank Garansi</td>
        <td>: [PENERBIT_BANK_GARANSI]</td>
    </tr>
    <tr>
        <td style="vertical-align: top;">Atas Kepentingan</td>
        <td>: [PROYEK]</td>
    </tr>
    <tr>
        <td style="vertical-align: top;">Alamat Pemilik Proyek</td>
        <td>: [ALAMAT_PEMILIK_PROYEK]</td>
    </tr>
    <tr>
        <td style="vertical-align: top;">Nama Proyek</td>
        <td>: [NAMA_PEKERJAAN]</td>
    </tr>
    <tr>
        <td style="vertical-align: top;">Nilai Jaminan</td>
        <td>: [NILAI_JAMINAN] </td>
    </tr>
    <tr>
        <td style="vertical-align: top;">Jangka Waktu</td>
        <td>: [TIME_PERIOD] hari kalender, dari [START_DATE] hingga [END_DATE]</td>
    </tr>
    <tr>
        <td style="vertical-align: top;">Dasar Dokumen</td>
        <td>: [DASAR_DOKUMEN]</td>
    </tr>
</table>

<p style="text-align: justify;">Demikian permohonan ini kami sampaikan, dan atas perhatiannya kami ucapkan terima kasih.</p>

<div style="width: 100%; overflow: hidden;">
    <table style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="width: 50%;"></td>

            <td style="width: 50%; text-align: left;">
                <p style="margin-bottom: 10px;">[NAMA_PRINCIPAL_TTD]</p>
                <p style="margin-bottom: 50px;"></p> <!-- Space for signature -->
                <p style="margin-bottom: 10px;">[NAMA_PENANGGUNG_JAWAB_TTD]</p>
                <p style="margin-bottom: 10px;">[JABATAN_PENANGGUNG_JAWAB]</p>
            </td>
        </tr>
    </table>
</div>



`,k=`
<div style="font-family: Calibri, sans-serif;">

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr>
            <!-- Logo Section -->
            <td style="width: 40%; padding: 10px; text-align: left;">
                <img src="${m}" alt="Logo" style="width: 10px; height: auto; max-width: 10px;">
            </td>

            <!-- Title Section -->
            <td style="width: 60%; padding: 10px; text-align: center;">
                <strong><u>FORMULIR PERMOHONAN SURETY BOND</u></strong>
                <div style="text-align: center; margin-bottom: 30px;">
                    <strong>PT. ASURANSI JASA TANIA, Tbk</strong><br>
                    Wisma Jasa Tania  Jl. Teuku Cik Ditiro No.14 Jakarta Pusat 10350<br>
                    Telp. (021) 3101850 (Hunting) Fax. (021) 31923089,31937617
                </div>
            </td>
        </tr>
    </table>



   <table style="width: 100%; border: 1px solid black; border-collapse: collapse; margin-bottom: 20px; font-family: Calibri, sans-serif;">
        <tr>
            <td style="padding: 10px; text-align: center;">
                <h3>
                    <strong>FORMULIR PERMOHONAN SURETY BOND</strong>
                </h3>
                <h3>
                    <strong>PT. ASURANSI JASA TANIA, TBK</strong>
                </h3>
            </td>
        </tr>
    </table>

    <!-- Pemohon Jaminan Section -->
    <p><strong>A. PEMOHON JAMINAN (PRINCIPAL)</strong></p>
    <table style="width: 100%; border: 1px solid black; border-collapse: collapse; margin-bottom: 20px; font-family: Calibri, sans-serif;">
        <tr>
            <td style="padding: 10px;">
                <p>1. Perusahaan/Badan Hukum : [PERUSAHAAN/BADAN_HUKUM]</p>
                <p>2. Alamat Lengkap : [ALAMAT_LENGKAP]</p>
                <p>3. Nomor Telepon & Fax : [NOMOR_TELEPON_FAX]</p>
                <p>4. Pejabat yang berurusan : [PEJABAT_YANG_BERURUSAN]</p>
            </td>
        </tr>
    </table>

    <!-- Penerima Jaminan Section -->
    <p><strong>B. PENERIMA JAMINAN (OBLIGEE)</strong></p>
    <table style="width: 100%; border: 1px solid black; border-collapse: collapse; margin-bottom: 20px; font-family: Calibri, sans-serif;">
        <tr>
            <td style="padding: 10px;">
                <p>1. Pemilik Proyek (Obligee) : [NAMA_OBLIGEE]</p>
                <p>2. Alamat Lengkap : [ALAMAT_OBLIGEE]</p>
            </td>
        </tr>
    </table>

    <!-- Data Jaminan Section -->
    <p><strong>C. DATA JAMINAN YANG DIMOHON</strong></p>
    <table style="width: 100%; border: 1px solid black; border-collapse: collapse; margin-bottom: 20px; font-family: Calibri, sans-serif;">
        <tr>
            <td style="padding: 10px;">
                <p>1. Jenis Jaminan : [JENIS_JAMINAN]</p>
                <p>2. Nilai Jaminan : [NILAI_JAMINAN]</p>
                <p>3. Jangka Waktu Jaminan : [START_DATE] s/d [END_DATE]</p>
                <p>4. Nama Proyek / Pekerjaan : [NAMA_PROYEK]</p>
                <p>5. Jenis Proyek / Pekerjaan : [JENIS_PROYEK]</p>
                <p>6. Nilai Proyek / Kontrak : [NILAI_PROYEK]</p>
                <p>7. Lokasi Proyek : [LOKASI_PROYEK]</p>
                <p>8. Sumber Dana : [SUMBER_DANA]</p>
                <p>9. Dokumen Pendukung : [DOKUMEN_PENDUKUNG]</p>
            </td>
        </tr>
    </table>

    <br>

    <!-- Declaration Section -->
   <table style="width: 100%; border: 1px solid black; border-collapse: collapse; margin-bottom: 20px; font-family: Calibri, sans-serif;">
        <tr>
            <td style="padding: 10px;">
                <p style="text-align: center; font-weight: bold;">PERNYATAAN UNTUK MEMBAYAR GANTI RUGI</p>
                <p style="text-align: justify;">
                    Yang bertandatangan di bawah ini menyatakan bahwa memiliki kewenangan bertindak untuk dan atas nama
                    Perusahaan / Badan Hukum yang dalam pernyataan ini disebut sebagai <strong>PRINCIPAL</strong>, sesuai dengan Jabatan
                    atau Kuasa yang diberikan kepadanya, memiliki kewenangan untuk mengajukan permohonan penerbitan jaminan dalam bentuk
                    Surety Bond kepada <strong>PT. Asuransi Jasa Tania, Tbk</strong> (selanjutnya disebut sebagai <strong>SURETY</strong>). Penerbitan
                    Jaminan (selanjutnya disebut sebagai <strong>Bond</strong>) tersebut adalah untuk memberikan jaminan terhadap dan berdasarkan suatu
                    kesepakatan/perjanjian/kontrak antara PRINCIPAL dengan pihak lainnya yang disebut sebagai <strong>OBLIGEE</strong>.
                </p>
                <p>
                [NAMA_KOTA], [TANGGAL_SURAT]<br>
                <strong>PRINCIPAL / PEMOHON</strong><br><br><br><br>
                [NAMA_PRINCIPAL_TTD]
                </p>
            </td>
        </tr>
    </table>




    <p style="font-size: small;">*) coret yang tidak perlu</p>

</div>

`,c=`
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
<p style="font-family: Calibri;">1. Nama Perusahaan (Principal) : [NAMA_PRINCIPAL]</p>
<p style="font-family: Calibri;">2. Alamat Perusahaan : [ALAMAT_PRINCIPAL]</p>
<p style="font-family: Calibri;">3. Nama Direksi Perusahaan : [NAMA_DIREKSI]</p>
<p style="font-family: Calibri;">4. Kontak Person Pengurus : [KONTAK_PERSON]</p>
<p style="font-family: Calibri;">5. Bidang Usaha : [BIDANG_USAHA]</p>


<!-- JAMINAN YANG DIMOHON -->
<p style="font-family: Calibri;"><strong>B. JAMINAN YANG DIMOHON</strong></p>
<p style="font-family: Calibri;">1. Jenis Jaminan : [JENIS_JAMINAN]</p>
<p style="font-family: Calibri;">2. Nilai Penjaminan : [NILAI_PENJAMINAN]</p>
<p style="font-family: Calibri;">3. Periode Jaminan : [PERIODE_JAMINAN] hari</p>
<p style="font-family: Calibri;">4. Tanggal Penerbitan : [TANGGAL_PENERBITAN]</p>


<!-- DATA PROYEK PEKERJAAN -->
<p style="font-family: Calibri;"><strong>C. DATA PROYEK PEKERJAAN</strong></p>
<p style="font-family: Calibri;">1. Nama Pemilik Proyek (Obligee) : [NAMA_OBLIGEE]</p>
<p style="font-family: Calibri;">2. Alamat Pemilik Proyek (Obligee) : [ALAMAT_OBLIGEE]</p>
<p style="font-family: Calibri;">3. Nama Proyek Pekerjaan : [NAMA_PROYEK]</p>
<p style="font-family: Calibri;">4. Lokasi Proyek Pekerjaan : [LOKASI_PROYEK]</p>
<p style="font-family: Calibri;">5. Nilai Proyek / Kontrak : [NILAI_PROYEK]</p>
<p style="font-family: Calibri;">6. Sesuai dengan Dokumen/Surat : [DOKUMEN_SURAT]</p>


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
            Nama : [NAMA_DIREKTUR]<br>
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
`;export{k as a,c as b,u as f,P as s,y as u};
