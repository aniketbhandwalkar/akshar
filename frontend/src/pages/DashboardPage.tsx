import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { getTestResults, downloadTestResultPDF } from '../utils/testService';
import { TestResult } from '../types';
import Navbar from '../components/Navbar';
import {
  Container,
  Card,
  Title,
  Subtitle,
  Button,
  Text,
  LoadingSpinner,
  Grid,
  Badge,
  FlexContainer,
  GlobalStyles,
  IconWrapper
} from '../components/shared/EnhancedStyledComponents';

const DashboardContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(145deg, #f8fafc 0%, #e0e7ff 100%);
  padding: 40px 0;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: radial-gradient(circle at 10% 20%, rgba(102, 126, 234, 0.05) 0%, transparent 50%),
                      radial-gradient(circle at 80% 80%, rgba(118, 75, 162, 0.05) 0%, transparent 50%);
  }
`;

const WelcomeCard = styled(Card)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  margin-bottom: 40px;
  border: none;
  position: relative;
  z-index: 2;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 100%);
    border-radius: 16px;
  }
`;

const TestCard = styled(Card)`
  text-align: center;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: relative;
  z-index: 2;
  
  &:hover {
    transform: translateY(-12px) scale(1.02);
    box-shadow: 0 20px 60px rgba(102, 126, 234, 0.15);
    background: rgba(255, 255, 255, 0.9);
  }
`;

const TestIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 20px;
`;

const ResultsTable = styled.div`
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const TableHeader = styled.div`
  background-color: #f8fafc;
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
  font-weight: 600;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 2fr;
  gap: 20px;
  align-items: center;
`;

const TableRow = styled.div`
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 2fr;
  gap: 20px;
  align-items: center;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: #f8fafc;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTestResults();
  }, []);

  const fetchTestResults = async () => {
    try {
      const results = await getTestResults();
      setTestResults(results);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async (resultId: string) => {
    try {
      const blob = await downloadTestResultPDF(resultId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `test-result-${resultId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      console.error('Error downloading PDF:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const canTakeReadingTest = user && user.childAge >= 5 && user.childAge <= 12;

  return (
    <div>
      <GlobalStyles />
      <Navbar />
      <DashboardContainer>
        <Container>
          <WelcomeCard>
            <FlexContainer justify="space-between" align="center">
              <div>
                <Title animated style={{ color: 'white', marginBottom: '10px' }}>
                  🎉 Welcome back, {user?.parentName}!
                </Title>
                <Text animated style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: 0 }}>
                  👶 Child Age: {user?.childAge} years • 📍 Location: {user?.area}
                </Text>
              </div>
              <IconWrapper size="large" animated>
                👋
              </IconWrapper>
            </FlexContainer>
          </WelcomeCard>

          <div style={{ marginBottom: '40px', position: 'relative', zIndex: 2 }}>
            <Subtitle animated style={{ marginBottom: '30px' }}>✨ Choose Your Test</Subtitle>
            <Grid columns={2} gap={32} animated>
              <TestCard hover>
                <IconWrapper size="large" animated>
                  🧠
                </IconWrapper>
                <Subtitle animated>Smart Screener</Subtitle>
                <Text animated style={{ marginBottom: '20px' }}>
                  Complete a comprehensive 10-question assessment designed by experts 
                  to identify potential signs of dyslexia. 🎯
                </Text>
                <Badge color="info" animated style={{ marginBottom: '20px' }}>All Ages</Badge>
                <Button 
                  as={Link} 
                  to="/screener-test" 
                  variant="primary"
                  size="large"
                  style={{ width: '100%' }}
                >
                  🚀 Start Screening
                </Button>
              </TestCard>

              <TestCard hover>
                <IconWrapper size="large" animated>
                  👁️
                </IconWrapper>
                <Subtitle animated>Eye Tracking Test</Subtitle>
                <Text animated style={{ marginBottom: '20px' }}>
                  Revolutionary eye-tracking analysis during reading tasks using 
                  advanced AI technology. 🤖
                </Text>
                <Badge 
                  color={canTakeReadingTest ? "success" : "warning"} 
                  animated 
                  style={{ marginBottom: '20px' }}
                >
                  {canTakeReadingTest ? "Available" : "Ages 5-12"}
                </Badge>
                <Button 
                  as={Link} 
                  to="/reading-test" 
                  variant={canTakeReadingTest ? "gradient" : "secondary"}
                  size="large"
                  disabled={!canTakeReadingTest}
                  style={{ width: '100%' }}
                >
                  {canTakeReadingTest ? '🔮 Start Reading Test' : '🔒 Age Restricted'}
                </Button>
              </TestCard>
            </Grid>
          </div>

          <div>
            <Subtitle style={{ marginBottom: '30px' }}>Previous Test Results</Subtitle>
            
            {loading ? (
              <Card style={{ textAlign: 'center' }}>
                <LoadingSpinner />
                <Text>Loading your test results...</Text>
              </Card>
            ) : error ? (
              <Card>
                <Text style={{ color: '#ef4444' }}>Error: {error}</Text>
              </Card>
            ) : testResults.length === 0 ? (
              <Card style={{ textAlign: 'center' }}>
                <Text style={{ color: '#6b7280' }}>
                  No test results yet. Take your first test above to get started!
                </Text>
              </Card>
            ) : (
              <ResultsTable>
                <TableHeader>
                  <div>Test Type</div>
                  <div>Date</div>
                  <div>Result</div>
                  <div>Confidence</div>
                  <div>Actions</div>
                </TableHeader>
                
                {testResults.map((result) => (
                  <TableRow key={result.id}>
                    <div>
                      <strong style={{ textTransform: 'capitalize' }}>
                        {result.testType} Test
                      </strong>
                    </div>
                    
                    <div>{formatDate(result.createdAt)}</div>
                    
                    <div>
                      <Badge color={result.result.hasDyslexia ? 'warning' : 'success'}>
                        {result.result.hasDyslexia ? 'Indicators Found' : 'No Indicators'}
                      </Badge>
                    </div>
                    
                    <div>
                      {result.result.confidence ? `${result.result.confidence}%` : 'N/A'}
                    </div>
                    
                    <ActionButtons>
                      <Button 
                        as={Link}
                        to={`/test-result/${result.id}`}
                        variant="secondary"
                        style={{ padding: '8px 16px', fontSize: '14px' }}
                      >
                        View
                      </Button>
                      <Button 
                        onClick={() => handleDownloadPDF(result.id)}
                        variant="primary"
                        style={{ padding: '8px 16px', fontSize: '14px' }}
                      >
                        Download PDF
                      </Button>
                    </ActionButtons>
                  </TableRow>
                ))}
              </ResultsTable>
            )}
          </div>
        </Container>
      </DashboardContainer>
    </div>
  );
};

export default DashboardPage;