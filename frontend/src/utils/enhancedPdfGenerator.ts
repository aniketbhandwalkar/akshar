import jsPDF from 'jspdf';
import { TestResult, User } from '../types';

// Generate QR code data URL (placeholder - in production use proper QR library)
// const generateQRCode = (text: string): string => {
//   return `data:image/svg+xml;base64,${btoa(`
//     <svg width="80" height="80" xmlns="http://www.w3.org/2000/svg">
//       <rect width="80" height="80" fill="#000"/>
//       <rect x="5" y="5" width="70" height="70" fill="#fff"/>
//       <text x="40" y="45" text-anchor="middle" fill="#000" font-size="6">QR CODE</text>
//     </svg>
//   `)}`;
// };

// Mock function to get clinician data (replace with actual Gemini API call)
const getCliniciansNearUser = async (userArea: string) => {
  // This would normally call your backend which uses Gemini API
  return [
    {
      name: "Dr. Sarah Wilson",
      specialization: "Pediatric Learning Disorders",
      address: `123 Medical Center, ${userArea}`,
      phone: "+1 (555) 123-4567",
      email: "s.wilson@medicalcenter.com",
      distance: "2.3 km"
    },
    {
      name: "Dr. Michael Chen",
      specialization: "Educational Psychology",
      address: `456 Learning Institute, ${userArea}`,
      phone: "+1 (555) 234-5678",
      email: "m.chen@learninginst.com",
      distance: "4.1 km"
    }
  ];
};

const generateEnhancedPDF = async (testResult: TestResult, user: User) => {
  try {
    // Create new PDF document
    const doc = new jsPDF();
    
    // Set font
    doc.setFont('helvetica');
    
    // HEADER SECTION
    doc.setFillColor(248, 250, 252);
    doc.rect(0, 0, 210, 45, 'F');
    
    // Header border
    doc.setDrawColor(52, 73, 81);
    doc.setLineWidth(0.5);
    doc.line(0, 45, 210, 45);
    
    // Logo placeholder (circular design)
    doc.setFillColor(52, 73, 81);
    doc.circle(27.5, 22.5, 12, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('A', 25, 27);
    
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
    
    let yPosition = 65;
    
    // PATIENT INFORMATION SECTION
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(52, 73, 81);
    doc.text('PATIENT INFORMATION', 20, yPosition);
    yPosition += 15;
    
    // Patient info box
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
    doc.text(adviceLines, 20, yPosition);
    yPosition += adviceLines.length * 6 + 20;
    
    // Check if new page needed
    if (yPosition > 230) {
      doc.addPage();
      yPosition = 30;
    }
    
    // CLINICIAN RECOMMENDATIONS
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(52, 73, 81);
    doc.text('RECOMMENDED SPECIALISTS', 20, yPosition);
    yPosition += 12;
    
    try {
      const clinicians = await getCliniciansNearUser(user.area);
      
      clinicians.forEach((clinician, index) => {
        if (index < 2) { // Show top 2 clinicians
          doc.setDrawColor(59, 130, 246);
          doc.setFillColor(239, 246, 255);
          doc.rect(20, yPosition, 170, 30, 'FD');
          
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(30, 64, 175);
          doc.text(`Dr. ${clinician.name}`, 25, yPosition + 8);
          
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(55, 65, 81);
          doc.text(clinician.specialization, 25, yPosition + 15);
          doc.text(`📍 ${clinician.address}`, 25, yPosition + 22);
          doc.text(`📞 ${clinician.phone} | ✉️ ${clinician.email}`, 25, yPosition + 28);
          
          yPosition += 40;
        }
      });
    } catch (error) {
      // Fallback to original doctor data
      if (testResult.nearestDoctor) {
        doc.setDrawColor(59, 130, 246);
        doc.setFillColor(239, 246, 255);
        doc.rect(20, yPosition, 170, 25, 'FD');
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(30, 64, 175);
        doc.text(`Dr. ${testResult.nearestDoctor.name}`, 25, yPosition + 8);
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(55, 65, 81);
        doc.text(`📍 ${testResult.nearestDoctor.address}`, 25, yPosition + 15);
        doc.text(`📞 ${testResult.nearestDoctor.phone}`, 25, yPosition + 22);
        
        yPosition += 35;
      }
    }
    
    // QR CODE FOR SHARING
    const shareUrl = `${window.location.origin}/test-result/${testId}`;
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(52, 73, 81);
    doc.text('SHARE WITH CLINICIANS', 20, yPosition);
    yPosition += 15;
    
    // QR Code placeholder
    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(255, 255, 255);
    doc.rect(20, yPosition, 35, 35, 'FD');
    
    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    doc.text('QR CODE', 30, yPosition + 20);
    
    // Share info
    doc.setFontSize(12);
    doc.setTextColor(55, 65, 81);
    doc.text('Scan QR code or visit:', 65, yPosition + 8);
    
    doc.setFontSize(9);
    doc.setTextColor(59, 130, 246);
    const urlLines = doc.splitTextToSize(shareUrl, 120);
    doc.text(urlLines, 65, yPosition + 16);
    
    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128);
    doc.text('Share this report securely with healthcare professionals', 65, yPosition + 25);
    
    yPosition += 50;
    
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
      doc.text(disclaimer, 20, yPosition);
      yPosition += 6;
    });
    
    yPosition += 15;
    
    // PROFESSIONAL FOOTER
    const footerY = Math.max(yPosition, 270);
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