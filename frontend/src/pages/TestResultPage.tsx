import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { getTestResult } from '../utils/testService';
import { TestResult } from '../types';
import Navbar from '../components/Navbar';
import { generatePDF } from '../utils/pdfGenerator';
import {
  Container,
  Card,
  Title,
  Subtitle,
  Button,
  Text,
  LoadingSpinner,
  GlobalStyles,
  FlexContainer
} from '../components/shared/EnhancedStyledComponents';

const ResultContainer = styled.div`
  min-height: 100vh;
  background: #f8fafc;
  padding: 40px 0;
`;

const ResultCard = styled(Card)`
  max-width: 800px;
  margin: 0 auto;
`;

const SectionCard = styled(Card)`
  margin-bottom: 20px;
`;

const ScoreSection = styled.div`
  text-align: center;
  padding: 30px;
  background: ${props => props.color || '#f8fafc'};
  border-radius: 12px;
  margin-bottom: 30px;
`;

const ScoreNumber = styled.div`
  font-size: 3rem;
  font-weight: 800;
  color: ${props => props.color || '#374151'};
  margin-bottom: 10px;
`;

const TestResultPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      fetchTestResult(id);
    }
  }, [id]);

  const fetchTestResult = async (resultId: string) => {
    try {
      const result = await getTestResult(resultId);
      setTestResult(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = (e?: React.MouseEvent<HTMLButtonElement>) => {
  e?.preventDefault();
  if (testResult && user) {
    generatePDF(testResult, user);
  }
};


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div>
        <GlobalStyles />
        <Navbar />
        <ResultContainer>
          <Container>
            <Card style={{ textAlign: 'center' }}>
              <LoadingSpinner />
              <Text>Loading test result...</Text>
            </Card>
          </Container>
        </ResultContainer>
      </div>
    );
  }

  if (error || !testResult) {
    return (
      <div>
        <GlobalStyles />
        <Navbar />
        <ResultContainer>
          <Container>
            <Card style={{ textAlign: 'center' }}>
              <Title>❌ Error</Title>
              <Text style={{ color: '#ef4444' }}>{error || 'Test result not found'}</Text>
              <Button as={Link} to="/dashboard" variant="primary">
                Back to Dashboard
              </Button>
            </Card>
          </Container>
        </ResultContainer>
      </div>
    );
  }

  return (
    <div>
      <GlobalStyles />
      <Navbar />
      <ResultContainer>
        <Container>
          <ResultCard>
            <FlexContainer justify="space-between" align="center" style={{ marginBottom: '30px' }}>
              <div>
                <Title style={{ marginBottom: '10px' }}>📊 Test Result</Title>
                <Text style={{ color: '#6b7280', marginBottom: 0 }}>
                  {testResult.testType === 'screener' ? 'Smart Screener' : 'Eye Tracking'} Test • {formatDate(testResult.createdAt)}
                </Text>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Button onClick={handleDownloadPDF} variant="primary">
                  📄 Download PDF
                </Button>
                <Button as={Link} to="/dashboard" variant="secondary">
                  ← Back
                </Button>
              </div>
            </FlexContainer>

            <ScoreSection 
              color={testResult.result.hasDyslexia ? '#fef3c7' : '#d1fae5'}
            >
              <ScoreNumber color={testResult.result.hasDyslexia ? '#92400e' : '#065f46'}>
                {testResult.result.hasDyslexia ? '⚠️' : '✅'}
              </ScoreNumber>
              <Subtitle style={{ marginBottom: '10px' }}>
                {testResult.result.hasDyslexia ? 'Indicators Found' : 'No Indicators Detected'}
              </Subtitle>
              {testResult.result.confidence && (
                <Text>
                  Confidence Level: {testResult.result.confidence}%
                </Text>
              )}
            </ScoreSection>

            <SectionCard>
              <Subtitle>🔍 Analysis</Subtitle>
              <Text>{testResult.result.reasoning}</Text>
            </SectionCard>

            <SectionCard>
              <Subtitle>💡 Recommendations</Subtitle>
              <Text>{testResult.result.advice}</Text>
            </SectionCard>

            {testResult.nearestDoctor && (
              <SectionCard>
                <Subtitle>🏥 Recommended Specialist</Subtitle>
                <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px' }}>
                  <Text style={{ marginBottom: '5px' }}>
                    <strong>Dr. {testResult.nearestDoctor.name}</strong>
                  </Text>
                  <Text style={{ marginBottom: '5px' }}>
                    📍 {testResult.nearestDoctor.address}
                  </Text>
                  <Text style={{ marginBottom: 0 }}>
                    📞 {testResult.nearestDoctor.phone}
                  </Text>
                </div>
              </SectionCard>
            )}

            <div style={{ textAlign: 'center', marginTop: '30px' }}>
              <Text style={{ fontSize: '14px', color: '#6b7280' }}>
                This report was generated by AKSHAR - AI-based Dyslexia Detection System
              </Text>
            </div>
          </ResultCard>
        </Container>
      </ResultContainer>
    </div>
  );
};

export default TestResultPage;