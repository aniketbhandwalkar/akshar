import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getScreenerQuestions, submitScreenerTest } from '../utils/testService';
import { useAuth } from '../context/AuthContext';
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

const TestContainer = styled.div`
  min-height: 100vh;
  background-color: #f8fafc;
  padding: 40px 0;
`;

const QuestionCard = styled(Card)`
  max-width: 800px;
  margin: 0 auto 30px;
  text-align: center;
`;

const QuestionText = styled(Subtitle)`
  margin-bottom: 40px;
  line-height: 1.6;
`;

const AnswerButtons = styled(FlexContainer)`
  gap: 20px;
  justify-content: center;
  margin-bottom: 30px;
`;

const AnswerButton = styled(Button)<{ selected?: boolean }>`
  padding: 15px 40px;
  font-size: 18px;
  min-width: 120px;
  
  ${props => props.selected && `
    background-color: #4f46e5;
    color: white;
  `}
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 30px;
`;

const ProgressFill = styled.div<{ progress: number }>`
  width: ${props => props.progress}%;
  height: 100%;
  background-color: #4f46e5;
  border-radius: 4px;
  transition: width 0.3s ease;
`;

const NavigationButtons = styled(FlexContainer)`
  gap: 20px;
  justify-content: center;
  margin-top: 30px;
`;

const ResultCard = styled(Card)`
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
`;

const ScreenerTestPage: React.FC = () => {
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<any>(null);
  const [showResult, setShowResult] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const questionsData = await getScreenerQuestions();
      setQuestions(questionsData);
      setAnswers(new Array(questionsData.length).fill(''));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answer: 'yes' | 'no') => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmitTest();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitTest = async () => {
    setSubmitting(true);
    setError('');

    try {
      const testResult = await submitScreenerTest(answers);
      setResult(testResult);
      setShowResult(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReturnToDashboard = () => {
    navigate('/dashboard');
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentAnswer = answers[currentQuestion];
  const canProceed = currentAnswer !== '';
  const isLastQuestion = currentQuestion === questions.length - 1;

  if (loading) {
    return (
      <div>
        <Navbar />
        <TestContainer>
          <Container>
            <Card style={{ textAlign: 'center' }}>
              <LoadingSpinner />
              <Text>Loading screening questions...</Text>
            </Card>
          </Container>
        </TestContainer>
      </div>
    );
  }

  if (error && questions.length === 0) {
    return (
      <div>
        <Navbar />
        <TestContainer>
          <Container>
            <Card style={{ textAlign: 'center' }}>
              <ErrorMessage>{error}</ErrorMessage>
              <Button 
                variant="primary" 
                onClick={() => window.location.reload()}
                style={{ marginTop: '20px' }}
              >
                Try Again
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
              <Title>Screening Test Results</Title>
              
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

  return (
    <div>
      <Navbar />
      <TestContainer>
        <Container>
          <Card style={{ textAlign: 'center', marginBottom: '20px' }}>
            <Title>Dyslexia Screening Test</Title>
            <Text>
              Please answer the following questions about your child's reading and learning behaviors.
              There are {questions.length} questions in total.
            </Text>
          </Card>

          <QuestionCard>
            <div style={{ marginBottom: '20px' }}>
              <Text style={{ color: '#6b7280', margin: 0 }}>
                Question {currentQuestion + 1} of {questions.length}
              </Text>
            </div>
            
            <ProgressBar>
              <ProgressFill progress={progress} />
            </ProgressBar>

            <QuestionText>{questions[currentQuestion]}</QuestionText>

            <AnswerButtons>
              <AnswerButton
                variant={currentAnswer === 'yes' ? 'primary' : 'secondary'}
                selected={currentAnswer === 'yes'}
                onClick={() => handleAnswerSelect('yes')}
              >
                Yes
              </AnswerButton>
              <AnswerButton
                variant={currentAnswer === 'no' ? 'primary' : 'secondary'}
                selected={currentAnswer === 'no'}
                onClick={() => handleAnswerSelect('no')}
              >
                No
              </AnswerButton>
            </AnswerButtons>

            {error && <ErrorMessage>{error}</ErrorMessage>}

            <NavigationButtons>
              <Button
                variant="secondary"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>
              
              <Button
                variant="primary"
                onClick={handleNext}
                disabled={!canProceed || submitting}
                style={{ minWidth: '120px' }}
              >
                {submitting ? (
                  <LoadingSpinner />
                ) : isLastQuestion ? (
                  'Submit Test'
                ) : (
                  'Next'
                )}
              </Button>
            </NavigationButtons>
          </QuestionCard>
        </Container>
      </TestContainer>
    </div>
  );
};

export default ScreenerTestPage;