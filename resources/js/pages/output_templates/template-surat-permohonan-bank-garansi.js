const secondTemplateContent = `
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



`;

export default secondTemplateContent;
