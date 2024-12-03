const templateDraftSurety = `
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
`;

export default templateDraftSurety;
