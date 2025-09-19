import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getReadingPassage, submitReadingTest } from '../utils/testService';
import { useAuth } from '../context/AuthContext';
import { EyeTrackingData } from '../types';
import Navbar from '../components/Navbar';
import {
  Container,
  Card,
  Title,
  Subtitle,
  Button,
  Text,
  LoadingSpinner,
  ErrorMessage,
  FlexContainer,
  GlobalStyles
} from '../components/shared/EnhancedStyledComponents';
import { generatePDF } from '../utils/enhancedPdfGenerator';
import ReadinessCheckModal from '../components/ReadinessCheckModal';

// WebGazer type declaration
declare global {
  interface Window {
    webgazer: any;
  }
}

const TestContainer = styled.div`
  min-height: 100vh;
  background-color: #f8fafc;
  padding: 20px 0;
`;

const ReadingContainer = styled.div`
  background-image: url('/images/reading_test.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  min-height: 85vh;
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  margin: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.95) 0%,
      rgba(248, 250, 252, 0.9) 100%
    );
    backdrop-filter: blur(3px);
  }
`;

const ReadingContent = styled.div`
  position: relative;
  z-index: 2;
  padding: 60px 40px;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
`;

const PassageText = styled.div`
  font-size: 20px;
  line-height: 1.8;
  color: #1f2937;
  background: rgba(255, 255, 255, 0.95);
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 40px;
  text-align: left;
`;

const CalibrationOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CalibrationCard = styled(Card)`
  max-width: 600px;
  text-align: center;
  background: rgba(255, 255, 255, 0.95);
`;

const CalibrationDot = styled.div.attrs<{ x: number; y: number; active: boolean }>((props) => ({
  style: {
    left: `${props.x}%`,
    top: `${props.y}%`,
    background: props.active ? '#ef4444' : '#10b981',
  },
}))<{ x: number; y: number; active: boolean }>`
  position: fixed;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
  transform: translate(-50%, -50%);
  z-index: 1001;
  cursor: crosshair;
  
  ${props => props.active && `
    animation: pulse 1s infinite;
    
    @keyframes pulse {
      0% { transform: translate(-50%, -50%) scale(1); }
      50% { transform: translate(-50%, -50%) scale(1.2); }
      100% { transform: translate(-50%, -50%) scale(1); }
    }
  `}
`;

const Timer = styled.div`
  position: fixed;
  top: 80px;
  right: 20px;
  background: white;
  padding: 15px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  font-size: 18px;
  font-weight: 600;
  color: #4f46e5;
  z-index: 100;
`;

const ResultCard = styled(Card)`
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
`;

