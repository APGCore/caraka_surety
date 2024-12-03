import logo from "./jastan.jpg";

const suratPermohonan = `
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
`;

export default suratPermohonan;
