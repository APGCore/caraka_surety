const templateContent = `
<h2 style="text-align: center;">JAMINAN PELAKSANAAN</h2>

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
        <td style="text-align: left;">[NAMA_PRINCIPAL_TTD]</td>
        <td style="text-align: right;">[NAMA_ASURANSI]</td>
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
`;

export default templateContent;
