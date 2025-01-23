const templateUangMuka = `
<h2 style="text-align: center;">JAMINAN UANG MUKA</h2>

<p style="text-align: justify; margin-bottom: 10px;">Bond No. : [GUARANTEE_NUMBER]</p>
<p style="text-align: justify; margin-bottom: 10px;">Nilai : [GUARANTEE_VALUE]</p>

<table style="width: 100%; border-collapse: collapse; line-height: 1.5;">
    <tr>
        <td style="width: 30px; vertical-align: top;">1.</td>
        <td style="text-align: justify;">Dengan ini dinyatakan, bahwa kami : [PRINCIPAL_NAME], sebagai Penyedia, selanjutnya disebut TERJAMIN, dan [GUARANTOR_NAME], [GUARANTOR_LOCATION] sebagai Penjamin, selanjutnya disebut PENJAMIN, bertanggung jawab dan dengan tegas terikat pada [OBLIGEE_NAME] sebagai Pemilik Pekerjaan, selanjutnya disebut PENERIMA JAMINAN atas uang sejumlah [GUARANTEE_VALUE].</td>
    </tr>
    <tr>
        <td style="vertical-align: top;">2.</td>
        <td style="text-align: justify;">Maka kami, TERJAMIN dan PENJAMIN dengan ini mengikatkan diri untuk melakukan pembayaran jumlah tersebut di atas dengan baik dan benar bilamana TERJAMIN tidak memenuhi kewajiban dalam melaksanakan pekerjaan [JOB_NAME] yang telah dipercayakan kepadanya atas dasar Surat Perjanjian (Kontrak) No. [CONTRACT_DOC_NUMBER] tanggal [CONTRACT_DOC_DATE] dari PENERIMA JAMINAN.</td>
    </tr>
    <tr>
        <td style="vertical-align: top;">3.</td>
        <td style="text-align: justify;">Surat Jaminan ini berlaku selama [TIME_PERIOD] hari kalender dan efektif mulai dari tanggal [START_DATE] sampai dengan tanggal [END_DATE].</td>
    </tr>
    <tr>
        <td style="vertical-align: top;">4.</td>
        <td style="text-align: justify;">Surat Jaminan ini berlaku apabila TERJAMIN tidak memenuhi kewajibannya melakukan pembayaran kembali kepada PENERIMA JAMINAN senilai uang muka yang wajib dibayar menurut Dokumen Kontrak.</td>
    </tr>
    <tr>
        <td style="vertical-align: top;">5.</td>
        <td style="text-align: justify;">PENJAMIN akan membayar kepada PENERIMA JAMINAN sejumlah nilai jaminan tersebut di atas atau sisa Uang Muka yang belum dikembalikan TERJAMIN dalam waktu paling lambat 14 (empat belas) hari kerja tanpa syarat setelah menerima tuntutan pencairan secara tertulis dari PENERIMA JAMINAN berdasar Keputusan PENERIMA JAMINAN mengenai pengenaan sanksi akibat TERJAMIN cidera janji.</td>
    </tr>
    <tr>
        <td style="vertical-align: top;">6.</td>
        <td style="text-align: justify;">Menunjuk pada Pasal 1832 KUH Perdata dengan ini ditegaskan kembali bahwa PENJAMIN melepaskan hak-hak istimewa untuk menuntut supaya harta benda TERJAMIN lebih dahulu disita dan dijual guna dapat melunasi hutangnya sebagaimana dimaksud dalam Pasal 1831 KUH Perdata.</td>
    </tr>
    <tr>
        <td style="vertical-align: top;">7.</td>
        <td style="text-align: justify;">Tuntutan pencairan terhadap PENJAMIN berdasarkan Jaminan ini harus sudah diajukan selambat-lambatnya dalam waktu 30 (tiga puluh) hari kalender sesudah berakhirnya masa berlaku Jaminan ini.</td>
    </tr>
</table>

<table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
    <tr>
        <td style="text-align: left;">Dikeluarkan di [LOCATION]</td>
        <td></td> <!-- Kolom kosong untuk menjaga keselarasan -->
    </tr>
    <tr>
        <td style="text-align: left;">Pada tanggal [GUARANTEE_ISSUE_DATE]</td>
        <td></td>
    </tr>
    <tr>
        <td style="text-align: left;">[PRINCIPAL_NAME]</td>
        <td style="text-align: right;">[GUARANTOR_NAME]</td>
    </tr>
    <tr>
        <td style="text-align: left;"><br></td>
        <td></td>
    </tr>
    <tr>
        <td style="text-align: left;">
            [DIRECTOR_NAME]<br>
            Direktur
        </td>
        <td style="text-align: right;">
            [MANAGER_NAME]<br>
            Kepala Cabang
        </td>
    </tr>
</table>
`;

export default templateUangMuka;
