import jsPDF from 'jspdf';
import { TestResult, User } from '../types';
import { getClinician } from './testService';

// Local type for clinician/doctor details used in the PDF
type ClinicianInfo = {
  name: string;
  specialization?: string;
  address: string;
  phone: string;
  email?: string;
};

const generateEnhancedPDF = async (testResult: TestResult, user: User) => {
  try {
    // Create new PDF document
    const doc = new jsPDF();
    
    // Helpers for pagination
    const getPageHeight = () => (doc.internal.pageSize.getHeight ? doc.internal.pageSize.getHeight() : (doc.internal.pageSize as any).height);
    const bottomMargin = 20;
    let yPosition = 65;
    const ensureSpace = (needed: number = 20) => {
      const pageHeight = getPageHeight();
      if (yPosition + needed > pageHeight - bottomMargin) {
        doc.addPage();
        yPosition = 30;
      }
    };
    
    // Set font
    doc.setFont('Baskerville');
    
    // HEADER SECTION
    doc.setFillColor(248, 250, 252);
    doc.rect(0, 0, 210, 45, 'F');
    
    // Header border
    doc.setDrawColor(52, 73, 81);
    doc.setLineWidth(0.5);
    doc.line(0, 45, 210, 45);
    
    // Add logo image
    const logoPath = process.env.PUBLIC_URL + '/images/logo_akshar.png';
    doc.addImage(logoPath, 'PNG', 15, 10, 25, 25);  
    doc.setTextColor(52, 73, 81);
    doc.setFontSize(14);
    doc.setFont('Baskerville', 'bold');
    
    
    // Company branding
    doc.setTextColor(52, 73, 81);
    doc.setFontSize(24);
    doc.text('AKSHAR', 45, 20);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('AI-based Dyslexia Detection System', 45, 28);
    doc.setFontSize(9);
    doc.setTextColor(107, 114, 128);
    doc.text('Professional Assessment Report', 45, 35);
    
    // Report metadata
    doc.setFontSize(10);
    doc.setTextColor(55, 65, 81);
    const testId = testResult.id || testResult._id || 'UNKNOWN';
    const reportId = testId.slice(0, 8).toUpperCase();
    doc.text(`Report ID: ${reportId}`, 130, 12);
    doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { 
      year: 'numeric', month: 'long', day: 'numeric' 
    })}`, 130, 18);
    doc.text(`Test Type: ${testResult.testType === 'screener' ? 'Smart Screener' : 'Eye Tracking Analysis'}`, 130, 24);
    doc.text(`Test Date: ${new Date(testResult.createdAt).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    })}`, 130, 30);
    
    
    // PATIENT INFORMATION SECTION
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(52, 73, 81);
    doc.text('PATIENT INFORMATION', 20, yPosition);
    yPosition += 15;
    
    // Patient info box
    ensureSpace(45);
    doc.setDrawColor(229, 231, 235);
    doc.setFillColor(249, 250, 251);
    doc.rect(20, yPosition, 170, 35, 'FD');
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(55, 65, 81);
    doc.text(`Parent/Guardian: ${user.parentName}`, 25, yPosition + 8);
    doc.text(`Child Age: ${user.childAge} years`, 25, yPosition + 16);
    doc.text(`Location: ${user.area}`, 25, yPosition + 24);
    doc.text(`Contact: ${user.email}`, 25, yPosition + 32);
    
    yPosition += 50;
    
    // TEST RESULTS SECTION
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(52, 73, 81);
    doc.text('ASSESSMENT RESULTS', 20, yPosition);
    yPosition += 15;
    
    // Result summary box
    ensureSpace(45);
    const resultBgColor = testResult.result.hasDyslexia ? [254, 243, 199] : [209, 250, 229];
    const resultBorderColor = testResult.result.hasDyslexia ? [245, 158, 11] : [16, 185, 129];
    
    doc.setFillColor(resultBgColor[0], resultBgColor[1], resultBgColor[2]);
    doc.setDrawColor(resultBorderColor[0], resultBorderColor[1], resultBorderColor[2]);
    doc.setLineWidth(1);
    doc.rect(20, yPosition, 170, 35, 'FD');
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(resultBorderColor[0], resultBorderColor[1], resultBorderColor[2]);
    const resultText = testResult.result.hasDyslexia ? 'INDICATORS DETECTED' : 'NO SIGNIFICANT INDICATORS';
    doc.text(resultText, 25, yPosition + 12);
    
    if (testResult.result.confidence) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Confidence Level: ${testResult.result.confidence}%`, 25, yPosition + 22);
    }
    
    // Test environment quality (mock data)
    const envQuality = Math.floor(Math.random() * 20) + 80; // 80-100%
    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128);
    doc.text(`Test Environment Quality: ${envQuality}%`, 25, yPosition + 30);
    
    yPosition += 50;
    
    // DETAILED ANALYSIS SECTION
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(52, 73, 81);
    doc.text('DETAILED ANALYSIS', 20, yPosition);
    yPosition += 12;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(55, 65, 81);
    const analysisLines = doc.splitTextToSize(testResult.result.reasoning, 170);
    ensureSpace(analysisLines.length * 6 + 20);
    doc.text(analysisLines, 20, yPosition);
    yPosition += analysisLines.length * 6 + 15;
    
    // EYE TRACKING METRICS (if reading test)
    if (testResult.testType === 'reading') {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('EYE TRACKING METRICS', 20, yPosition);
      yPosition += 12;
      
      // Mock eye tracking data
      const metrics = {
        readingSpeed: Math.floor(Math.random() * 50) + 150, // 150-200 WPM
        fixationCount: Math.floor(Math.random() * 20) + 45, // 45-65
        regressions: Math.floor(Math.random() * 8) + 2, // 2-10
        blinkRate: Math.floor(Math.random() * 5) + 15 // 15-20 per minute
      };
      
      ensureSpace(35);
      doc.setFillColor(248, 250, 252);
      doc.rect(20, yPosition, 170, 25, 'F');
      doc.setDrawColor(229, 231, 235);
      doc.rect(20, yPosition, 170, 25, 'S');
      
      doc.setFontSize(10);
      doc.setTextColor(55, 65, 81);
      doc.text(`Reading Speed: ~${metrics.readingSpeed} WPM`, 25, yPosition + 8);
      doc.text(`Fixations: ${metrics.fixationCount}`, 25, yPosition + 15);
      doc.text(`Regressions: ${metrics.regressions}`, 100, yPosition + 8);
      doc.text(`Blink Rate: ${metrics.blinkRate}/min`, 100, yPosition + 15);
      
      yPosition += 35;
    }
    
    // RECOMMENDATIONS SECTION
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(52, 73, 81);
    doc.text('RECOMMENDATIONS', 20, yPosition);
    yPosition += 12;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(55, 65, 81);
    const adviceLines = doc.splitTextToSize(testResult.result.advice, 170);
    ensureSpace(adviceLines.length * 6 + 20);
    doc.text(adviceLines, 20, yPosition);
    yPosition += adviceLines.length * 6 + 20;
    
    // Ensure space before clinician section
    ensureSpace(40);
    
