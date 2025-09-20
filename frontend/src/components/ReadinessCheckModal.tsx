import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import {
  Card,
  Title,
  Subtitle,
  Button,
  Text,
  FlexContainer
} from './shared/EnhancedStyledComponents';

const ModalOverlay = styled.div<{ show: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${props => props.show ? 1 : 0};
  visibility: ${props => props.show ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
`;

const ModalCard = styled(Card)`
  max-width: 800px;
  width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
  background: white;
  border-radius: 16px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
`;

const VideoPreview = styled.video`
  width: 100%;
  max-width: 400px;
  height: 300px;
  border-radius: 12px;
  background: #1f2937;
  object-fit: cover;
  margin: 20px 0;
  border: 3px solid #e5e7eb;
`;

const ChecklistItem = styled.div.withConfig({
  shouldForwardProp: (prop) => !['checked'].includes(prop),
})<{ checked: boolean }>`
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 8px;
  background: ${props => props.checked ? '#d1fae5' : '#fef3c7'};
  border: 1px solid ${props => props.checked ? '#10b981' : '#f59e0b'};
`;

const StatusIndicator = styled.div<{ status: 'good' | 'warning' | 'error' }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 10px;
  background: ${props => {
    switch (props.status) {
      case 'good': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'error': return '#ef4444';
    }
  }};
`;

const StepIndicator = styled.div.withConfig({
  shouldForwardProp: (prop) => !['active', 'completed'].includes(prop),
})<{ active: boolean; completed: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
  background: ${props => {
    if (props.completed) return '#10b981';
    if (props.active) return '#3b82f6';
    return '#9ca3af';
  }};
  margin-right: 15px;
`;

interface ReadinessCheckModalProps {
  show: boolean;
  onClose: () => void;
  onProceed: () => void;
}

interface SystemCheck {
  camera: 'checking' | 'good' | 'error';
  lighting: 'checking' | 'good' | 'warning' | 'error';
  position: 'checking' | 'good' | 'warning' | 'error';
  stability: 'checking' | 'good' | 'warning' | 'error';
}

const ReadinessCheckModal: React.FC<ReadinessCheckModalProps> = ({
  show,
  onClose,
  onProceed
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [systemCheck, setSystemCheck] = useState<SystemCheck>({
    camera: 'checking',
    lighting: 'checking',
    position: 'checking',
    stability: 'checking'
  });
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [faceDetected, setFaceDetected] = useState(false);
  const [lightingQuality, setLightingQuality] = useState(0);

  useEffect(() => {
    if (show && currentStep === 2) {
      initializeCamera();
    }
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (videoRef.current) {
        try {
          // @ts-ignore
          videoRef.current.srcObject = null;
        } catch {}
      }
    };
  }, [show, currentStep]); // run only when modal visibility or step changes

  const initializeCamera = async () => {
    try {
      setSystemCheck(prev => ({ ...prev, camera: 'checking' }));
      
      // If there's an existing stream, stop it before requesting a new one
      if (stream) {
        try {
          stream.getTracks().forEach(track => track.stop());
        } catch {}
      }
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        } 
      });
      
      setStream(mediaStream);
      setSystemCheck(prev => ({ ...prev, camera: 'good' }));
      
      if (videoRef.current) {
        // @ts-ignore
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          startQualityChecks();
        };
      }
    } catch (error: any) {
      console.error('Camera access failed:', error);
      setSystemCheck(prev => ({ ...prev, camera: 'error' }));
    }
  };

  const startQualityChecks = () => {
    // Simulate lighting and positioning checks
    setTimeout(() => {
      // Mock lighting analysis
      const mockLighting = Math.random() * 100;
      setLightingQuality(mockLighting);
      
      if (mockLighting > 60) {
        setSystemCheck(prev => ({ ...prev, lighting: 'good' }));
      } else if (mockLighting > 30) {
        setSystemCheck(prev => ({ ...prev, lighting: 'warning' }));
      } else {
        setSystemCheck(prev => ({ ...prev, lighting: 'error' }));
      }
      
      // Mock face detection
      setTimeout(() => {
        setFaceDetected(true);
        setSystemCheck(prev => ({ 
          ...prev, 
          position: 'good',
          stability: 'good'
        }));
      }, 1500);
      
    }, 1000);
  };

  const getOverallScore = () => {
    const scores = {
      good: 3,
      warning: 2,
      error: 1,
      checking: 0
    };
    
    const total = scores[systemCheck.camera] + 
                 scores[systemCheck.lighting] + 
                 scores[systemCheck.position] + 
                 scores[systemCheck.stability];
    
    if (total >= 11) return { score: 'excellent', color: '#10b981' };
    if (total >= 8) return { score: 'good', color: '#f59e0b' };
    return { score: 'poor', color: '#ef4444' };
  };

  const canProceed = () => {
    return systemCheck.camera === 'good' && 
           systemCheck.lighting !== 'error' &&
           systemCheck.position !== 'error' &&
           systemCheck.stability !== 'error';
  };

  const renderStep1 = () => (
    <div style={{ textAlign: 'center' }}>
      <Title>🚀 Eye Tracking Setup</Title>
      <Text style={{ marginBottom: '30px' }}>
        Let's make sure your environment is optimal for accurate eye tracking analysis.
      </Text>
      
      <div style={{ background: '#f0f9ff', padding: '25px', borderRadius: '12px', marginBottom: '30px' }}>
        <Subtitle style={{ color: '#0369a1', marginBottom: '20px' }}>
          📋 Pre-flight Checklist
        </Subtitle>
        
        <div style={{ textAlign: 'left' }}>
          <ChecklistItem checked={true}>
            <span>✅ Stable internet connection</span>
          </ChecklistItem>
          <ChecklistItem checked={true}>
            <span>💡 Good lighting (avoid backlighting)</span>
          </ChecklistItem>
          <ChecklistItem checked={true}>
            <span>📏 Sit 50-70cm from your screen</span>
          </ChecklistItem>
          <ChecklistItem checked={true}>
            <span>👤 Position your face in center of screen</span>
          </ChecklistItem>
          <ChecklistItem checked={true}>
            <span>🔇 Minimize distractions and background noise</span>
          </ChecklistItem>
        </div>
      </div>

      <FlexContainer gap={15} justify="center">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={() => setCurrentStep(2)}>
          Start Camera Check 📸
        </Button>
      </FlexContainer>
    </div>
  );

  const renderStep2 = () => (
    <div style={{ textAlign: 'center' }}>
      <Title>📸 Camera & Environment Check</Title>
      <Text style={{ marginBottom: '20px' }}>
        We're analyzing your camera setup and environment quality...
      </Text>

      <VideoPreview 
        ref={videoRef} 
        autoPlay 
        muted 
        playsInline
        style={{ 
          border: faceDetected ? '3px solid #10b981' : '3px solid #f59e0b'
        }}
      />

      <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
        <Subtitle style={{ marginBottom: '15px' }}>System Status</Subtitle>
        
        <div style={{ textAlign: 'left' }}>
          <FlexContainer align="center" style={{ marginBottom: '10px' }}>
            <StatusIndicator status={systemCheck.camera === 'good' ? 'good' : systemCheck.camera === 'error' ? 'error' : 'warning'} />
            <Text style={{ margin: 0 }}>
              Camera Access: {systemCheck.camera === 'good' ? 'Connected' : systemCheck.camera === 'error' ? 'Failed' : 'Connecting...'}
            </Text>
          </FlexContainer>
          
          <FlexContainer align="center" style={{ marginBottom: '10px' }}>
            <StatusIndicator status={systemCheck.lighting === 'checking' ? 'warning' : systemCheck.lighting as 'good' | 'warning' | 'error'} />
            <Text style={{ margin: 0 }}>
              Lighting Quality: {lightingQuality > 60 ? 'Excellent' : lightingQuality > 30 ? 'Good' : 'Poor'} ({Math.round(lightingQuality)}%)
            </Text>
          </FlexContainer>
          
          <FlexContainer align="center" style={{ marginBottom: '10px' }}>
            <StatusIndicator status={systemCheck.position === 'checking' ? 'warning' : systemCheck.position as 'good' | 'warning' | 'error'} />
            <Text style={{ margin: 0 }}>
              Face Position: {faceDetected ? 'Centered' : 'Detecting...'}
            </Text>
          </FlexContainer>
          
          <FlexContainer align="center">
            <StatusIndicator status={systemCheck.stability === 'checking' ? 'warning' : systemCheck.stability as 'good' | 'warning' | 'error'} />
            <Text style={{ margin: 0 }}>
              Stability: {systemCheck.stability === 'good' ? 'Stable' : 'Checking...'}
            </Text>
          </FlexContainer>
        </div>
      </div>

      <div style={{ 
        background: getOverallScore().color === '#10b981' ? '#d1fae5' : '#fef3c7', 
        padding: '15px', 
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <Text style={{ margin: 0, fontWeight: 'bold' }}>
          Setup Quality: <span style={{ color: getOverallScore().color }}>
            {getOverallScore().score.toUpperCase()}
          </span>
        </Text>
      </div>

      <FlexContainer gap={15} justify="center">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        {systemCheck.camera === 'error' ? (
          <Button variant="primary" onClick={initializeCamera}>
            Retry Camera
          </Button>
        ) : (
          <Button 
            variant="primary" 
            onClick={() => setCurrentStep(3)}
            disabled={!canProceed()}
          >
            Continue to Calibration
          </Button>
        )}
      </FlexContainer>
    </div>
  );

  const renderStep3 = () => (
    <div style={{ textAlign: 'center' }}>
      <Title>✅ Ready for Eye Tracking!</Title>
      <Text style={{ marginBottom: '30px' }}>
        Great! Your setup looks good. Here's what happens next:
      </Text>

      <div style={{ textAlign: 'left', marginBottom: '30px' }}>
        <FlexContainer align="center" style={{ marginBottom: '15px' }}>
          <StepIndicator active={false} completed={true}>1</StepIndicator>
          <Text style={{ margin: 0 }}>5-point calibration (look at red dots)</Text>
        </FlexContainer>
        
        <FlexContainer align="center" style={{ marginBottom: '15px' }}>
          <StepIndicator active={false} completed={true}>2</StepIndicator>
          <Text style={{ margin: 0 }}>Read the passage naturally</Text>
        </FlexContainer>
        
        <FlexContainer align="center">
          <StepIndicator active={false} completed={true}>3</StepIndicator>
          <Text style={{ margin: 0 }}>Get detailed analysis and recommendations</Text>
        </FlexContainer>
      </div>

      <div style={{ background: '#fef3c7', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <Text style={{ margin: 0, fontSize: '14px' }}>
          💡 <strong>Tip:</strong> Keep your head still during the test and only move your eyes to read.
        </Text>
      </div>

      <FlexContainer gap={15} justify="center">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onProceed}>
          Start Eye Tracking Test 🎯
        </Button>
      </FlexContainer>
    </div>
  );

  return (
    <ModalOverlay show={show}>
      <ModalCard>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
      </ModalCard>
    </ModalOverlay>
  );
};

export default ReadinessCheckModal;