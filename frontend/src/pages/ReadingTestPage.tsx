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
  FlexContainer
} from '../components/shared/StyledComponents';

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
  background: rgba(0, 0, 0, 0.8);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CalibrationCard = styled(Card)`
  max-width: 600px;
  text-align: center;
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

    initializeTest();
    
    return () => {
      cleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, navigate]);

  const initializeTest = async () => {
    try {
      const passageText = await getReadingPassage();
      setPassage(passageText);
      
      // Load WebGazer script
      await loadWebGazer();
    } catch (err: any) {
      setError(err.message);
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
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load WebGazer'));
      document.head.appendChild(script);
    });
  };

  const startCalibration = async () => {
    setCalibrating(true);
    setCalibrationStep(0);
    
    try {
      await window.webgazer.setGazeListener((data: any) => {
        if (data && testStarted) {
          gazeDataRef.current.push({
            x: data.x,
            y: data.y,
            timestamp: Date.now()
          });
        }
      }).begin();

      // Calibration steps
      const calibrationPoints = [
        { x: '10%', y: '10%' },
        { x: '90%', y: '10%' },
        { x: '50%', y: '50%' },
        { x: '10%', y: '90%' },
        { x: '90%', y: '90%' }
      ];

      for (let i = 0; i < calibrationPoints.length; i++) {
        setCalibrationStep(i + 1);
        await new Promise(resolve => setTimeout(resolve, 3000));
      }

      setCalibrating(false);
      startReading();
    } catch (err) {
      setError('Calibration failed. Please refresh and try again.');
      setCalibrating(false);
    }
  };

  const startReading = () => {
    setTestStarted(true);
    startTimeRef.current = Date.now();
    gazeDataRef.current = [];
    
    // Set maximum reading time based on passage length (roughly 1 minute per 100 words)
    const wordCount = passage.split(' ').length;
    const maxTime = Math.max(wordCount * 0.6, 60); // 0.6 seconds per word, minimum 60 seconds
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
      window.webgazer.end();
    }

    // Submit test results
    setSubmitting(true);
    try {
      const testResult = await submitReadingTest(eyeTrackingData, passage, timeTaken);
      setResult(testResult);
      setShowResult(true);
    } catch (err: any) {
      setError(err.message);
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
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (window.webgazer) {
      window.webgazer.end();
    }
  };

  const handleReturnToDashboard = () => {
    navigate('/dashboard');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div>
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
                  onClick={() => window.print()}
                >
                  Print Results
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
      <Navbar />
      
      {/* Calibration Overlay */}
      {calibrating && (
        <CalibrationOverlay>
          <CalibrationCard>
            <Title>Eye Tracking Calibration</Title>
            <Text>
              Step {calibrationStep} of 5: Look at the dot and follow it with your eyes.
              Keep your head still and look directly at each point for 3 seconds.
            </Text>
            <LoadingSpinner />
          </CalibrationCard>
        </CalibrationOverlay>
      )}

      {/* Timer */}
      {testStarted && !testCompleted && (
        <Timer>
          Time: {formatTime(timeRemaining)}
        </Timer>
      )}

      <TestContainer>
        <Container>
          {!testStarted ? (
            <Card style={{ textAlign: 'center', marginBottom: '20px' }}>
              <Title>Reading Test</Title>
              <Text style={{ marginBottom: '30px' }}>
                This test uses eye-tracking technology to analyze your child's reading patterns.
                Please ensure you have good lighting and your camera has permission to access.
              </Text>
              
              <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
                <Subtitle style={{ marginBottom: '15px' }}>Instructions:</Subtitle>
                <div style={{ textAlign: 'left' }}>
                  <Text>1. First, we'll calibrate the eye tracking by having you look at 5 points</Text>
                  <Text>2. Then, read the passage naturally at your own pace</Text>
                  <Text>3. Click "Done Reading" when you finish, or the test will auto-complete</Text>
                  <Text>4. Keep your head relatively still during the test</Text>
                </div>
              </div>

              <FlexContainer gap={20} justify="center">
                <Button 
                  variant="secondary" 
                  onClick={() => navigate('/dashboard')}
                >
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  onClick={startCalibration}
                >
                  Start Calibration
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