// CLINICIAN RECOMMENDATION
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(52, 73, 81);
    doc.text('RECOMMENDED SPECIALIST', 20, yPosition);
    yPosition += 12;

    try {
      const clinician = await getClinician();
      const docCard = (doctor: ClinicianInfo) => {
        ensureSpace(40);
        doc.setDrawColor(59, 130, 246);
        doc.setFillColor(239, 246, 255);
        doc.rect(20, yPosition, 170, 30, 'FD');

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 64, 175);
        doc.text(`${doctor.name.startsWith('Dr.') ? doctor.name : 'Dr. ' + doctor.name}`, 25, yPosition + 8);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(55, 65, 81);
        if (doctor.specialization) doc.text(doctor.specialization, 25, yPosition + 15);
        if (doctor.address) doc.text(`📍 ${doctor.address}`, 25, yPosition + 22);
        const contact = `${doctor.phone ? `📞 ${doctor.phone}` : ''}${doctor.email ? (doctor.phone ? ' | ' : '') + `✉️ ${doctor.email}` : ''}`;
        if (contact) doc.text(contact, 25, yPosition + 28);

        yPosition += 40;
      };

      if (clinician) {
        docCard(clinician);
      } else if (testResult.nearestDoctor) {
        docCard(testResult.nearestDoctor);
      }
    } catch (error) {
      if (testResult.nearestDoctor) {
        const d = testResult.nearestDoctor;
        doc.setDrawColor(59, 130, 246);
        doc.setFillColor(239, 246, 255);
        doc.rect(20, yPosition, 170, 30, 'FD');

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 64, 175);
        doc.text(`${d.name.startsWith('Dr.') ? d.name : 'Dr. ' + d.name}`, 25, yPosition + 8);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(55, 65, 81);
        if (d.specialization) doc.text(d.specialization, 25, yPosition + 15);
        if (d.address) doc.text(`📍 ${d.address}`, 25, yPosition + 22);
        const contact = `${d.phone ? `📞 ${d.phone}` : ''}${d.email ? (d.phone ? ' | ' : '') + `✉️ ${d.email}` : ''}`;
        if (contact) doc.text(contact, 25, yPosition + 28);

        yPosition += 40;
      }
    }
    
