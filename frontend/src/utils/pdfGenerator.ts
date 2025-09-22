import jsPDF from 'jspdf';
import { TestResult, User } from '../types';
import { getClinician } from './testService';

// Helper to fetch image as base64
const getBase64ImageFromUrl = async (url: string): Promise<string> => {
  const res = await fetch(url);
  const blob = await res.blob();
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const generatePDF = async (testResult: TestResult, user: User) => {
  try {
    const doc = new jsPDF();

    // Pagination helpers
    const getPageHeight = () => (doc.internal.pageSize.getHeight ? doc.internal.pageSize.getHeight() : (doc.internal.pageSize as any).height);
    const bottomMargin = 20;
    let yPosition = 60; // moved into helper control
    const ensureSpace = (needed: number = 20) => {
      const pageHeight = getPageHeight();
      if (yPosition + needed > pageHeight - bottomMargin) {
        doc.addPage();
        yPosition = 30;
      }
    };

    // Header background
    doc.setFillColor(52, 73, 81); // dark gray
    doc.rect(0, 0, 210, 40, 'F');

    // Left side: title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('AKSHAR', 20, 25);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('AI-based Dyslexia Detection System', 20, 32);

    // Right side: logo
    try {
      const logo = await getBase64ImageFromUrl('/images/logo_akshar.png');
      doc.addImage(logo, 'PNG', 160, 8, 35, 25); // X, Y, width, height
    } catch (err) {
      console.error('Failed to load logo for PDF:', err);
    }

    // Header metadata
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 150, 45);
    doc.text(
      `Test Type: ${testResult.testType === 'screener' ? 'Smart Screener' : 'Eye Tracking Analysis'}`,
      150,
      50
    );
    doc.text(`Test Date: ${new Date(testResult.createdAt).toLocaleDateString()}`, 150, 55);

    
    // Patient Info
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('PATIENT INFORMATION', 20, yPosition);
    yPosition += 10;

    ensureSpace(30);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Parent/Guardian: ${user.parentName}`, 20, yPosition);
    yPosition += 8;
    doc.text(`Child Age: ${user.childAge} years`, 20, yPosition);
    yPosition += 8;
    doc.text(`Location: ${user.area}`, 20, yPosition);
    yPosition += 8;
    doc.text(`Email: ${user.email}`, 20, yPosition);
    yPosition += 20;

    // Test Results
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('TEST RESULTS', 20, yPosition);
    yPosition += 10;

    ensureSpace(40);

    const resultColor = testResult.result.hasDyslexia ? [254, 243, 199] : [209, 250, 229];
    doc.setFillColor(resultColor[0], resultColor[1], resultColor[2]);
    doc.rect(20, yPosition, 170, 30, 'F');
    doc.rect(20, yPosition, 170, 30, 'S'); // Border

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(
      testResult.result.hasDyslexia ? 'INDICATORS DETECTED' : 'NO INDICATORS DETECTED',
      25,
      yPosition + 12
    );

    if (testResult.result.confidence) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Confidence Level: ${testResult.result.confidence}%`, 25, yPosition + 22);
    }
    yPosition += 45;

    // Analysis
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('DETAILED ANALYSIS', 20, yPosition);
    yPosition += 10;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const reasoningLines = doc.splitTextToSize(testResult.result.reasoning, 170);
    ensureSpace(reasoningLines.length * 6 + 20);
    doc.text(reasoningLines, 20, yPosition);
    yPosition += reasoningLines.length * 6 + 10;

    // Recommendations
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('RECOMMENDATIONS', 20, yPosition);
    yPosition += 10;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const adviceLines = doc.splitTextToSize(testResult.result.advice, 170);
    ensureSpace(adviceLines.length * 6 + 20);
    doc.text(adviceLines, 20, yPosition);
    yPosition += adviceLines.length * 6 + 15;

// Specialist
try {
  let specialist = testResult.nearestDoctor || await getClinician();
  if (specialist) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('RECOMMENDED SPECIALIST', 20, yPosition);
    yPosition += 10;

    ensureSpace(40);

    doc.setFillColor(248, 250, 252);
    doc.rect(20, yPosition, 170, 30, 'F');
    doc.rect(20, yPosition, 170, 30, 'S');

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    const nameText = specialist.name.startsWith('Dr.') ? specialist.name : `Dr. ${specialist.name}`;
    doc.text(nameText, 25, yPosition + 8);
    doc.setFont('helvetica', 'normal');
    if (specialist.specialization) doc.text(`${specialist.specialization}`, 25, yPosition + 15);
    doc.text(`Address: ${specialist.address}`, 25, yPosition + 22);
    const contact = `${specialist.phone ? `Phone: ${specialist.phone}` : ''}${specialist.email ? (specialist.phone ? ' | ' : '') + `Email: ${specialist.email}` : ''}`;
    if (contact) doc.text(contact, 25, yPosition + 29);
    yPosition += 45;
  }
} catch (e) {
  // ignore if clinician endpoint unavailable
}

    // Notes
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('IMPORTANT NOTES', 20, yPosition);
    yPosition += 10;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const notes = [
      '• This assessment is a screening tool and not a definitive diagnosis.',
      '• Please consult with a qualified healthcare professional for comprehensive evaluation.',
      '• Early intervention can significantly improve outcomes for children with dyslexia.',
      '• Keep this report for your records and share with healthcare providers as needed.'
    ];
    notes.forEach(note => {
      doc.text(note, 20, yPosition);
      yPosition += 6;
    });
    yPosition += 15;

    // Footer at bottom of page
    const pageHeightFinal = getPageHeight();
    const footerHeight = 25;
    if (yPosition > pageHeightFinal - footerHeight - 10) {
      doc.addPage();
      yPosition = 30;
    }
    const footerY = pageHeightFinal - footerHeight;
    doc.setFillColor(248, 250, 252);
    doc.rect(0, footerY, 210, footerHeight, 'F');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text('This report was generated by AKSHAR - AI-based Dyslexia Detection System', 20, footerY + 8);
    const testId = testResult.id || testResult._id || 'UNKNOWN';
    doc.text(`Report ID: ${testId}`, 20, footerY + 15);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, footerY + 22);
    doc.text('© 2024 AKSHAR. All rights reserved.', 150, footerY + 15);

    // Save PDF
    const filename = `AKSHAR_Report_${user.parentName.replace(/\s+/g, '_')}_${new Date()
      .toISOString()
      .split('T')[0]}.pdf`;
    doc.save(filename);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Error generating PDF report. Please try again.');
  }
};

export { generatePDF };
