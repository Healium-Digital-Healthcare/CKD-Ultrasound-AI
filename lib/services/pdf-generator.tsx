import React from "react"
import { Document, Page, Text, View, StyleSheet, renderToBuffer } from "@react-pdf/renderer"
import type { Report } from "@/types/case"

// Use Helvetica (built-in font) - no need to register external fonts

const colors = {
  primary: "#0891B2",
  primaryDark: "#0E7490",
  primaryLight: "#E0F7FA",
  accent: "#0D9488",
  warning: "#F59E0B",
  warningLight: "#FEF3C7",
  danger: "#EF4444",
  dangerLight: "#FEE2E2",
  success: "#10B981",
  successLight: "#D1FAE5",
  gray50: "#F9FAFB",
  gray100: "#F3F4F6",
  gray200: "#E5E7EB",
  gray300: "#D1D5DB",
  gray400: "#9CA3AF",
  gray500: "#6B7280",
  gray600: "#4B5563",
  gray700: "#374151",
  gray800: "#1F2937",
}

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Helvetica",
    fontSize: 9,
    color: colors.gray800,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    marginBottom: 15,
  },
  logoSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logoTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: colors.primaryDark,
  },
  logoSubtitle: {
    fontSize: 7,
    color: colors.gray500,
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  reportTitle: {
    textAlign: "center",
    flex: 1,
  },
  reportTitleH1: {
    fontSize: 14,
    fontWeight: 600,
    color: colors.gray800,
    marginBottom: 2,
  },
  reportTitleP: {
    fontSize: 8,
    color: colors.gray500,
  },
  partnerLogo: {
    textAlign: "right",
  },
  hospitalName: {
    fontSize: 10,
    fontWeight: 600,
    color: colors.gray700,
  },
  hospitalSub: {
    fontSize: 7,
    color: colors.gray400,
  },
  patientIdBox: {
    marginTop: 5,
    padding: "4 10",
    backgroundColor: colors.primaryLight,
    borderRadius: 4,
  },
  patientIdLabel: {
    fontSize: 7,
    color: colors.gray500,
  },
  patientIdValue: {
    fontSize: 9,
    color: colors.primaryDark,
    fontWeight: 600,
  },
  section: {
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionBar: {
    width: 4,
    height: 16,
    backgroundColor: colors.primary,
    borderRadius: 2,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 600,
    color: colors.primaryDark,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sectionContent: {
    backgroundColor: colors.gray50,
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: 6,
    padding: "10 12",
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  infoItem: {
    width: "33.33%",
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 7,
    color: colors.gray500,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 1,
  },
  infoValue: {
    fontSize: 9,
    color: colors.gray800,
    fontWeight: 500,
  },
  scoreGrid: {
    flexDirection: "row",
    gap: 8,
  },
  scoreCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: 6,
    padding: 10,
    alignItems: "center",
  },
  scoreCardPrimary: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 6,
    padding: 10,
    alignItems: "center",
  },
  scoreCardWarning: {
    flex: 1,
    backgroundColor: colors.warningLight,
    borderWidth: 1,
    borderColor: colors.warning,
    borderRadius: 6,
    padding: 10,
    alignItems: "center",
  },
  scoreCardSuccess: {
    flex: 1,
    backgroundColor: colors.successLight,
    borderWidth: 1,
    borderColor: colors.success,
    borderRadius: 6,
    padding: 10,
    alignItems: "center",
  },
  scoreLabel: {
    fontSize: 6.5,
    color: colors.gray500,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  scoreLabelWhite: {
    fontSize: 6.5,
    color: "rgba(255,255,255,0.8)",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 16,
    fontWeight: 700,
    color: colors.gray800,
  },
  scoreValueWhite: {
    fontSize: 16,
    fontWeight: 700,
    color: "#fff",
  },
  scoreValueWarning: {
    fontSize: 16,
    fontWeight: 700,
    color: colors.warning,
  },
  scoreValueSuccess: {
    fontSize: 16,
    fontWeight: 700,
    color: colors.success,
  },
  scoreUnit: {
    fontSize: 7,
    color: colors.gray400,
    marginTop: 2,
  },
  scoreUnitWhite: {
    fontSize: 7,
    color: "rgba(255,255,255,0.8)",
    marginTop: 2,
  },
  table: {
    width: "100%",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: colors.primary,
    padding: "8 10",
  },
  tableHeaderCell: {
    color: "#fff",
    fontSize: 7,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
    padding: "7 10",
  },
  tableRowAlt: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
    padding: "7 10",
    backgroundColor: colors.gray50,
  },
  tableCell: {
    fontSize: 8,
    color: colors.gray800,
  },
  tableCellHighlight: {
    fontSize: 8,
    fontWeight: 600,
    color: colors.warning,
    backgroundColor: colors.warningLight,
    padding: 2,
    borderRadius: 2,
  },
  tableCellDanger: {
    fontSize: 8,
    fontWeight: 600,
    color: colors.danger,
    backgroundColor: colors.dangerLight,
    padding: 2,
    borderRadius: 2,
  },
  tableCellSuccess: {
    fontSize: 8,
    fontWeight: 600,
    color: colors.success,
    backgroundColor: colors.successLight,
    padding: 2,
    borderRadius: 2,
  },
  footer: {
    marginTop: "auto",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
  disclaimer: {
    fontSize: 6.5,
    color: colors.gray500,
    lineHeight: 1.5,
    textAlign: "justify",
  },
  pageNumber: {
    textAlign: "center",
    fontSize: 7,
    color: colors.gray400,
    marginTop: 8,
  },
  probRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  probLabel: {
    width: 140,
    fontSize: 8,
    color: colors.gray700,
  },
  probBarContainer: {
    flex: 1,
    height: 14,
    backgroundColor: colors.gray200,
    borderRadius: 7,
    marginHorizontal: 10,
    overflow: "hidden",
  },
  probBarHigh: {
    height: "100%",
    backgroundColor: "#F97316",
    borderRadius: 7,
  },
  probBarMedium: {
    height: "100%",
    backgroundColor: "#FBBF24",
    borderRadius: 7,
  },
  probBarLow: {
    height: "100%",
    backgroundColor: "#34D399",
    borderRadius: 7,
  },
  probValue: {
    width: 40,
    fontSize: 9,
    fontWeight: 600,
    color: colors.gray800,
    textAlign: "right",
  },
  probConfidence: {
    width: 60,
    fontSize: 7,
    color: colors.gray500,
    textAlign: "center",
  },
  impressionBox: {
    backgroundColor: colors.gray50,
    borderWidth: 1,
    borderColor: colors.gray200,
    borderRadius: 6,
    padding: 12,
    marginBottom: 10,
  },
  impressionTitle: {
    fontSize: 9,
    fontWeight: 600,
    color: colors.primaryDark,
    marginBottom: 4,
  },
  impressionText: {
    fontSize: 8,
    color: colors.gray700,
    lineHeight: 1.5,
    textAlign: "justify",
  },
  recommendationItem: {
    flexDirection: "row",
    marginBottom: 6,
    paddingLeft: 8,
  },
  recommendationBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginRight: 8,
    marginTop: 3,
  },
  recommendationText: {
    flex: 1,
    fontSize: 8,
    color: colors.gray700,
    lineHeight: 1.5,
  },
  signatureBlock: {
    marginTop: "auto",
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopStyle: "dashed",
    borderTopColor: colors.gray300,
    alignItems: "flex-end",
  },
  signatureContent: {
    alignItems: "center",
    minWidth: 180,
  },
  signatureLine: {
    width: 180,
    height: 1,
    backgroundColor: colors.gray400,
    marginBottom: 5,
  },
  signatureLabel: {
    fontSize: 7,
    color: colors.gray500,
  },
})

