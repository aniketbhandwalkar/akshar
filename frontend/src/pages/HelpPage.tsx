import React, { useState } from 'react';
import styled from 'styled-components';
import Navbar from '../components/Navbar';
import {
  Container,
  Title,
  Card,
  GlobalStyles
} from '../components/shared/EnhancedStyledComponents';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const HeroSection = styled.section`
  padding: 120px 0 80px;
  background: white;
  margin-top: 80px;
`;

const ContentSection = styled.section`
  padding: 80px 0;
  background: #f8fafc;
`;

const HelpContainer = styled(Container)`
  max-width: 1200px;
`;

const SectionTitle = styled(Title)`
  text-align: center;
  font-size: 3rem;
  font-family: 'Baskerville', serif;
  color: #2d3748;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

const SubTitle = styled.h2`
  text-align: center;
  font-size: 1.5rem;
  color: #4a5568;
  margin-bottom: 60px;
  font-weight: 400;
  line-height: 1.6;
`;

const TableOfContents = styled(Card)`
  margin-bottom: 60px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  
  h3 {
    color: white;
    margin-bottom: 20px;
    font-size: 1.5rem;
    font-family: 'Baskerville', serif;
  }
`;

const TOCList = styled.ul`
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 12px;
`;

const TOCItem = styled.li`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 12px 16px;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateX(5px);
  }
  
  a {
    color: white;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 500;
    
    &:hover {
      text-decoration: none;
    }
  }
`;

const AccessibilityControls = styled.div`
  position: fixed;
  top: 120px;
  right: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 16px;
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 8px;
  
  @media (max-width: 768px) {
    position: relative;
    top: 0;
    right: 0;
    margin: 20px 0;
  }
`;

const AccessibilityButton = styled.button`
  background: #667eea;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &:hover {
    background: #764ba2;
    transform: scale(1.02);
  }
`;

const HelpSection = styled(Card)`
  margin-bottom: 40px;
  
  h2 {
    color: #2d3748;
    font-size: 2rem;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 12px;
    font-family: 'Baskerville', serif;
  }
  
  h3 {
    color: #4a5568;
    font-size: 1.4rem;
    margin: 30px 0 15px 0;
    font-family: 'Baskerville', serif;
  }
  
  p {
    font-size: 1.1rem;
    line-height: 1.7;
    color: #2d3748;
    margin-bottom: 16px;
  }
  
  ul, ol {
    margin: 16px 0;
    padding-left: 24px;
    
    li {
      margin: 8px 0;
      line-height: 1.6;
    }
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  margin: 30px 0;
`;

const FeatureCard = styled(Card)`
  text-align: center;
  padding: 30px 24px;
  background: white;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
  }
  
  .icon {
    font-size: 2.5rem;
    color: #667eea;
    margin-bottom: 16px;
  }
  
  h4 {
    color: #2d3748;
    font-size: 1.2rem;
    margin-bottom: 12px;
    font-family: 'Baskerville', serif;
  }
  
  p {
    color: #4a5568;
    font-size: 0.95rem;
    line-height: 1.5;
  }
`;

const StepList = styled.ol`
  list-style: none;
  padding: 0;
  counter-reset: step-counter;
`;

const StepItem = styled.li`
  counter-increment: step-counter;
  background: #f8fafc;
  margin: 16px 0;
  padding: 20px;
  border-radius: 12px;
  border-left: 4px solid #667eea;
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  
  &::before {
    content: counter(step-counter);
    background: #667eea;
    color: white;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 0.9rem;
    flex-shrink: 0;
  }
  
  div {
    strong {
      color: #2d3748;
      display: block;
      margin-bottom: 8px;
    }
  }
`;

const AlertBox = styled.div<{ type?: 'info' | 'warning' | 'success' | 'error' }>`
  padding: 16px 20px;
  border-radius: 12px;
  margin: 20px 0;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  
  .icon {
    font-size: 1.25rem;
    margin-top: 2px;
  }
  
  ${props => {
    switch (props.type) {
      case 'warning':
        return `
          background: #fef3c7;
          color: #92400e;
          border-left: 4px solid #f59e0b;
        `;
      case 'success':
        return `
          background: #d1fae5;
          color: #065f46;
          border-left: 4px solid #10b981;
        `;
      case 'error':
        return `
          background: #fee2e2;
          color: #991b1b;
          border-left: 4px solid #ef4444;
        `;
      default:
        return `
          background: #dbeafe;
          color: #1e40af;
          border-left: 4px solid #3b82f6;
        `;
    }
  }}