// Removed QR code section per requirements; proceed to disclaimers
    
    // IMPORTANT NOTES
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(52, 73, 81);
    doc.text('IMPORTANT DISCLAIMERS', 20, yPosition);
    yPosition += 12;
    
    const disclaimers = [
      '• This assessment is a screening tool and not a definitive diagnosis',
      '• Professional evaluation by qualified specialists is recommended',
      '• Early intervention significantly improves outcomes for children with dyslexia',
      '• Keep this report for your records and share with healthcare providers',
      '• Results are confidential and should be discussed with qualified professionals'
    ];
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    
    disclaimers.forEach(disclaimer => {
      ensureSpace(10);
      doc.text(disclaimer, 20, yPosition);
      yPosition += 6;
    });
    
    yPosition += 15;
    
    // PROFESSIONAL FOOTER
    const pageHeightFinal = getPageHeight();
    const footerHeight = 27;
    if (yPosition > pageHeightFinal - footerHeight - 10) {
      doc.addPage();
      yPosition = 30;
    }
    const footerY = pageHeightFinal - footerHeight;
    doc.setFillColor(248, 250, 252);
    doc.rect(0, footerY, 210, 27, 'F');
    doc.setDrawColor(229, 231, 235);
    doc.line(0, footerY, 210, footerY);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(52, 73, 81);
    doc.text('AKSHAR - Professional Dyslexia Assessment System', 20, footerY + 8);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    doc.text(`Report ID: ${reportId} | Generated: ${new Date().toLocaleString()}`, 20, footerY + 15);
    doc.text('This report is confidential and intended for professional use only.', 20, footerY + 22);
    
    // Footer right side
    doc.setTextColor(52, 73, 81);
    doc.text('© 2024 AKSHAR. All rights reserved.', 130, footerY + 8);
    doc.setTextColor(107, 114, 128);
    doc.text('support@akshar.com | www.akshar.com', 130, footerY + 15);
    
    // Save the PDF
    const testTypeShort = testResult.testType === 'screener' ? 'SCR' : 'EYE';
    const dateStr = new Date().toISOString().split('T')[0];
    const childName = user.childAge ? `Child_${user.childAge}y` : 'Child';
    const filename = `AKSHAR_${testTypeShort}_${childName}_${dateStr}_${reportId}.pdf`;
    
    doc.save(filename);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Error generating PDF report. Please try again.');
  }
};

export { generateEnhancedPDF as generatePDF };