const Header = ({ report }: { report: Report }) => (
  <View style={styles.header}>
    <View style={styles.logoSection}>
      <View>
        <Text style={styles.logoTitle}>HEALIUM</Text>
        <Text style={styles.logoSubtitle}>Intelliscan AI</Text>
      </View>
    </View>
    <View style={styles.reportTitle}>
      <Text style={styles.reportTitleH1}>Kidney Health Report</Text>
      <Text style={styles.reportTitleP}>AI-Powered Diagnostic Assessment</Text>
    </View>
    <View style={styles.partnerLogo}>
      <Text style={styles.hospitalName}>{report.hospitalName}</Text>
      <Text style={styles.hospitalSub}>{report.departmentName}</Text>
      <View style={styles.patientIdBox}>
        <Text style={styles.patientIdLabel}>Patient ID: <Text style={styles.patientIdValue}>{report.generalDetails.patientId}</Text></Text>
      </View>
    </View>
  </View>
)

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <View style={styles.sectionBar} />
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
    <View style={styles.sectionContent}>{children}</View>
  </View>
)

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.infoItem}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
)

const Page1 = ({ report }: { report: Report }) => (
  <Page size="A4" style={styles.page}>
    <Header report={report} />

    <Section title="General Details">
      <View style={styles.infoGrid}>
        <InfoItem label="Patient Name" value={report.generalDetails.patientName} />
        <InfoItem label="Centre" value={report.generalDetails.centre} />
        <InfoItem label="Referring Physician" value={report.generalDetails.referringPhysician} />
        <InfoItem label="Age / Gender" value={`${report.generalDetails.age} / ${report.generalDetails.gender}`} />
        <InfoItem label="Report Generation Date" value={report.generalDetails.reportGenerationDate} />
        <InfoItem label="Scan Date" value={report.generalDetails.scanDate} />
      </View>
    </Section>

    <Section title="Clinical History">
      <View style={styles.infoGrid}>
        <InfoItem label="Chief Complaint" value={report.clinicalHistory.chiefComplaint} />
        <InfoItem label="Diabetes Mellitus" value={report.clinicalHistory.diabetesMellitus} />
        <InfoItem label="Hypertension" value={report.clinicalHistory.hypertension} />
        <InfoItem label="Family History (CKD)" value={report.clinicalHistory.familyHistory} />
        <InfoItem label="Previous Kidney Issues" value={report.clinicalHistory.previousKidneyIssues} />
        <InfoItem label="Current Medications" value={report.clinicalHistory.currentMedications} />
      </View>
    </Section>

    <Section title="Intelliscan AI Scores">
      <View style={styles.scoreGrid}>
        <View style={styles.scoreCardPrimary}>
          <Text style={styles.scoreLabelWhite}>Predicted eGFR</Text>
          <Text style={styles.scoreValueWhite}>{report.aiScores.predictedEgfr}</Text>
          <Text style={styles.scoreUnitWhite}>mL/min/1.73m²</Text>
        </View>
        <View style={styles.scoreCardWarning}>
          <Text style={styles.scoreLabel}>CKD Status</Text>
          <Text style={styles.scoreValueWarning}>{report.aiScores.ckdStatus}</Text>
          <Text style={styles.scoreUnit}>Detected</Text>
        </View>
        <View style={styles.scoreCardWarning}>
          <Text style={styles.scoreLabel}>CKD Stage</Text>
          <Text style={styles.scoreValueWarning}>{report.aiScores.ckdStage}</Text>
          <Text style={styles.scoreUnit}>Moderate-Severe</Text>
        </View>
        <View style={styles.scoreCardSuccess}>
          <Text style={styles.scoreLabel}>Model Confidence</Text>
          <Text style={styles.scoreValueSuccess}>{report.aiScores.modelConfidence}</Text>
          <Text style={styles.scoreUnit}>Percent</Text>
        </View>
        <View style={styles.scoreCard}>
          <Text style={styles.scoreLabel}>Image Quality</Text>
          <Text style={styles.scoreValue}>{report.aiScores.imageQuality}</Text>
          <Text style={styles.scoreUnit}>Acceptable</Text>
        </View>
      </View>
    </Section>

    <Section title="Kidney Morphology Analysis">
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, { width: "35%" }]}>Parameter</Text>
          <Text style={[styles.tableHeaderCell, { width: "25%" }]}>Right Kidney</Text>
          <Text style={[styles.tableHeaderCell, { width: "25%" }]}>Left Kidney</Text>
          <Text style={[styles.tableHeaderCell, { width: "15%" }]}>Reference</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { width: "35%" }]}>Length (cm)</Text>
          <Text style={[styles.tableCell, { width: "25%" }]}>{report.morphology.rightKidney.length}</Text>
          <Text style={[styles.tableCell, { width: "25%" }]}>{report.morphology.leftKidney.length}</Text>
          <Text style={[styles.tableCell, { width: "15%" }]}>9–12 cm</Text>
        </View>
        <View style={styles.tableRowAlt}>
          <Text style={[styles.tableCell, { width: "35%" }]}>Width (cm)</Text>
          <Text style={[styles.tableCell, { width: "25%" }]}>{report.morphology.rightKidney.width}</Text>
          <Text style={[styles.tableCell, { width: "25%" }]}>{report.morphology.leftKidney.width}</Text>
          <Text style={[styles.tableCell, { width: "15%" }]}>4–6 cm</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { width: "35%" }]}>Cortical Thickness (cm)</Text>
          <Text style={[styles.tableCellHighlight, { width: "25%" }]}>{report.morphology.rightKidney.corticalThickness}</Text>
          <Text style={[styles.tableCellHighlight, { width: "25%" }]}>{report.morphology.leftKidney.corticalThickness}</Text>
          <Text style={[styles.tableCell, { width: "15%" }]}>1.0–1.5 cm</Text>
        </View>
        <View style={styles.tableRowAlt}>
          <Text style={[styles.tableCell, { width: "35%" }]}>Parenchymal Echogenicity</Text>
          <Text style={[styles.tableCellHighlight, { width: "25%" }]}>{report.morphology.rightKidney.echogenicity}</Text>
          <Text style={[styles.tableCellHighlight, { width: "25%" }]}>{report.morphology.leftKidney.echogenicity}</Text>
          <Text style={[styles.tableCell, { width: "15%" }]}>Normal</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { width: "35%" }]}>CMD</Text>
          <Text style={[styles.tableCellHighlight, { width: "25%" }]}>{report.morphology.rightKidney.cmd}</Text>
          <Text style={[styles.tableCellHighlight, { width: "25%" }]}>{report.morphology.leftKidney.cmd}</Text>
          <Text style={[styles.tableCell, { width: "15%" }]}>Maintained</Text>
        </View>
        <View style={styles.tableRowAlt}>
          <Text style={[styles.tableCell, { width: "35%" }]}>Hydronephrosis</Text>
          <Text style={[styles.tableCellSuccess, { width: "25%" }]}>{report.morphology.rightKidney.hydronephrosis}</Text>
          <Text style={[styles.tableCellHighlight, { width: "25%" }]}>{report.morphology.leftKidney.hydronephrosis}</Text>
          <Text style={[styles.tableCell, { width: "15%" }]}>None</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { width: "35%" }]}>Stones Detected</Text>
          <Text style={[styles.tableCellSuccess, { width: "25%" }]}>{report.morphology.rightKidney.stones}</Text>
          <Text style={[styles.tableCellDanger, { width: "25%" }]}>{report.morphology.leftKidney.stones}</Text>
          <Text style={[styles.tableCell, { width: "15%" }]}>None</Text>
        </View>
        <View style={styles.tableRowAlt}>
          <Text style={[styles.tableCell, { width: "35%" }]}>Cysts</Text>
          <Text style={[styles.tableCellSuccess, { width: "25%" }]}>{report.morphology.rightKidney.cysts}</Text>
          <Text style={[styles.tableCellHighlight, { width: "25%" }]}>{report.morphology.leftKidney.cysts}</Text>
          <Text style={[styles.tableCell, { width: "15%" }]}>—</Text>
        </View>
      </View>
    </Section>

    <View style={styles.footer}>
      <Text style={styles.disclaimer}>
        Disclaimer: Healium Intelliscan AI does not replace ultrasound or any other anatomical imaging test. It is not intended for use by individuals for self-diagnosis or self-evaluation. This report requires clinical correlation and should be presented to a Qualified Healthcare Professional.
      </Text>
      <Text style={styles.pageNumber}>Page 1 of 4</Text>
    </View>
  </Page>
)