`;


interface HelpPageProps {}

const HelpPage: React.FC<HelpPageProps> = () => {
  const [dyslexiaMode, setDyslexiaMode] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [readingMode, setReadingMode] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const toggleDyslexiaFont = () => {
    setDyslexiaMode(!dyslexiaMode);
    document.body.style.fontFamily = !dyslexiaMode 
      ? "'OpenDyslexic', Arial, sans-serif" 
      : "'Inter', sans-serif";
  };

  const adjustFontSize = (increase: boolean) => {
    const newSize = increase ? Math.min(fontSize + 2, 24) : Math.max(fontSize - 2, 12);
    setFontSize(newSize);
    document.body.style.fontSize = `${newSize}px`;
  };

  const toggleReadingMode = () => {
    setReadingMode(!readingMode);
    document.body.style.backgroundColor = !readingMode ? '#f5f5dc' : '';
    document.body.style.color = !readingMode ? '#2c3e50' : '';
  };

  return (
    <PageContainer style={{ fontFamily: dyslexiaMode ? "'OpenDyslexic', Arial, sans-serif" : "'Inter', sans-serif" }}>
      <GlobalStyles />
      <Navbar showAuthButtons={true} />

      {/* Accessibility Controls */}
      <AccessibilityControls>
        <AccessibilityButton onClick={toggleDyslexiaFont} title="Toggle Dyslexia-Friendly Font">
          🔤 Dyslexia Font
        </AccessibilityButton>
        <AccessibilityButton onClick={toggleReadingMode} title="Toggle Reading Comfort">
          👁️ Reading Mode
        </AccessibilityButton>
        <AccessibilityButton onClick={() => adjustFontSize(true)} title="Increase Font Size">
          🔍 A+
        </AccessibilityButton>
        <AccessibilityButton onClick={() => adjustFontSize(false)} title="Decrease Font Size">
          🔍 A-
        </AccessibilityButton>
      </AccessibilityControls>

      <HeroSection>
        <HelpContainer>
          <SectionTitle>Help & User Guide</SectionTitle>
          <SubTitle>
            Everything you need to know about using AKSHAR's dyslexia detection system
          </SubTitle>
          
          {/* Table of Contents */}
          <TableOfContents>
            <h3>📋 Quick Navigation</h3>
            <TOCList>
              <TOCItem onClick={() => scrollToSection('getting-started')}>
                <a href="#getting-started">🚀 Getting Started</a>
              </TOCItem>
              <TOCItem onClick={() => scrollToSection('camera-setup')}>
                <a href="#camera-setup">📷 Camera Setup</a>
              </TOCItem>
              <TOCItem onClick={() => scrollToSection('calibration')}>
                <a href="#calibration">🎯 Calibration</a>
              </TOCItem>
              <TOCItem onClick={() => scrollToSection('assessment')}>
                <a href="#assessment">📖 Assessment Process</a>
              </TOCItem>
              <TOCItem onClick={() => scrollToSection('tracking')}>
                <a href="#tracking">📊 Live Tracking</a>
              </TOCItem>
              <TOCItem onClick={() => scrollToSection('reports')}>
                <a href="#reports">📄 Reports & Analytics</a>
              </TOCItem>
              <TOCItem onClick={() => scrollToSection('accessibility')}>
                <a href="#accessibility">♿ Accessibility</a>
              </TOCItem>
              <TOCItem onClick={() => scrollToSection('troubleshooting')}>
                <a href="#troubleshooting">🔧 Troubleshooting</a>
              </TOCItem>
              <TOCItem onClick={() => scrollToSection('support')}>
                <a href="#support">💬 Support</a>
              </TOCItem>
            </TOCList>
          </TableOfContents>
        </HelpContainer>
      </HeroSection>

      <ContentSection>
        <HelpContainer>
          {/* Getting Started */}
          <HelpSection id="getting-started">
            <h2>🚀 Getting Started</h2>
            <p>
              Welcome to AKSHAR, a comprehensive dyslexia detection system that uses advanced facial tracking 
              and reading analysis to assess reading difficulties. This guide will walk you through all features 
              and functionalities.
            </p>
            
            <AlertBox type="info">
              <span className="icon">ℹ️</span>
              <div>
                <strong>System Requirements:</strong> Modern web browser with camera access, stable internet 
                connection, and adequate lighting for facial tracking.
              </div>
            </AlertBox>

            <h3>Key Features Overview</h3>
            <FeatureGrid>
              <FeatureCard>
                <div className="icon">📹</div>
                <h4>Camera Integration</h4>
                <p>Seamless camera setup with automatic detection and quality verification for optimal tracking performance.</p>
              </FeatureCard>
              <FeatureCard>
                <div className="icon">🎯</div>
                <h4>Visual Calibration</h4>
                <p>Advanced calibration system with quality scoring to ensure accurate facial tracking during assessments.</p>
              </FeatureCard>
              <FeatureCard>
                <div className="icon">📈</div>
                <h4>Live Tracking</h4>
                <p>Real-time confidence meter showing tracking quality and reading pattern analysis during assessments.</p>
              </FeatureCard>
              
            </FeatureGrid>
          </HelpSection>

          {/* Camera Setup */}
          <HelpSection id="camera-setup">
            <h2>📷 Camera Setup & Onboarding</h2>
            <p>
              The camera setup process is designed to be seamless and user-friendly, ensuring optimal 
              performance for facial tracking during assessments.
            </p>

            <h3>Setup Process</h3>
            <StepList>
              <StepItem>
                <div>
                  <strong>Camera Permission:</strong>
                  Grant camera access when prompted by your browser. This is essential for facial tracking functionality.
                </div>
              </StepItem>
              <StepItem>
                <div>
                  <strong>Device Detection:</strong>
                  The system automatically detects available cameras. Select your preferred camera from the dropdown if multiple options are available.
                </div>
              </StepItem>
              <StepItem>
                <div>
                  <strong>Readiness Check:</strong>
                  A modal will appear to verify camera functionality, lighting conditions, and face visibility.
                </div>
              </StepItem>
              <StepItem>
                <div>
                  <strong>Position Adjustment:</strong>
                  Follow on-screen instructions to position yourself correctly within the camera frame.
                </div>
              </StepItem>
            </StepList>

            <AlertBox type="warning">
              <span className="icon">⚠️</span>
              <div>
                <strong>Important:</strong> Ensure good lighting and avoid backlighting. Position yourself 2-3 feet from the camera with your face clearly visible.
              </div>
            </AlertBox>

            <h3>Troubleshooting Camera Issues</h3>
            <ul>
              <li><strong>Camera not detected:</strong> Refresh the page and check browser permissions</li>
              <li><strong>Poor image quality:</strong> Adjust lighting or camera position</li>
              <li><strong>Multiple cameras:</strong> Select the appropriate camera from the device list</li>
            </ul>
          </HelpSection>

          {/* Visual Calibration */}
          <HelpSection id="calibration">
            <h2>🎯 Visual Calibration</h2>
            <p>
              The calibration process ensures accurate facial tracking by establishing baseline measurements 
              and quality scores for optimal performance.
            </p>

            <h3>Calibration Steps</h3>
            <StepList>
              <StepItem>
                <div>
                  <strong>Initial Setup:</strong>
                  Position yourself comfortably in front of the camera with good lighting.
                </div>
              </StepItem>
              <StepItem>
                <div>
                  <strong>Calibration Points:</strong>
                  Follow the on-screen prompts to look at various calibration points displayed on the screen.
                </div>
              </StepItem>
              <StepItem>
                <div>
                  <strong>Quality Assessment:</strong>
                  The system will calculate a quality score based on tracking accuracy and stability.
                </div>
              </StepItem>
              <StepItem>
                <div>
                  <strong>Calibration Completion:</strong>
                  A quality score of 70% or higher is recommended for accurate results.
                </div>
              </StepItem>
            </StepList>

            <AlertBox type="success">
              <span className="icon">✅</span>
              <div>
                <strong>Quality Score Interpretation:</strong>
                <ul style={{ marginTop: '8px', marginBottom: 0 }}>
                  <li>90-100%: Excellent tracking quality</li>
                  <li>80-89%: Good tracking quality</li>
                  <li>70-79%: Acceptable tracking quality</li>
                  <li>Below 70%: Consider recalibration</li>
                </ul>
              </div>
            </AlertBox>
          </HelpSection>

          {/* Assessment Process */}
          <HelpSection id="assessment">
            <h2>📖 Assessment Process</h2>
            <p>
              The assessment process combines reading tasks with facial tracking to analyze reading patterns 
              and identify potential indicators of dyslexia.
            </p>

            <h3>Assessment Components</h3>
            <FeatureGrid>
              <FeatureCard>
                <div className="icon">📚</div>
                <h4>Reading Tasks</h4>
                <p>Various reading exercises designed to assess different aspects of reading ability and identify potential difficulties.</p>
              </FeatureCard>
              <FeatureCard>
                <div className="icon">👁️</div>
                <h4>Facial Tracking</h4>
                <p>Continuous monitoring of eye movements, head position, and facial expressions during reading tasks.</p>
              </FeatureCard>
              <FeatureCard>
                <div className="icon">📊</div>
                <h4>Progress Tracking</h4>
                <p>Real-time progress indicators showing completion status and assessment quality metrics.</p>
              </FeatureCard>
              <FeatureCard>
                <div className="icon">🎬</div>
                <h4>Video Recording</h4>
                <p>Optional video popup with facial tracking overlay for detailed analysis and review purposes.</p>
              </FeatureCard>
            </FeatureGrid>
          </HelpSection>

          {/* Live Tracking */}
          <HelpSection id="tracking">
            <h2>📊 Live Tracking Features</h2>
            <p>
              Real-time tracking provides immediate feedback on assessment quality and helps ensure accurate data collection.
            </p>

            <h3>Understanding the Confidence Meter</h3>
            <ul>
              <li><strong style={{color: '#10b981'}}>Green (80-100%):</strong> Excellent tracking quality, continue with assessment</li>
              <li><strong style={{color: '#f59e0b'}}>Yellow (60-79%):</strong> Moderate quality, minor adjustments may be needed</li>
              <li><strong style={{color: '#ef4444'}}>Red (Below 60%):</strong> Poor tracking, pause and adjust position or lighting</li>
            </ul>

            <AlertBox type="info">
              <span className="icon">💡</span>
              <div>
                <strong>Tip:</strong> If the confidence meter drops, pause the assessment, adjust your position or lighting, and resume when tracking quality improves.
              </div>
            </AlertBox>
          </HelpSection>

          
          

          {/* Accessibility Features */}
          <HelpSection id="accessibility">
            <h2>♿ Accessibility Features</h2>
            <p>
              AKSHAR includes comprehensive accessibility features to ensure the system is usable by individuals 
              with various needs and preferences.
            </p>

            <h3>Dyslexia-Friendly Features</h3>
            <FeatureGrid>
              <FeatureCard>
                <div className="icon">🔤</div>
                <h4>OpenDyslexic Font</h4>
                <p>Specially designed font that helps reduce letter confusion and improves reading comprehension for individuals with dyslexia.</p>
              </FeatureCard>
              <FeatureCard>
                <div className="icon">🎨</div>
                <h4>Reading Comfort Mode</h4>
                <p>Adjustable background colors, contrast settings, and line spacing to reduce visual stress and improve readability.</p>
              </FeatureCard>
              <FeatureCard>
                <div className="icon">🔍</div>
                <h4>Font Size Control</h4>
                <p>Dynamic font size adjustment to accommodate different visual needs and preferences.</p>
              </FeatureCard>
              <FeatureCard>
                <div className="icon">⏰</div>
                <h4>Pacing Controls</h4>
                <p>Adjustable reading pace and task timing to accommodate different processing speeds.</p>
              </FeatureCard>
            </FeatureGrid>

            <h3>Using Accessibility Controls</h3>
            <p>The accessibility controls are located on the right side of the interface:</p>
            <ul>
              <li><strong>Dyslexia Font:</strong> Toggle between standard and OpenDyslexic font</li>
              <li><strong>Reading Mode:</strong> Switch to high-contrast, comfortable reading colors</li>
              <li><strong>A+ / A-:</strong> Increase or decrease font size for better visibility</li>
            </ul>
          </HelpSection>

          {/* Troubleshooting */}
          <HelpSection id="troubleshooting">
            <h2>🔧 Troubleshooting & Error Recovery</h2>
            <p>
              AKSHAR includes robust error recovery systems to handle common issues and ensure smooth operation.
            </p>

            <h3>Common Issues & Solutions</h3>
            
            <h4>📷 Camera Issues</h4>
            <ul>
              <li><strong>Camera not working:</strong> Check browser permissions, refresh page, try different browser</li>
              <li><strong>Poor image quality:</strong> Adjust lighting, clean camera lens, check camera settings</li>
              <li><strong>Tracking problems:</strong> Recalibrate system, check face positioning, ensure good lighting</li>
            </ul>

            <h4>🌐 Connection Issues</h4>
            <ul>
              <li><strong>Slow loading:</strong> Check internet connection, try refreshing page</li>
              <li><strong>Assessment interruption:</strong> System automatically saves progress, can resume from last checkpoint</li>
              <li><strong>Data sync problems:</strong> Wait for connection to restore, data will sync automatically</li>
            </ul>

            <AlertBox type="success">
              <span className="icon">🛡️</span>
              <div>
                <strong>Automatic Recovery:</strong> The system includes automatic checkpoint saving and error recovery to minimize data loss and assessment interruption.
              </div>
            </AlertBox>
          </HelpSection>

          {/* Support */}
        </HelpContainer>
      </ContentSection>
    </PageContainer>
  );
};

export default HelpPage;