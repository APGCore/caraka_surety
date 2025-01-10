const secondTemplateContent = `
<h2 style="text-align: center;">SURAT PERMOHONAN JAMINAN</h2>

<div style="width: 100%; overflow: hidden;">
    <div style="float: left; width: 50%;">
        <p style="margin-bottom: 10px;">Perihal: Permohonan Jaminan</p>
    </div>
    <div style="float: right; width: 50%; text-align: right;">
        <p style="margin-bottom: 10px;">Jakarta, [DATE_MAIL]</p>
        <p style="margin-bottom: 10px;">Kepada Yth.<br>PT. [BANK_NAME]<br>di Tempat</p>
    </div>
</div>

<p style="text-align: justify; margin-bottom: 10px;">Yang Bertandatangan di bawah ini:</p>
<table style="width: 100%; border-collapse: collapse; line-height: 1.5;">
    <tr>
        <td style="width: 200px; vertical-align: top;">Nama Perusahaan</td>
        <td>: [PRINCIPAL_NAME]</td>
    </tr>
    <tr>
        <td style="vertical-align: top;">Alamat Kantor</td>
        <td>: [PRINCIPAL_ADDRESS]</td>
    </tr>
    <tr>
        <td style="vertical-align: top;">NPWP Perusahaan</td>
        <td>: [NPWP]</td>
    </tr>
    <tr>
        <td style="vertical-align: top;">Nama Penanggung Jawab</td>
        <td>: [DIRECTOR_NAME]</td>
    </tr>
    <tr>
        <td style="vertical-align: top;">Jabatan Penanggung Jawab</td>
        <td>: [DIRECTOR_POSITION]</td>
    </tr>
</table>

<p style="text-align: justify; margin-bottom: 10px;">Dengan ini mengajukan permohonan Kontra Bank Garansi, dengan ketentuan sebagai berikut:</p>
<table style="width: 100%; border-collapse: collapse; line-height: 1.5;">
    <tr>
        <td style="width: 200px; vertical-align: top;">Jenis Jaminan</td>
        <td>: [GUARANTEE_TYPE]</td>
    </tr>
    <tr>
        <td style="vertical-align: top;">Penerbit Bank Garansi</td>
        <td>: [BANK_NAME]</td>
    </tr>
    <tr>
        <td style="vertical-align: top;">Atas Kepentingan</td>
        <td>: [JOB_NAME]</td>
    </tr>
    <tr>
        <td style="vertical-align: top;">Alamat Pemilik Proyek</td>
        <td>: [JOB_LOCATION]</td>
    </tr>
    <tr>
        <td style="vertical-align: top;">Nama Proyek</td>
        <td>: [JOB_NAME]</td>
    </tr>
    <tr>
        <td style="vertical-align: top;">Nilai Jaminan</td>
        <td>: [GUARANTEE_VALUE] </td>
    </tr>
    <tr>
        <td style="vertical-align: top;">Jangka Waktu</td>
        <td>: [TIME_PERIOD] hari kalender, dari [START_DATE] hingga [END_DATE]</td>
    </tr>
    <tr>
        <td style="vertical-align: top;">Dasar Dokumen</td>
        <td>: [CONTRACT_DOC_NAME]</td>
    </tr>
</table>

<p style="text-align: justify;">Demikian permohonan ini kami sampaikan, dan atas perhatiannya kami ucapkan terima kasih.</p>

<div style="width: 100%; overflow: hidden;">
    <table style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="width: 50%;"></td>

            <td style="width: 50%; text-align: left;">
                <p style="margin-bottom: 10px;">[PRINCIPAL_NAME]</p>
                <p style="margin-bottom: 50px;"></p> <!-- Space for signature -->
                <p style="margin-bottom: 10px;">[DIRECTOR_NAME]</p>
                <p style="margin-bottom: 10px;">[DIRECTOR_POSTION]</p>
            </td>
        </tr>
    </table>
</div>



`;

export default secondTemplateContent;
