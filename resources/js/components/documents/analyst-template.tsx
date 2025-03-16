import React from "react";

// Define the interface for props
interface AnalystTemplateProps {
    analysisNumber: string;
    companyName: string;
    companyAddress: string;
    analysisResult: string;
    performanceNote: string;
    financialCondition: string;
    netProfit: string;
    financialYear: string;
    projectExperience: string;
    contractValue: string;
    legalStatus: string;
    issueDate: string;
    reportAuthor: string;
    analystName: string;
    analystPosition: string;
    directorName: string;
}

// Create the component
const AnalystTemplate: React.FC<AnalystTemplateProps> = ({
    analysisNumber,
    companyName,
    companyAddress,
    analysisResult,
    performanceNote,
    financialCondition,
    netProfit,
    financialYear,
    projectExperience,
    contractValue,
    legalStatus,
    issueDate,
    reportAuthor,
    analystName,
    analystPosition,
    directorName,
}) => {
    return (
        <div>
            <h2 style={{ textAlign: "center" }}>HASIL ANALISA PERUSAHAAN</h2>
            <p style={{ textAlign: "justify", marginBottom: "10px" }}>Nomor Analisa: {analysisNumber}</p>
            <p style={{ textAlign: "justify", marginBottom: "10px" }}>Nama Perusahaan: {companyName}</p>
            <p style={{ textAlign: "justify", marginBottom: "10px" }}>Alamat Perusahaan: {companyAddress}</p>

            <table style={{ width: "100%", borderCollapse: "collapse", lineHeight: "1.5" }}>
                <tbody>
                    <tr>
                        <td style={{ width: "30px", verticalAlign: "top" }}>1.</td>
                        <td style={{ textAlign: "justify" }}>
                            Berdasarkan hasil analisa terhadap dokumen dan kinerja perusahaan, {companyName} dinyatakan{" "}
                            {analysisResult}. {performanceNote}
                        </td>
                    </tr>
                    <tr>
                        <td style={{ verticalAlign: "top" }}>2.</td>
                        <td style={{ textAlign: "justify" }}>
                            Perusahaan memiliki kondisi keuangan {financialCondition}. Laporan keuangan menunjukkan laba
                            bersih sebesar {netProfit} pada tahun terakhir {financialYear}.
                        </td>
                    </tr>
                    <tr>
                        <td style={{ verticalAlign: "top" }}>3.</td>
                        <td style={{ textAlign: "justify" }}>
                            {companyName} juga memiliki pengalaman {projectExperience}, termasuk proyek dengan nilai
                            kontrak {contractValue}.
                        </td>
                    </tr>
                    <tr>
                        <td style={{ verticalAlign: "top" }}>4.</td>
                        <td style={{ textAlign: "justify" }}>{legalStatus}</td>
                    </tr>
                </tbody>
            </table>

            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
                <tbody>
                    <tr>
                        <td style={{ textAlign: "left" }}>Dikeluarkan di Jakarta pada tanggal {issueDate}</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td style={{ textAlign: "left" }}>{reportAuthor}</td>
                        <td style={{ textAlign: "right" }}>{companyName}</td>
                    </tr>
                    <tr>
                        <td style={{ textAlign: "left" }}>
                            {analystName}
                            <br />
                            {analystPosition}
                        </td>
                        <td style={{ textAlign: "right" }}>
                            {directorName}
                            <br />
                            Direktur Utama
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default AnalystTemplate;