const Page2 = ({ report }: { report: Report }) => {
  const getBarStyle = (percentage: number) => {
    if (percentage >= 70) return styles.probBarHigh
    if (percentage >= 40) return styles.probBarMedium
    return styles.probBarLow
  }

  return (
    <Page size="A4" style={styles.page}>
      <Header report={report} />

      <Section title="Etiology Classification">
        <View>
          {report.etiologyClassification.map((etiology, index) => (
            <View key={index} style={styles.probRow}>
              <Text style={styles.probLabel}>{etiology.name}</Text>
              <View style={styles.probBarContainer}>
                <View style={[getBarStyle(etiology.percentage), { width: `${etiology.percentage}%` }]} />
              </View>
              <Text style={styles.probValue}>{etiology.percentage}%</Text>
              <Text style={styles.probConfidence}>{etiology.confidence}</Text>
            </View>
          ))}
        </View>
      </Section>

      <Section title="Structural Findings">
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { width: "20%" }]}>Finding</Text>
            <Text style={[styles.tableHeaderCell, { width: "15%" }]}>Status</Text>
            <Text style={[styles.tableHeaderCell, { width: "25%" }]}>Location</Text>
            <Text style={[styles.tableHeaderCell, { width: "40%" }]}>Clinical Significance</Text>
          </View>
          {report.structuralFindings.map((finding, index) => (
            <View key={index} style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
              <Text style={[styles.tableCell, { width: "20%" }]}>{finding.name}</Text>
              <Text style={[finding.present ? styles.tableCellHighlight : styles.tableCellSuccess, { width: "15%" }]}>
                {finding.status}
              </Text>
              <Text style={[styles.tableCell, { width: "25%" }]}>{finding.location}</Text>
              <Text style={[styles.tableCell, { width: "40%" }]}>{finding.clinicalSignificance}</Text>
            </View>
          ))}
        </View>
      </Section>

      <Section title="Stone Detection">
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { width: "10%" }]}>#</Text>
            <Text style={[styles.tableHeaderCell, { width: "30%" }]}>Location</Text>
            <Text style={[styles.tableHeaderCell, { width: "15%" }]}>Size</Text>
            <Text style={[styles.tableHeaderCell, { width: "15%" }]}>Confidence</Text>
            <Text style={[styles.tableHeaderCell, { width: "30%" }]}>Characteristics</Text>
          </View>
          {report.stoneDetection.stones.map((stone, index) => (
            <View key={index} style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
              <Text style={[styles.tableCell, { width: "10%" }]}>{stone.number}</Text>
              <Text style={[styles.tableCell, { width: "30%" }]}>{stone.location}</Text>
              <Text style={[styles.tableCell, { width: "15%" }]}>{stone.size}</Text>
              <Text style={[styles.tableCell, { width: "15%" }]}>{stone.confidence}%</Text>
              <Text style={[styles.tableCell, { width: "30%" }]}>{stone.characteristics}</Text>
            </View>
          ))}
        </View>
      </Section>

      <View style={styles.footer}>
        <Text style={styles.disclaimer}>
          Disclaimer: Healium Intelliscan AI does not replace ultrasound or any other anatomical imaging test.
        </Text>
        <Text style={styles.pageNumber}>Page 2 of 4</Text>
      </View>
    </Page>
  )
}