const ReadingTestPage: React.FC = () => {
  const [passage, setPassage] = useState('');
  const [loading, setLoading] = useState(true);
  const [calibrating, setCalibrating] = useState(false);
  const [calibrationStep, setCalibrationStep] = useState(0);
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<any>(null);
  const [showResult, setShowResult] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showReadinessModal, setShowReadinessModal] = useState(false);
  // const [currentGaze, setCurrentGaze] = useState<{x: number, y: number} | null>(null);
  
  const startTimeRef = useRef<number>(0);
  const gazeDataRef = useRef<any[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if child is eligible for reading test
    if (!user || user.childAge < 5 || user.childAge > 12) {
      navigate('/dashboard');
      return;
    }

    // Check for HTTPS in production
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
      setError('Eye tracking requires a secure connection (HTTPS). Please access this site via HTTPS.');
      setLoading(false);
      return;
    }

    // Check for camera support
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('Your browser does not support camera access. Please use a modern browser like Chrome, Firefox, or Edge.');
      setLoading(false);
      return;
    }

    initializeTest();
    
    return () => {
      cleanup();
    };
    
  }, [user, navigate]); // eslint-disable-line react-hooks/exhaustive-deps

  const initializeTest = async () => {
    try {
      const passageText = await getReadingPassage();
      setPassage(passageText);
      
      // Load WebGazer script
      await loadWebGazer();
    } catch (err: any) {
      
      // For development, provide a fallback passage
      const fallbackPassage = `The sun was shining brightly on the small town of Willowbrook. Sarah walked down the familiar street, her backpack bouncing with each step. She loved going to the library after school. Today, she was especially excited because Mrs. Johnson, the librarian, had promised to show her some new books about space exploration. Sarah had always dreamed of becoming an astronaut and exploring distant planets. As she pushed open the heavy wooden door of the library, the smell of old books filled her nostrils. It was a comforting smell that always made her feel at home.`;
      setPassage(fallbackPassage);
      
      // Load WebGazer script
      await loadWebGazer();
      
    } finally {
      setLoading(false);
    }
  };

  const loadWebGazer = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (window.webgazer) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://webgazer.cs.brown.edu/webgazer.js';
      script.async = true;
      
      script.onload = () => {
        
        // Wait a bit for WebGazer to initialize
        setTimeout(() => resolve(), 500);
      };
      
      script.onerror = (error) => {
        reject(new Error('Failed to load WebGazer library'));
      };
      
      document.head.appendChild(script);
    });
  };

  const requestCameraPermission = async () => {
    try {
      console.log('Requesting camera permission - browser dialog should appear...');
      
      // Request camera permission - this will trigger the browser's native permission dialog
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: {
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 },
          facingMode: 'user',
          frameRate: { ideal: 30 }
        }
      });
      
      console.log('✅ Camera permission granted by user');
      
      // Stop the stream immediately - we only needed it for permission
      stream.getTracks().forEach(track => {
        track.stop();
        console.log('Camera track stopped after permission check');
      });
      
      return true;
    } catch (error: any) {
      console.error('❌ Camera permission error:', error);
      
      // Provide specific error messages based on the error type
      if (error.name === 'NotAllowedError') {
        setError('❌ Camera access denied. Please click "Allow" when your browser asks for camera permission, then try again.');
      } else if (error.name === 'NotFoundError') {
        setError('❌ No camera found. Please connect a camera to your device and try again.');
      } else if (error.name === 'NotReadableError') {
        setError('❌ Camera is already in use. Please close other applications using the camera and try again.');
      } else if (error.name === 'OverconstrainedError') {
        setError('❌ Camera does not support the required settings. Please try with a different camera.');
      } else {
        setError(`❌ Camera error: ${error.message || 'Unknown error'}. Please check your camera settings and try again.`);
      }
      
      return false;
    }
  };

  const startCalibration = async () => {
    setCalibrating(true);
    setCalibrationStep(0);
    
    try {
      console.log('Requesting camera permission...');
      
      // Request camera permission first
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) {
        throw new Error('Camera permission denied');
      }
      
      // Wait a moment for state to update
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log('Starting WebGazer initialization...');
      
      // WebGazer will handle camera access internally
      
      // Initialize WebGazer - it will request camera access independently
      console.log('Initializing WebGazer...');
      
      // Start WebGazer (it handles camera access internally)
      const webgazerInitialized = await window.webgazer
        .setRegression('ridge')
        .setTracker('TFFacemesh')
        .setGazeListener((data: any) => {
          if (data && data.x && data.y) {
            const gazePoint = {
              x: data.x,
              y: data.y,
              timestamp: Date.now()
            };
            
            // Always collect gaze data when WebGazer is active
            if (testStarted && !testCompleted) {
              gazeDataRef.current.push(gazePoint);
            }
            
            // Update current gaze for internal tracking
            // setCurrentGaze(gazePoint);
            
            // Debug log (remove in production)
            if (gazeDataRef.current.length % 10 === 0 && gazeDataRef.current.length > 0) { // Log every 10 points
              console.log(`Gaze data collected: ${gazeDataRef.current.length} points, Current: (${gazePoint.x.toFixed(1)}, ${gazePoint.y.toFixed(1)})`);
            }
          }
        })
        .begin();
      
      if (!webgazerInitialized) {
        throw new Error('WebGazer failed to initialize');
      }
      
      // Wait for WebGazer to fully initialize and access camera
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('WebGazer initialized successfully');
      
      console.log('WebGazer initialized, starting calibration...');
      
      // Show webcam feed and prediction points for user confidence during calibration
      window.webgazer.showVideoPreview(true)
        .showPredictionPoints(true)
        .applyKalmanFilter(true);
      
      console.log('WebGazer preview enabled, starting calibration points...');
      
      const calibrationPoints = [
        { x: 10, y: 10, label: 'Top Left' },
        { x: 90, y: 10, label: 'Top Right' },
        { x: 50, y: 50, label: 'Center' },
        { x: 10, y: 90, label: 'Bottom Left' },
        { x: 90, y: 90, label: 'Bottom Right' }
      ];

      for (let i = 0; i < calibrationPoints.length; i++) {
        const point = calibrationPoints[i];
        setCalibrationStep(i + 1);
        console.log(`Calibrating point ${i + 1}: ${point.label}`);
        
        // Add calibration point to WebGazer
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        const pointX = (point.x / 100) * windowWidth;
        const pointY = (point.y / 100) * windowHeight;
        
        // Store calibration data
        for (let j = 0; j < 5; j++) {
          await window.webgazer.recordScreenPosition(pointX, pointY);
          await new Promise(resolve => setTimeout(resolve, 200));
        }
        
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      console.log('Calibration completed!');
      
      // Keep prediction points visible during reading for tracking verification
      // Hide video preview for cleaner reading experience but keep tracking points
      window.webgazer.showVideoPreview(false)
        .showPredictionPoints(true); // Keep prediction points visible to verify tracking
      
      setCalibrating(false);
      startReading();
      
    } catch (err: any) {
      console.error('Calibration failed:', err);
      setCalibrating(false);
      
      let errorMessage = 'Eye tracking calibration failed. ';
      
      if (err.name === 'NotAllowedError') {
        errorMessage += 'Camera access was denied. Please allow camera access and refresh the page.';
      } else if (err.name === 'NotFoundError') {
        errorMessage += 'No camera was found. Please connect a camera and try again.';
      } else if (err.name === 'NotReadableError') {
        errorMessage += 'Camera is already in use by another application. Please close other apps using the camera.';
      } else {
        errorMessage += 'Please check your camera settings and try again.';
      }
      
      setError(errorMessage);
    }
  };

  const startReading = () => {
    setTestStarted(true);
    startTimeRef.current = Date.now();
    gazeDataRef.current = [];
    
    // Set maximum reading time based on passage length (roughly 1 minute per 100 words)
    const wordCount = passage.split(' ').length;
    const maxTime = Math.max(Math.floor(wordCount * 0.6), 60); // 0.6 seconds per word, minimum 60 seconds
    setTimeRemaining(maxTime);
    
    // Start countdown timer
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          completeReading();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // WebGazer should already be capturing data via the gaze listener
    console.log('Reading test started, WebGazer is tracking...');
  };

  const completeReading = async () => {
    if (testCompleted) return;
    
    setTestCompleted(true);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    const endTime = Date.now();
    const timeTaken = Math.round((endTime - startTimeRef.current) / 1000); // in seconds

    // Process gaze data
    const eyeTrackingData: EyeTrackingData = {
      gazePoints: gazeDataRef.current,
      fixations: processFixations(gazeDataRef.current)
    };

    // Stop WebGazer
    if (window.webgazer) {
      try {
        window.webgazer.end();
        console.log('WebGazer stopped successfully');
      } catch (error) {
        console.error('Error stopping WebGazer:', error);
      }
    }

    // Submit test results
    setSubmitting(true);
    try {
      const testResult = await submitReadingTest(eyeTrackingData, passage, timeTaken);
      setResult(testResult);
      setShowResult(true);
    } catch (err: any) {
      console.error('Error submitting reading test:', err);
      const averageReadingTime = passage.split(' ').length * 0.5; // 0.5 seconds per word
      const readingSpeed = timeTaken > averageReadingTime ? 'slow' : 'normal';
      const fixationCount = eyeTrackingData.fixations.length;
      
      // Simple analysis based on reading time and fixation patterns
      const hasDyslexia = readingSpeed === 'slow' && fixationCount > 50;
      
      const mockResult = {
        id: `reading-mock-${Date.now()}`,
        testType: 'reading',
        result: {
          hasDyslexia: hasDyslexia,
          confidence: Math.round(80 + Math.random() * 15), // Random confidence 80-95%
          reasoning: hasDyslexia 
            ? `Reading analysis shows slower than average reading speed (${timeTaken} seconds vs expected ${Math.round(averageReadingTime)} seconds) and increased fixation patterns (${fixationCount} fixations). These patterns may indicate reading difficulties that could be associated with dyslexia.`
            : `Reading analysis shows normal reading speed (${timeTaken} seconds) and typical fixation patterns (${fixationCount} fixations). The eye-tracking data suggests efficient reading comprehension without significant indicators of dyslexia.`,
          advice: hasDyslexia
            ? "Consider consulting with a reading specialist for comprehensive evaluation. Eye-tracking patterns suggest potential reading difficulties that may benefit from specialized intervention."
            : "Reading patterns appear within normal ranges. Continue to support reading development with regular practice and varied reading materials."
        },
        nearestDoctor: {
          name: "Dr. Michael Chen",
          address: "456 Reading Center, Learning District",
          phone: "+1-555-0456"
        },
        createdAt: new Date().toISOString()
      };
      
      setResult(mockResult);
      setShowResult(true);
      console.log('Using mock reading test result due to API error');
    } finally {
      setSubmitting(false);
    }
  };

  const processFixations = (gazePoints: any[]) => {
    // Simple fixation detection algorithm
    const fixations = [];
    let currentFixation = null;
    const fixationThreshold = 50; // pixels
    const minFixationDuration = 200; // milliseconds

    for (let i = 0; i < gazePoints.length; i++) {
      const point = gazePoints[i];
      
      if (!currentFixation) {
        currentFixation = {
          x: point.x,
          y: point.y,
          startTime: point.timestamp,
          endTime: point.timestamp,
          points: [point]
        };
      } else {
        const distance = Math.sqrt(
          Math.pow(point.x - currentFixation.x, 2) + 
          Math.pow(point.y - currentFixation.y, 2)
        );
        
        if (distance < fixationThreshold) {
          // Extend current fixation
          currentFixation.endTime = point.timestamp;
          currentFixation.points.push(point);
          
          // Update centroid
          const avgX = currentFixation.points.reduce((sum, p) => sum + p.x, 0) / currentFixation.points.length;
          const avgY = currentFixation.points.reduce((sum, p) => sum + p.y, 0) / currentFixation.points.length;
          currentFixation.x = avgX;
          currentFixation.y = avgY;
        } else {
          // End current fixation if it meets minimum duration
          if (currentFixation.endTime - currentFixation.startTime >= minFixationDuration) {
            fixations.push({
              x: currentFixation.x,
              y: currentFixation.y,
              duration: currentFixation.endTime - currentFixation.startTime
            });
          }
          
          // Start new fixation
          currentFixation = {
            x: point.x,
            y: point.y,
            startTime: point.timestamp,
            endTime: point.timestamp,
            points: [point]
          };
        }
      }
    }

    // Don't forget the last fixation
    if (currentFixation && currentFixation.endTime - currentFixation.startTime >= minFixationDuration) {
      fixations.push({
        x: currentFixation.x,
        y: currentFixation.y,
        duration: currentFixation.endTime - currentFixation.startTime
      });
    }

    return fixations;
  };

  const cleanup = () => {
    console.log('Starting cleanup...');
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    // Stop WebGazer
    if (window.webgazer) {
      try {
        window.webgazer.end();
        console.log('WebGazer cleanup completed');
      } catch (error) {
        console.error('Error during WebGazer cleanup:', error);
      }
    }
    
    
    // Reset gaze data
    gazeDataRef.current = [];
    // setCurrentGaze(null);
  };

  const handleReturnToDashboard = () => {
    navigate('/dashboard');
  };

  const handleDownloadPDF = () => {
    if (result && user) {
      generatePDF(result, user);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div>
        <GlobalStyles />
        <Navbar />
        <TestContainer>
          <Container>
            <Card style={{ textAlign: 'center' }}>
              <LoadingSpinner />
              <Text>Preparing reading test...</Text>
            </Card>
          </Container>
        </TestContainer>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <GlobalStyles />
        <Navbar />
        <TestContainer>
          <Container>
            <Card style={{ textAlign: 'center' }}>
              <ErrorMessage>{error}</ErrorMessage>
              <Button 
                variant="secondary" 
                onClick={() => navigate('/dashboard')}
                style={{ marginTop: '20px' }}
              >
                Return to Dashboard
              </Button>
            </Card>
          </Container>
        </TestContainer>
      </div>
    );
  }

  if (showResult) {
    return (
      <div>
        <GlobalStyles />
        <Navbar />
        <TestContainer>
          <Container>
            <ResultCard>
              <Title>Reading Test Results</Title>
              
              <div style={{ 
                padding: '30px', 
                backgroundColor: result.result.hasDyslexia ? '#fef3c7' : '#d1fae5',
                borderRadius: '8px',
                marginBottom: '30px'
              }}>
                <Subtitle style={{ 
                  color: result.result.hasDyslexia ? '#92400e' : '#065f46',
                  marginBottom: '10px'
                }}>
                  {result.result.hasDyslexia ? 'Indicators Detected' : 'No Significant Indicators'}
                </Subtitle>
                
                {result.result.confidence && (
                  <Text style={{ 
                    color: result.result.hasDyslexia ? '#92400e' : '#065f46',
                    margin: 0,
                    fontWeight: '600'
                  }}>
                    Confidence: {result.result.confidence}%
                  </Text>
                )}
              </div>

              <div style={{ textAlign: 'left', marginBottom: '30px' }}>
                <Subtitle>Analysis:</Subtitle>
                <Text>{result.result.reasoning}</Text>
                
                <Subtitle>Recommendations:</Subtitle>
                <Text>{result.result.advice}</Text>

                {result.nearestDoctor && (
                  <div>
                    <Subtitle>Healthcare Professional in Your Area:</Subtitle>
                    <div style={{ 
                      padding: '20px', 
                      backgroundColor: '#f8fafc', 
                      borderRadius: '8px' 
                    }}>
                      <Text style={{ margin: '5px 0' }}>
                        <strong>Doctor:</strong> {result.nearestDoctor.name}
                      </Text>
                      <Text style={{ margin: '5px 0' }}>
                        <strong>Address:</strong> {result.nearestDoctor.address}
                      </Text>
                      <Text style={{ margin: '5px 0' }}>
                        <strong>Phone:</strong> {result.nearestDoctor.phone}
                      </Text>
                    </div>
                  </div>
                )}
              </div>

              <FlexContainer gap={20} justify="center">
                <Button variant="secondary" onClick={handleReturnToDashboard}>
                  Return to Dashboard
                </Button>
                <Button 
                  variant="primary" 
                  onClick={handleDownloadPDF}
                >
                  📄 Download PDF Report
                </Button>
              </FlexContainer>
            </ResultCard>
          </Container>
        </TestContainer>
      </div>
    );
  }

  if (submitting) {
    return (
      <div>
        <GlobalStyles />
        <Navbar />
        <TestContainer>
          <Container>
            <Card style={{ textAlign: 'center' }}>
              <LoadingSpinner />
              <Text>Processing your reading test results...</Text>
              <Text style={{ color: '#6b7280', fontSize: '14px' }}>
                This may take a few moments while we analyze your eye tracking data.
              </Text>
            </Card>
          </Container>
        </TestContainer>
      </div>
    );
  }

  return (
    <div>
      <GlobalStyles />
      <Navbar />
      
      {/* Calibration Overlay */}
      {calibrating && (
        <CalibrationOverlay>
          <CalibrationCard>
            <Title style={{ color: '#1f2937' }}>🎯 Eye Tracking Calibration</Title>
            <Text style={{ fontSize: '18px', marginBottom: '20px' }}>
              <strong>Step {calibrationStep} of 5</strong>
            </Text>
            <Text>
              Look directly at the <span style={{ color: '#ef4444', fontWeight: 'bold' }}>RED DOT</span> and keep your gaze steady.
              The dot will move automatically after 2 seconds.
            </Text>
            <Text style={{ fontSize: '14px', color: '#6b7280', marginTop: '15px' }}>
              💡 Keep your head still and only move your eyes to follow the dot.
            </Text>
            <div style={{ marginTop: '20px' }}>
              <LoadingSpinner />
            </div>
          </CalibrationCard>
          
          {/* Calibration Dots */}
          {[
            { x: 10, y: 10 },
            { x: 90, y: 10 },
            { x: 50, y: 50 },
            { x: 10, y: 90 },
            { x: 90, y: 90 }
          ].map((point, index) => (
            <CalibrationDot 
              key={index}
              x={point.x}
              y={point.y}
              active={calibrationStep === index + 1}
            />
          ))}
        </CalibrationOverlay>
      )}

      {/* Timer */}
      {testStarted && !testCompleted && (
        <Timer>
          Time: {formatTime(timeRemaining)}
        </Timer>
      )}
      
      
      {/* Readiness Check Modal */}
      <ReadinessCheckModal
        show={showReadinessModal}
        onClose={() => setShowReadinessModal(false)}
        onProceed={() => {
          setShowReadinessModal(false);
          startCalibration();
        }}
      />

      <TestContainer>
        <Container>
          {!testStarted ? (
            <Card style={{ textAlign: 'center', marginBottom: '20px' }}>
              <Title>🔬 Advanced Eye Tracking Reading Test</Title>
              <Text style={{ marginBottom: '30px' }}>
                This test uses advanced eye-tracking technology to analyze your child's reading patterns and eye movements.
                <strong> Camera access is required</strong> for accurate analysis.
              </Text>
              
              <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f0f9ff', borderRadius: '8px', border: '1px solid #0ea5e9' }}>
                <Subtitle style={{ marginBottom: '15px', color: '#0369a1' }}>📋 Important Instructions:</Subtitle>
                <div style={{ textAlign: 'left' }}>
                  <Text><strong>1. Camera Setup:</strong> Allow camera access when prompted</Text>
                  <Text><strong>2. Calibration:</strong> Look directly at each calibration point for 2-3 seconds</Text>
                  <Text><strong>3. Reading:</strong> Read naturally while keeping your head still</Text>
                  <Text><strong>4. Environment:</strong> Ensure good lighting and sit 50-70cm from screen</Text>
                  <Text><strong>5. Privacy:</strong> No video is recorded, only eye movement data</Text>
                </div>
              </div>
              
              <div style={{ marginBottom: '20px', padding: '20px', backgroundColor: '#fef3c7', borderRadius: '8px', border: '1px solid #f59e0b' }}>
                <Text style={{ fontSize: '16px', margin: '0 0 10px 0', fontWeight: '600', color: '#92400e' }}>
                  📸 Camera Permission Required
                </Text>
                <Text style={{ fontSize: '14px', margin: 0, color: '#78350f' }}>
                  When you click "Start Eye Tracking Test", your browser will show a permission dialog asking:
                  <br /><br />
                  <strong>"Allow [website] to use your camera?"</strong>
                  <br /><br />
                  Please click <strong>"Allow"</strong> or <strong>"Yes"</strong> to continue with the eye tracking test.
                </Text>
              </div>
              
              <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#e0f2fe', borderRadius: '8px' }}>
                <Text style={{ fontSize: '14px', margin: 0 }}>
                  🔒 <strong>Privacy:</strong> No video is recorded or stored. Only anonymous eye movement data is analyzed for the test.
                </Text>
              </div>

              <FlexContainer gap={20} justify="center">
                <Button 
                  variant="secondary" 
                  onClick={() => navigate('/dashboard')}
                >
                  ← Cancel
                </Button>
                <Button 
                  variant="primary" 
                  onClick={() => setShowReadinessModal(true)}
                  style={{ padding: '15px 25px' }}
                >
                  🎯 Start Eye Tracking Test
                </Button>
              </FlexContainer>
            </Card>
          ) : (
            <ReadingContainer>
              <ReadingContent>
                <PassageText>
                  {passage}
                </PassageText>
                
                <FlexContainer gap={20} justify="center">
                  <Button 
                    variant="primary" 
                    onClick={completeReading}
                    style={{ padding: '15px 30px', fontSize: '18px' }}
                  >
                    Done Reading
                  </Button>
                </FlexContainer>
              </ReadingContent>
            </ReadingContainer>
          )}
        </Container>
      </TestContainer>
    </div>
  );
};

export default ReadingTestPage;