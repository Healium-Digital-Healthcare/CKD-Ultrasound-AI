import type { Report } from "@/types/case"

export function generateHealiumReportHTML(report: Report): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Healium Intelliscan - Kidney Health Report</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Source+Serif+4:wght@400;600&display=swap" rel="stylesheet">
  ${getHealiumStyles()}
</head>
<body>
  ${generatePage1(report)}
  ${generatePage2(report)}
  ${generatePage3(report)}
  ${generatePage4(report)}
</body>
</html>`
}

function getHealiumStyles(): string {
  return `<style>
    :root {
      --primary: #0891B2;
      --primary-dark: #0E7490;
      --primary-light: #E0F7FA;
      --primary-pale: #F0FDFA;
      --accent: #0D9488;
      --warning: #F59E0B;
      --warning-light: #FEF3C7;
      --danger: #EF4444;
      --danger-light: #FEE2E2;
      --success: #10B981;
      --success-light: #D1FAE5;
      --gray-50: #F9FAFB;
      --gray-100: #F3F4F6;
      --gray-200: #E5E7EB;
      --gray-300: #D1D5DB;
      --gray-400: #9CA3AF;
      --gray-500: #6B7280;
      --gray-600: #4B5563;
      --gray-700: #374151;
      --gray-800: #1F2937;
      --gray-900: #111827;
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    @page { size: A4; margin: 0; }

    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 9pt;
      line-height: 1.5;
      color: var(--gray-800);
      background: #fff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .page {
      width: 210mm;
      min-height: 297mm;
      padding: 12mm 15mm;
      margin: 0 auto;
      background: white;
      position: relative;
      display: flex;
      flex-direction: column;
      break-inside: avoid;
    }

    .page:not(:last-child) {
      page-break-after: always;
      break-after: page;
    }

    .page:last-child { 
      page-break-after: avoid; 
      break-after: avoid;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding-bottom: 10px;
      border-bottom: 2px solid var(--primary);
      margin-bottom: 15px;
    }

    .logo-section { display: flex; align-items: center; gap: 10px; }

    .logo-icon {
      width: 42px;
      height: 42px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .logo-text { display: flex; flex-direction: column; }

    .logo-title {
      font-size: 16pt;
      font-weight: 700;
      color: var(--primary-dark);
      letter-spacing: -0.5px;
      line-height: 1.1;
    }

    .logo-subtitle {
      font-size: 7pt;
      color: var(--gray-500);
      text-transform: uppercase;
      letter-spacing: 1.5px;
      font-weight: 500;
    }

    .report-title { text-align: center; flex: 1; }

    .report-title h1 {
      font-family: 'Source Serif 4', Georgia, serif;
      font-size: 14pt;
      font-weight: 600;
      color: var(--gray-800);
      margin-bottom: 2px;
    }

    .report-title p { font-size: 8pt; color: var(--gray-500); }

    .partner-logo { text-align: right; }

    .partner-logo .hospital-name {
      font-size: 10pt;
      font-weight: 600;
      color: var(--gray-700);
    }

    .partner-logo .hospital-sub { font-size: 7pt; color: var(--gray-400); }

    .patient-id-box {
      margin-top: 5px;
      padding: 4px 10px;
      background: var(--primary-light);
      border-radius: 4px;
      display: inline-block;
    }

    .patient-id-box span { font-size: 7pt; color: var(--gray-500); }

    .patient-id-box strong {
      font-size: 9pt;
      color: var(--primary-dark);
      font-weight: 600;
    }

    .section { margin-bottom: 12px; }

    .section-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }

    .section-header::before {
      content: '';
      width: 4px;
      height: 16px;
      background: linear-gradient(180deg, var(--primary), var(--accent));
      border-radius: 2px;
    }

    .section-title {
      font-size: 10pt;
      font-weight: 600;
      color: var(--primary-dark);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .section-content {
      background: var(--gray-50);
      border: 1px solid var(--gray-200);
      border-radius: 6px;
      padding: 10px 12px;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px 20px;
    }

    .info-item { display: flex; flex-direction: column; }

    .info-label {
      font-size: 7pt;
      color: var(--gray-500);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 1px;
    }

    .info-value {
      font-size: 9pt;
      color: var(--gray-800);
      font-weight: 500;
    }

    /* Score Cards */
    .score-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 8px;
    }

    .score-card {
      background: white;
      border: 1px solid var(--gray-200);
      border-radius: 6px;
      padding: 10px;
      text-align: center;
    }

    .score-card.primary {
      background: linear-gradient(135deg, var(--primary), var(--primary-dark));
      border: none;
      color: white;
    }

    .score-card.primary .score-label {
      color: rgba(255,255,255,0.8);
    }

    .score-card.primary .score-value {
      color: white;
    }

    .score-card.warning {
      background: var(--warning-light);
      border-color: var(--warning);
    }

    .score-card.warning .score-value {
      color: var(--warning);
    }

    .score-card.danger {
      background: var(--danger-light);
      border-color: var(--danger);
    }

    .score-card.danger .score-value {
      color: var(--danger);
    }

    .score-card.success {
      background: var(--success-light);
      border-color: var(--success);
    }

    .score-card.success .score-value {
      color: var(--success);
    }

    .score-label {
      font-size: 6.5pt;
      color: var(--gray-500);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }

    .score-value {
      font-size: 16pt;
      font-weight: 700;
      color: var(--gray-800);
      line-height: 1;
    }

    .score-unit {
      font-size: 7pt;
      color: var(--gray-400);
      margin-top: 2px;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 8pt;
    }

    .data-table th {
      background: var(--primary);
      color: white;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 7pt;
      letter-spacing: 0.5px;
      padding: 8px 10px;
      text-align: left;
    }

    .data-table td {
      padding: 7px 10px;
      border-bottom: 1px solid var(--gray-200);
    }

    .data-table tr:nth-child(even) { background: var(--gray-50); }

    .highlight-cell {
      background: var(--warning-light);
      font-weight: 600;
      color: var(--warning);
    }

    .danger-cell {
      background: var(--danger-light);
      font-weight: 600;
      color: var(--danger);
    }

    .success-cell {
      background: var(--success-light);
      font-weight: 600;
      color: var(--success);
    }

    .badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 10px;
      font-size: 7pt;
      font-weight: 600;
      text-transform: uppercase;
    }

    .badge-danger { background: var(--danger-light); color: var(--danger); }
    .badge-warning { background: var(--warning-light); color: #B45309; }
    .badge-success { background: var(--success-light); color: var(--success); }

    .prob-row {
      display: flex;
      align-items: center;
      margin-bottom: 6px;
    }

    .prob-label {
      width: 140px;
      font-size: 8pt;
      color: var(--gray-700);
    }

    .prob-bar-container {
      flex: 1;
      height: 14px;
      background: var(--gray-200);
      border-radius: 7px;
      overflow: hidden;
      margin: 0 10px;
    }

    .prob-bar {
      height: 100%;
      border-radius: 7px;
    }

    .prob-bar.high { background: linear-gradient(90deg, #F97316, #EA580C); }
    .prob-bar.medium { background: linear-gradient(90deg, #FBBF24, #F59E0B); }
    .prob-bar.low { background: linear-gradient(90deg, #34D399, #10B981); }

    .prob-value {
      width: 40px;
      font-size: 9pt;
      font-weight: 600;
      color: var(--gray-800);
      text-align: right;
    }

    .prob-confidence {
      width: 60px;
      font-size: 7pt;
      color: var(--gray-500);
      text-align: center;
    }

    .finding-chip {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-radius: 6px;
      border: 1px solid;
    }

    .finding-chip.present {
      background: var(--warning-light);
      border-color: #FCD34D;
    }

    .finding-chip.absent {
      background: var(--gray-50);
      border-color: var(--gray-200);
    }

    .finding-indicator {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    .finding-chip.present .finding-indicator {
      background: var(--warning);
      box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.2);
    }

    .finding-chip.absent .finding-indicator { background: var(--gray-300); }

    .signature-block {
      margin-top: auto;
      padding-top: 15px;
      border-top: 1px dashed var(--gray-300);
      display: flex;
      justify-content: flex-end;
    }

    .signature-content {
      text-align: center;
      min-width: 180px;
    }

    .signature-line {
      width: 100%;
      height: 1px;
      background: var(--gray-400);
      margin-bottom: 5px;
    }

    .footer {
      margin-top: 15px;
      padding-top: 10px;
      border-top: 1px solid var(--gray-200);
    }

    .disclaimer {
      font-size: 6.5pt;
      color: var(--gray-500);
      line-height: 1.5;
      text-align: justify;
    }

    .page-number {
      text-align: center;
      font-size: 7pt;
      color: var(--gray-400);
      margin-top: 8px;
    }

    .algo-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 2px 8px;
      background: var(--primary);
      color: white;
      border-radius: 4px;
      font-size: 7pt;
      font-weight: 600;
      margin-left: 8px;
    }

    .primary-etiology {
      background: var(--warning-light);
      border: 1px solid var(--warning);
      border-radius: 6px;
      padding: 10px 12px;
      margin-top: 10px;
    }

    .primary-etiology-label {
      font-size: 7pt;
      color: var(--gray-600);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .primary-etiology-value {
      font-size: 11pt;
      font-weight: 700;
      color: #92400E;
    }

    .findings-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
    }
  </style>`
}

function generateHeader(report: Report): string {
  return `<header class="header">
      <div class="logo-section">
        <div class="logo-icon">
          <img src="/logo/logo.svg" alt="Logo" style="width: 42px; height: 42px;" />
        </div>
        <div class="logo-text">
          <span class="logo-title">HEALIUM</span>
          <span class="logo-subtitle">Intelliscan AI</span>
        </div>
      </div>
      
      <div class="report-title">
        <h1>Kidney Health Report</h1>
        <p>AI-Powered Diagnostic Assessment</p>
      </div>

      <div class="partner-logo">
        <div class="hospital-name">${report.hospitalName}</div>
        <div class="hospital-sub">${report.departmentName}</div>
        <div class="patient-id-box">
          <span>Patient ID: </span><strong>${report.generalDetails.patientId}</strong>
        </div>
      </div>
    </header>`
}

function generatePage1(report: Report): string {
  const { generalDetails, clinicalHistory, aiScores, morphology } = report

  return `<div class="page">
    ${generateHeader(report)}

    <!-- General Details -->
    <div class="section">
      <div class="section-header">
        <span class="section-title">General Details</span>
      </div>
      <div class="section-content">
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Patient Name</span>
            <span class="info-value">${generalDetails.patientName}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Centre</span>
            <span class="info-value">${generalDetails.centre}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Referring Physician</span>
            <span class="info-value">${generalDetails.referringPhysician}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Age / Gender</span>
            <span class="info-value">${generalDetails.age} / ${generalDetails.gender}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Report Generation Date</span>
            <span class="info-value">${generalDetails.reportGenerationDate}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Scan Date</span>
            <span class="info-value">${generalDetails.scanDate}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Clinical History -->
    <div class="section">
      <div class="section-header">
        <span class="section-title">Clinical History</span>
      </div>
      <div class="section-content">
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Chief Complaint</span>
            <span class="info-value">${clinicalHistory.chiefComplaint}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Diabetes Mellitus</span>
            <span class="info-value">${clinicalHistory.diabetesMellitus}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Hypertension</span>
            <span class="info-value">${clinicalHistory.hypertension}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Family History (CKD)</span>
            <span class="info-value">${clinicalHistory.familyHistory}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Previous Kidney Issues</span>
            <span class="info-value">${clinicalHistory.previousKidneyIssues}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Current Medications</span>
            <span class="info-value">${clinicalHistory.currentMedications}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Intelliscan AI Scores -->
    <div class="section">
      <div class="section-header">
        <span class="section-title">Intelliscan AI Scores</span>
        <span class="algo-badge">Algorithm 1</span>
      </div>
      <div class="section-content">
        <div class="score-grid">
          <div class="score-card primary">
            <div class="score-label">Predicted eGFR</div>
            <div class="score-value">${aiScores.predictedEgfr}</div>
            <div class="score-unit">mL/min/1.73m²</div>
          </div>
          <div class="score-card warning">
            <div class="score-label">CKD Status</div>
            <div class="score-value">${aiScores.ckdStatus}</div>
            <div class="score-unit">Detected</div>
          </div>
          <div class="score-card warning">
            <div class="score-label">CKD Stage</div>
            <div class="score-value">${aiScores.ckdStage}</div>
            <div class="score-unit">Moderate-Severe</div>
          </div>
          <div class="score-card success">
            <div class="score-label">Model Confidence</div>
            <div class="score-value">${aiScores.modelConfidence}</div>
            <div class="score-unit">Percent</div>
          </div>
          <div class="score-card">
            <div class="score-label">Image Quality</div>
            <div class="score-value">${aiScores.imageQuality}</div>
            <div class="score-unit">Acceptable</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Kidney Morphology Analysis -->
    <div class="section">
      <div class="section-header">
        <span class="section-title">Kidney Morphology Analysis</span>
      </div>
      <div class="section-content" style="padding: 0; overflow: hidden;">
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 35%;">Parameter</th>
              <th style="width: 25%;">Right Kidney</th>
              <th style="width: 25%;">Left Kidney</th>
              <th style="width: 15%;">Reference</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Length (cm)</td>
              <td>${morphology.rightKidney.length}</td>
              <td>${morphology.leftKidney.length}</td>
              <td>9–12 cm</td>
            </tr>
            <tr>
              <td>Width (cm)</td>
              <td>${morphology.rightKidney.width}</td>
              <td>${morphology.leftKidney.width}</td>
              <td>4–6 cm</td>
            </tr>
            <tr>
              <td>Cortical Thickness (cm)</td>
              <td class="highlight-cell">${morphology.rightKidney.corticalThickness}</td>
              <td class="highlight-cell">${morphology.leftKidney.corticalThickness}</td>
              <td>1.0–1.5 cm</td>
            </tr>
            <tr>
              <td>Parenchymal Echogenicity</td>
              <td class="highlight-cell">${morphology.rightKidney.echogenicity}</td>
              <td class="highlight-cell">${morphology.leftKidney.echogenicity}</td>
              <td>Normal</td>
            </tr>
            <tr>
              <td>Corticomedullary Differentiation</td>
              <td class="highlight-cell">${morphology.rightKidney.cmd}</td>
              <td class="highlight-cell">${morphology.leftKidney.cmd}</td>
              <td>Maintained</td>
            </tr>
            <tr>
              <td>Hydronephrosis</td>
              <td class="success-cell">${morphology.rightKidney.hydronephrosis}</td>
              <td class="highlight-cell">${morphology.leftKidney.hydronephrosis}</td>
              <td>None</td>
            </tr>
            <tr>
              <td>Stones Detected</td>
              <td class="success-cell">${morphology.rightKidney.stones}</td>
              <td class="danger-cell">${morphology.leftKidney.stones}</td>
              <td>None</td>
            </tr>
            <tr>
              <td>Cysts</td>
              <td class="success-cell">${morphology.rightKidney.cysts}</td>
              <td class="highlight-cell">${morphology.leftKidney.cysts}</td>
              <td>—</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="signature-block">
      <div class="signature-content">
        <div class="signature-line"></div>
        <div class="signature-label">Doctor's Signature & Credentials</div>
        <div class="signature-title">Reporting Physician</div>
      </div>
    </div>

    <footer class="footer">
      <p class="disclaimer">
        <strong>Disclaimer:</strong> Healium Intelliscan AI does not replace ultrasound or any other anatomical imaging test. It is not intended for use by individuals for self-diagnosis or self-evaluation. This report requires clinical correlation and should be presented to a Qualified Healthcare Professional to determine the nature of appropriate follow-up and course of action/evaluation.
      </p>
    </footer>
  </div>`
}

function generatePage2(report: Report): string {
  const { etiologyClassification, structuralFindings, stoneDetection } = report

  const primaryEtiology = etiologyClassification
    .filter((e) => e.percentage > 70)
    .map((e) => e.name)
    .join(" + ")

  return `<div class="page">
    ${generateHeader(report)}

    <!-- Etiology Classification -->
    <div class="section">
      <div class="section-header">
        <span class="section-title">Etiology Classification</span>
        <span class="algo-badge">Algorithm 2</span>
      </div>
      <div class="section-content">
        ${etiologyClassification
          .map((etiology) => {
            const barClass = etiology.percentage >= 70 ? "high" : etiology.percentage >= 40 ? "medium" : "low"
            const badgeClass =
              etiology.confidence === "High" ? "danger" : etiology.confidence === "Moderate" ? "warning" : "success"

            return `<div class="prob-row">
            <span class="prob-label">${etiology.name}</span>
            <div class="prob-bar-container">
              <div class="prob-bar ${barClass}" style="width: ${etiology.percentage}%;"></div>
            </div>
            <span class="prob-value">${etiology.percentage}%</span>
            <span class="prob-confidence"><span class="badge badge-${badgeClass}">${etiology.confidence}</span></span>
          </div>`
          })
          .join("")}

        <div class="primary-etiology">
          <div>
            <div class="primary-etiology-label">Primary Suspected Etiology</div>
            <div class="primary-etiology-value">${primaryEtiology}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Structural Findings -->
    <div class="section">
      <div class="section-header">
        <span class="section-title">Structural Findings Classification</span>
        <span class="algo-badge">Algorithm 3</span>
      </div>
      <div class="section-content">
        <div class="findings-grid">
          ${structuralFindings
            .slice(0, 6)
            .map(
              (finding) => `
            <div class="finding-chip ${finding.present ? "present" : "absent"}">
              <div class="finding-indicator"></div>
              <span class="finding-text">${finding.name}</span>
            </div>
          `,
            )
            .join("")}
        </div>

        <div style="margin-top: 12px; padding: 10px; background: white; border: 1px solid var(--gray-200); border-radius: 6px;">
          <table class="data-table" style="font-size: 7.5pt;">
            <thead>
              <tr>
                <th>Finding</th>
                <th>Status</th>
                <th>Location</th>
                <th>Clinical Significance</th>
              </tr>
            </thead>
            <tbody>
              ${structuralFindings
                .filter((f) => f.present)
                .map(
                  (finding) => `
                <tr>
                  <td>${finding.name}</td>
                  <td><span class="badge badge-warning">${finding.status}</span></td>
                  <td>${finding.location}</td>
                  <td>${finding.clinicalSignificance}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Stone Detection -->
    ${
      stoneDetection.totalStones > 0
        ? `
    <div class="section">
      <div class="section-header">
        <span class="section-title">Kidney Stone Detection</span>
        <span class="algo-badge">Algorithm 4</span>
      </div>
      <div class="section-content">
        <table class="data-table">
          <thead>
            <tr>
              <th style="width: 10%;">Stone #</th>
              <th style="width: 25%;">Location</th>
              <th style="width: 15%;">Size</th>
              <th style="width: 20%;">Confidence</th>
              <th style="width: 30%;">Characteristics</th>
            </tr>
          </thead>
          <tbody>
            ${stoneDetection.stones
              .map(
                (stone) => `
              <tr>
                <td style="text-align: center; font-weight: 600;">${stone.number}</td>
                <td>${stone.location}</td>
                <td class="${Number.parseFloat(stone.size) > 4 ? "danger-cell" : "highlight-cell"}">${stone.size}</td>
                <td>${stone.confidence}%</td>
                <td>${stone.characteristics}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>

        <div style="display: flex; align-items: center; gap: 15px; padding: 10px; background: var(--danger-light); border: 1px solid var(--danger); border-radius: 6px; margin-top: 10px;">
          <div style="width: 50px; height: 50px; background: var(--danger); border-radius: 10px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: white;">
            <span style="font-size: 20pt; font-weight: 700; line-height: 1;">${stoneDetection.totalStones}</span>
            <span style="font-size: 6pt; text-transform: uppercase;">Stones</span>
          </div>
          <div style="flex: 1;">
            <p style="font-size: 8pt; color: var(--gray-700); margin-bottom: 2px;"><strong>Total Stones Detected:</strong> ${stoneDetection.totalStones}</p>
            <p style="font-size: 8pt; color: var(--gray-700); margin-bottom: 2px;"><strong style="color: var(--danger);">Largest Stone:</strong> ${stoneDetection.largestStone}</p>
            <p style="font-size: 8pt; color: var(--gray-700);"><strong>Recommended Action:</strong> ${stoneDetection.recommendedAction}</p>
          </div>
        </div>
      </div>
    </div>
    `
        : ""
    }

    <div class="signature-block">
      <div class="signature-content">
        <div class="signature-line"></div>
        <div class="signature-label">Doctor's Signature & Credentials</div>
        <div class="signature-title">Reporting Physician</div>
      </div>
    </div>
  </div>`
}

function generatePage3(report: Report): string {
  return `<div class="page">
    ${generateHeader(report)}

    <!-- Annotated Images -->
    <div class="section">
      <div class="section-header">
        <span class="section-title">Annotated Ultrasound Images</span>
      </div>
      <div class="section-content" style="background: transparent; border: none; padding: 0;">
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
          ${report.images
            .map(
              (img) => `
            <div style="background: var(--gray-900); border-radius: 8px; overflow: hidden;">
              <div style="background: var(--gray-800); padding: 6px 10px; display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 8pt; font-weight: 600; color: white;">${img.kidney === "left" ? "Left" : "Right"} Kidney — ${img.view}</span>
                <span style="font-size: 7pt; color: var(--gray-400);">${img.dimensions}</span>
              </div>
              <div style="aspect-ratio: 4/3; background: linear-gradient(135deg, #1a1a2e, #16213e); display: flex; align-items: center; justify-content: center;">
                <div style="width: 80%; height: 80%; border-radius: 50%; background: radial-gradient(ellipse at center, #4a5568 0%, #2d3748 50%, #1a202c 100%);"></div>
              </div>
              <div style="background: var(--gray-800); padding: 6px 10px; font-size: 7pt; color: var(--gray-400);">
                ${img.notes}
              </div>
            </div>
          `,
            )
            .join("")}
        </div>
      </div>
    </div>

    <div class="signature-block">
      <div class="signature-content">
        <div class="signature-line"></div>
        <div class="signature-label">Doctor's Signature & Credentials</div>
        <div class="signature-title">Reporting Physician</div>
      </div>
    </div>

    <footer class="footer">
      <p class="disclaimer">
        <strong>Disclaimer:</strong> Healium Intelliscan AI does not replace ultrasound or any other anatomical imaging test.
      </p>
    </footer>
  </div>`
}

function generatePage4(report: Report): string {
  const { clinicalImpression, recommendations } = report

  return `<div class="page">
    ${generateHeader(report)}

    <!-- Clinical Impression -->
    <div class="section">
      <div class="section-header">
        <span class="section-title">Clinical Impression</span>
      </div>
      <div class="section-content">
        <div style="background: white; border: 1px solid var(--gray-200); border-radius: 6px; padding: 12px; margin-bottom: 10px;">
          <h4 style="font-size: 9pt; font-weight: 600; color: var(--gray-800); margin-bottom: 6px; padding-bottom: 6px; border-bottom: 1px solid var(--gray-200);">Right Kidney</h4>
          <p style="font-size: 8.5pt; color: var(--gray-700); line-height: 1.6;">${clinicalImpression.rightKidney}</p>
        </div>
        
        <div style="background: white; border: 1px solid var(--gray-200); border-radius: 6px; padding: 12px; margin-bottom: 10px;">
          <h4 style="font-size: 9pt; font-weight: 600; color: var(--gray-800); margin-bottom: 6px; padding-bottom: 6px; border-bottom: 1px solid var(--gray-200);">Left Kidney</h4>
          <p style="font-size: 8.5pt; color: var(--gray-700); line-height: 1.6;">${clinicalImpression.leftKidney}</p>
        </div>

        <div style="background: white; border: 1px solid var(--gray-200); border-radius: 6px; padding: 12px;">
          <h4 style="font-size: 9pt; font-weight: 600; color: var(--gray-800); margin-bottom: 6px; padding-bottom: 6px; border-bottom: 1px solid var(--gray-200);">Overall Assessment</h4>
          <p style="font-size: 8.5pt; color: var(--gray-700); line-height: 1.6;">${clinicalImpression.overall}</p>
        </div>
      </div>
    </div>

    <!-- Recommendations -->
    <div class="section">
      <div class="section-header">
        <span class="section-title">Recommendations</span>
      </div>
      <div style="background: linear-gradient(135deg, var(--primary-pale), var(--primary-light)); border: 1px solid var(--primary); border-left: 4px solid var(--primary); border-radius: 6px; padding: 12px 15px;">
        <h4 style="font-size: 9pt; font-weight: 600; color: var(--primary-dark); margin-bottom: 8px;">Recommended Next Steps</h4>
        <ul style="list-style: none;">
          ${recommendations
            .map(
              (rec) => `
            <li style="font-size: 8.5pt; color: var(--gray-700); padding: 4px 0; padding-left: 18px; position: relative;">
              <span style="position: absolute; left: 0; color: var(--primary); font-weight: 600;">→</span>
              ${rec}
            </li>
          `,
            )
            .join("")}
        </ul>
      </div>
    </div>

    <div class="signature-block">
      <div class="signature-content">
        <div class="signature-line"></div>
        <div class="signature-label">Doctor's Signature & Credentials</div>
        <div class="signature-title">Reporting Physician</div>
      </div>
    </div>

    <footer class="footer">
      <p class="disclaimer">
        <strong>Disclaimer:</strong> Healium Intelliscan AI does not replace ultrasound or any other anatomical imaging test. It is not intended for use by individuals for self-diagnosis or self-evaluation. This report requires clinical correlation and should be presented to a Qualified Healthcare Professional to determine the nature of appropriate follow-up and course of action/evaluation. The AI predictions are meant to assist clinical decision-making and should not be the sole basis for diagnosis or treatment.
      </p>
      <div class="page-number">Report ID: ${report.reportId} — Generated: ${report.generatedAt}</div>
    </footer>
  </div>`
}

export function generateDummyHealiumReport(): Report {
  return {
    generalDetails: {
      patientName: "Rajesh Kumar Sharma",
      centre: "City Medical Center, Bengaluru",
      referringPhysician: "Dr. Anil Kapoor",
      age: "58 Years",
      gender: "Male",
      reportGenerationDate: "Dec 22, 2024 — 14:35 IST",
      scanDate: "Dec 22, 2024 — 13:45 IST",
      patientId: "KID-2024-08472",
    },
    clinicalHistory: {
      chiefComplaint: "Bilateral flank pain, reduced urine output",
      diabetesMellitus: "Yes (Type 2, 12 years)",
      hypertension: "Yes (8 years, on medication)",
      familyHistory: "Father — ESRD on dialysis",
      previousKidneyIssues: "Kidney stone (2019, passed)",
      currentMedications: "Metformin, Amlodipine, Losartan",
    },
    aiScores: {
      predictedEgfr: 42,
      ckdStatus: "YES",
      ckdStage: "3b",
      modelConfidence: 94.2,
      imageQuality: "Good",
    },
    morphology: {
      rightKidney: {
        length: 9.8,
        width: 4.2,
        corticalThickness: 0.9,
        echogenicity: "Increased",
        cmd: "Reduced",
        hydronephrosis: "None",
        stones: 0,
        cysts: "No",
      },
      leftKidney: {
        length: 10.2,
        width: 4.5,
        corticalThickness: 0.8,
        echogenicity: "Increased",
        cmd: "Reduced",
        hydronephrosis: "Mild (Grade I)",
        stones: 2,
        cysts: "Yes (1.2 cm)",
      },
    },
    etiologyClassification: [
      { name: "Hypertensive Nephrosclerosis", percentage: 82, confidence: "High" },
      { name: "Diabetic Nephropathy", percentage: 78, confidence: "High" },
      { name: "Obstructive Uropathy", percentage: 45, confidence: "Moderate" },
      { name: "Glomerulonephritis", percentage: 12, confidence: "Low" },
      { name: "Polycystic Kidney Disease", percentage: 8, confidence: "Low" },
    ],
    structuralFindings: [
      {
        name: "Hydronephrosis",
        present: true,
        status: "Present",
        location: "Left Kidney",
        clinicalSignificance: "Mild (Grade I), likely secondary to distal obstruction",
      },
      { name: "Calculi", present: false, status: "Absent", location: "—", clinicalSignificance: "—" },
      {
        name: "Cysts",
        present: true,
        status: "Present",
        location: "Left Kidney, Lower Pole",
        clinicalSignificance: "Simple cyst (1.2 cm), Bosniak I — benign",
      },
      {
        name: "Increased Echogenicity",
        present: true,
        status: "Present",
        location: "Bilateral",
        clinicalSignificance: "Consistent with chronic parenchymal disease",
      },
      {
        name: "Cortical Thinning",
        present: true,
        status: "Present",
        location: "Bilateral",
        clinicalSignificance: "< 1 cm, indicative of chronic damage",
      },
      { name: "Masses", present: false, status: "Absent", location: "—", clinicalSignificance: "—" },
    ],
    stoneDetection: {
      stones: [
        {
          number: 1,
          location: "Left Kidney — Lower Pole",
          size: "4.2 mm",
          confidence: 96,
          characteristics: "Echogenic focus with posterior shadowing",
        },
        {
          number: 2,
          location: "Left Kidney — Mid Pole",
          size: "2.8 mm",
          confidence: 89,
          characteristics: "Small echogenic focus, minimal shadowing",
        },
      ],
      totalStones: 2,
      largestStone: "4.2 mm — Lower Pole",
      recommendedAction: "Conservative management, increased hydration, follow-up in 3 months",
    },
    clinicalImpression: {
      rightKidney:
        "The right kidney measures 9.8 × 4.2 cm with preserved size but shows signs of chronic parenchymal changes. Cortical thickness is reduced at 0.9 cm with increased echogenicity and poor corticomedullary differentiation. No hydronephrosis, stones, or masses detected.",
      leftKidney:
        "The left kidney measures 10.2 × 4.5 cm with similar chronic changes as the right. Cortical thickness is further reduced at 0.8 cm. Mild grade I hydronephrosis is present, likely secondary to distal obstruction from identified stones. Two stones detected: 4.2 mm (lower pole) and 2.8 mm (mid pole). A simple cortical cyst (1.2 cm, Bosniak I) is noted in the lower pole.",
      overall:
        "Bilateral chronic kidney disease with evidence of advanced parenchymal damage consistent with Stage 3b CKD. Primary etiologies are likely hypertensive nephrosclerosis and diabetic nephropathy given patient history and imaging findings. Left-sided hydronephrosis and stone burden require urological evaluation.",
    },
    recommendations: [
      "Urgent nephrology referral for CKD Stage 3b management and treatment optimization",
      "Urology consultation for left-sided stone management and hydronephrosis evaluation",
      "Comprehensive metabolic panel including serum creatinine, BUN, electrolytes",
      "24-hour urine protein quantification to assess proteinuria",
      "Strict blood pressure and glucose control with medication adjustment as needed",
      "Dietary modifications: low sodium, protein restriction, adequate hydration",
      "Follow-up ultrasound in 3 months to monitor stone progression and hydronephrosis",
      "Consider CT urography if hydronephrosis persists or worsens",
    ],
    images: [
      {
        id: "1",
        kidney: "right",
        view: "Longitudinal",
        dimensions: "9.8 × 4.2 cm",
        notes: "No stones detected | Echogenicity: Increased",
      },
      {
        id: "2",
        kidney: "left",
        view: "Longitudinal",
        dimensions: "10.2 × 4.5 cm",
        notes: "2 stones detected | Mild hydronephrosis",
      },
      {
        id: "3",
        kidney: "right",
        view: "Transverse",
        dimensions: "4.2 × 3.8 cm",
        notes: "Reduced CMD | Cortical thinning",
      },
      {
        id: "4",
        kidney: "left",
        view: "Transverse",
        dimensions: "4.5 × 4.1 cm",
        notes: "Simple cyst (1.2 cm) | Grade I hydronephrosis",
      },
    ],
    reportId: "RPT-2024-08472",
    generatedAt: "Dec 22, 2024 — 14:35 IST",
    hospitalName: "City Medical Center",
    departmentName: "Department of Nephrology",
  }
}