const Page3 = ({ report }: { report: Report }) => (
  <Page size="A4" style={styles.page}>
    <Header report={report} />

    <Section title="Clinical Impression">
      <View style={styles.impressionBox}>
        <Text style={styles.impressionTitle}>Right Kidney</Text>
        <Text style={styles.impressionText}>{report.clinicalImpression.rightKidney}</Text>
      </View>
      <View style={styles.impressionBox}>
        <Text style={styles.impressionTitle}>Left Kidney</Text>
        <Text style={styles.impressionText}>{report.clinicalImpression.leftKidney}</Text>
      </View>
      <View style={styles.impressionBox}>
        <Text style={styles.impressionTitle}>Overall Assessment</Text>
        <Text style={styles.impressionText}>{report.clinicalImpression.overall}</Text>
      </View>
    </Section>

    <Section title="Recommendations">
      <View>
        {report.recommendations.map((recommendation, index) => (
          <View key={index} style={styles.recommendationItem}>
            <View style={styles.recommendationBullet} />
            <Text style={styles.recommendationText}>{recommendation}</Text>
          </View>
        ))}
      </View>
    </Section>

    <View style={styles.signatureBlock}>
      <View style={styles.signatureContent}>
        <View style={styles.signatureLine} />
        <Text style={styles.signatureLabel}>Doctor&apos;s Signature &amp; Credentials</Text>
      </View>
    </View>

    <View style={styles.footer}>
      <Text style={styles.disclaimer}>
        Disclaimer: Healium Intelliscan AI does not replace ultrasound or any other anatomical imaging test.
      </Text>
      <Text style={styles.pageNumber}>Page 3 of 4</Text>
    </View>
  </Page>
)

