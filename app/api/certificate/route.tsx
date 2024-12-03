import { NextResponse } from 'next/server';
import { AssessmentResult } from '@/lib/types';
import { renderToBuffer } from '@react-pdf/renderer/lib/react-pdf.browser.cjs.js';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';

// Register a fallback font
Font.register({
  family: 'Open Sans',
  fonts: [
    { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf' },
    { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-600.ttf', fontWeight: 600 },
    { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-700.ttf', fontWeight: 700 },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 50,
    backgroundColor: '#ffffff',
    fontFamily: 'Open Sans',
  },
  container: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#2563eb',
    borderStyle: 'solid',
    padding: 40,
    position: 'relative',
  },
  header: {
    marginBottom: 40,
    textAlign: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 700,
    color: '#1e3a8a',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 18,
    color: '#4b5563',
    marginBottom: 30,
    fontStyle: 'italic',
  },
  content: {
    marginBottom: 40,
    textAlign: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 700,
    color: '#1e3a8a',
    marginVertical: 20,
  },
  text: {
    fontSize: 14,
    marginBottom: 10,
    color: '#374151',
  },
  score: {
    fontSize: 20,
    fontWeight: 600,
    color: '#2563eb',
    marginVertical: 15,
  },
  points: {
    backgroundColor: '#f3f4f6',
    padding: 20,
    marginVertical: 20,
    borderRadius: 4,
  },
  pointsText: {
    fontSize: 16,
    fontWeight: 600,
    color: '#2563eb',
    marginBottom: 8,
  },
  footer: {
    marginTop: 'auto',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 20,
    textAlign: 'center',
  },
  footerText: {
    fontSize: 10,
    color: '#6b7280',
    marginBottom: 5,
  },
  watermark: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%) rotate(-45deg)',
    fontSize: 100,
    opacity: 0.05,
    color: '#2563eb',
  },
});

const CertificateDocument = ({ result }: { result: AssessmentResult }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.container}>
        <Text style={styles.watermark}>CERTIFIED</Text>
        
        <View style={styles.header}>
          <Text style={styles.title}>Certificate of Achievement</Text>
          <Text style={styles.subtitle}>{result.topic}</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.text}>This is to certify that</Text>
          <Text style={styles.name}>
            {result.userInfo.firstName} {result.userInfo.lastName}
          </Text>
          <Text style={styles.text}>
            has successfully completed the assessment with distinction
          </Text>
          <Text style={styles.score}>
            Score: {(result.score * 100).toFixed(0)}%
          </Text>

          <View style={styles.points}>
            <Text style={styles.pointsText}>
              {result.learningOutcome.kiuAllocation} AiCE Points
            </Text>
            <Text style={styles.pointsText}>
              {result.learningOutcome.cpdPoints} Hours CPD/CME
            </Text>
            <Text style={styles.text}>
              ({result.learningOutcome.academicLevel} Level)
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Issued on: {new Date(result.date).toLocaleDateString()}
          </Text>
          <Text style={styles.footerText}>
            Certificate ID: {result.certificateId}
          </Text>
          <Text style={styles.footerText}>
            Verify this certificate at: verify.aice.education
          </Text>
        </View>
      </View>
    </Page>
  </Document>
);

export async function POST(request: Request) {
  try {
    const result: AssessmentResult = await request.json();
    
    const pdfBuffer = await renderToBuffer(
      <CertificateDocument result={result} />
    );

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="certificate-${result.certificateId}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Certificate generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate certificate' },
      { status: 500 }
    );
  }
}