import logo from "./jastan.jpg";

const suratPermohonan = `
<div style="font-family: Calibri, sans-serif;">

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr>
            <!-- Logo Section -->
            <td style="width: 40%; padding: 10px; text-align: left;">
                <img src="${logo}" alt="Logo" style="width: 10px; height: auto; max-width: 10px;">
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

`;

export default suratPermohonan;