const Page4 = ({ report }: { report: Report }) => (
  <Page size="A4" style={styles.page}>
    <Header report={report} />

    <Section title="Ultrasound Images">
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderCell, { width: "15%" }]}>Kidney</Text>
          <Text style={[styles.tableHeaderCell, { width: "20%" }]}>View</Text>
          <Text style={[styles.tableHeaderCell, { width: "25%" }]}>Dimensions</Text>
          <Text style={[styles.tableHeaderCell, { width: "40%" }]}>Notes</Text>
        </View>
        {report.images.map((image, index) => (
          <View key={index} style={index % 2 === 0 ? styles.tableRow : styles.tableRowAlt}>
            <Text style={[styles.tableCell, { width: "15%", textTransform: "capitalize" }]}>{image.kidney}</Text>
            <Text style={[styles.tableCell, { width: "20%" }]}>{image.view}</Text>
            <Text style={[styles.tableCell, { width: "25%" }]}>{image.dimensions}</Text>
            <Text style={[styles.tableCell, { width: "40%" }]}>{image.notes}</Text>
          </View>
        ))}
      </View>
    </Section>

    <View style={{ marginTop: "auto" }}>
      <View style={styles.impressionBox}>
        <Text style={styles.impressionTitle}>Report Information</Text>
        <View style={styles.infoGrid}>
          <InfoItem label="Report ID" value={report.reportId} />
          <InfoItem label="Generated At" value={report.generatedAt} />
          <InfoItem label="Hospital" value={report.hospitalName} />
        </View>
      </View>
    </View>

    <View style={styles.footer}>
      <Text style={styles.disclaimer}>
        Disclaimer: Healium Intelliscan AI does not replace ultrasound or any other anatomical imaging test. It is not intended for use by individuals for self-diagnosis or self-evaluation. This report requires clinical correlation and should be presented to a Qualified Healthcare Professional to determine the nature of appropriate follow-up and course of action/evaluation.
      </Text>
      <Text style={styles.pageNumber}>Page 4 of 4</Text>
    </View>
  </Page>
)

const KidneyReportDocument = ({ report }: { report: Report }) => (
  <Document>
    <Page1 report={report} />
    <Page2 report={report} />
    <Page3 report={report} />
    <Page4 report={report} />
  </Document>
)

export async function generatePDFBuffer(report: Report): Promise<Buffer> {
  const buffer = await renderToBuffer(<KidneyReportDocument report={report} />)
  return Buffer.from(buffer)
}
