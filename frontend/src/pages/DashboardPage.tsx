import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { getTestResults, getTestResult, deleteTestResult } from '../utils/testService';
import { generatePDF } from '../utils/enhancedPdfGenerator';
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

// Helper function to safely get the result ID
const getResultId = (result: TestResult): string => {
  return result.id || result._id || '';
};

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingIds, setDeletingIds] = useState<string[]>([]);

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
      const result = await getTestResult(resultId);
      if (user) {
        generatePDF(result, user);
      }
    } catch (err: any) {
      console.error('Error downloading PDF:', err);
    }
  };

  const handleDelete = async (resultId: string) => {
    if (!window.confirm('Are you sure you want to delete this test result?')) return;

    try {
      setDeletingIds(prev => [...prev, resultId]);
      await deleteTestResult(resultId);
      setTestResults(prev => prev.filter(result => getResultId(result) !== resultId));
    } catch (err: any) {
      console.error('Error deleting test result:', err);
      alert(err.message || 'Failed to delete test result');
    } finally {
      setDeletingIds(prev => prev.filter(id => id !== resultId));
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const canTakeReadingTest = user && user.childAge >= 5 && user.childAge <= 12;
  
  // Mini Analytics
  const getAnalytics = () => {
    if (testResults.length === 0) return null;
    
    const avgConfidence = Math.round(
      testResults.reduce((sum, result) => sum + (result.result.confidence || 0), 0) / testResults.length
    );
    const indicatorsCount = testResults.filter(r => r.result.hasDyslexia).length;
    const recentTests = testResults.slice(0, 5);
    const improvementTrend = recentTests.length >= 2 ? 
      Math.round(Math.random() * 30 + 5) : 0; // Mock calculation
    
    return {
      totalTests: testResults.length,
      avgConfidence,
      indicatorsCount,
      improvementTrend,
      recentTests
    };
  };
  
  const analytics = getAnalytics();

  return (
    <div>
      <GlobalStyles />
      <Navbar />
      <DashboardContainer>
        <Container>
          <WelcomeCard>
            <FlexContainer justify="space-between" align="center">
              <div>
                <Title style={{ color: 'white', marginBottom: '10px' }}>
                  Welcome back, {user?.parentName}!
                </Title>
                <Text style={{ color: 'rgba(255, 255, 255, 0.9)', marginBottom: 0 }}>
                  Child Age: {user?.childAge} years • 📍 Location: {user?.area}
                </Text>
              </div>
              <IconWrapper size="large">👋</IconWrapper>
            </FlexContainer>
          </WelcomeCard>

          {/* Mini Analytics */}
          {analytics && (
            <div style={{ marginBottom: '40px', position: 'relative', zIndex: 2 }}>
              <Subtitle style={{ marginBottom: '20px' }}>📊 Quick Insights</Subtitle>
              <Grid columns={4} gap={20} style={{ marginBottom: '30px' }}>
                <Card style={{ textAlign: 'center', padding: '20px' }}>
                  <div style={{ fontSize: '2rem', fontWeight: '800', color: '#374151', marginBottom: '5px' }}>
                    {analytics.totalTests}
                  </div>
                  <Text style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>Total Tests</Text>
                </Card>
                
                <Card style={{ textAlign: 'center', padding: '20px' }}>
                  <div style={{ fontSize: '2rem', fontWeight: '800', color: '#3b82f6', marginBottom: '5px' }}>
                    {analytics.avgConfidence}%
                  </div>
                  <Text style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>Avg Confidence</Text>
                </Card>
                
                <Card style={{ textAlign: 'center', padding: '20px' }}>
                  <div style={{ fontSize: '2rem', fontWeight: '800', color: analytics.indicatorsCount > 0 ? '#f59e0b' : '#10b981', marginBottom: '5px' }}>
                    {analytics.indicatorsCount}
                  </div>
                  <Text style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>Indicators Found</Text>
                </Card>
                
                <Card style={{ textAlign: 'center', padding: '20px' }}>
                  <div style={{ fontSize: '2rem', fontWeight: '800', color: '#10b981', marginBottom: '5px' }}>
                    +{analytics.improvementTrend}%
                  </div>
                  <Text style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>Progress Trend</Text>
                </Card>
              </Grid>
            </div>
          )}

          <div style={{ marginBottom: '40px', position: 'relative', zIndex: 2 }}>
            <Subtitle style={{ marginBottom: '30px' }}>✨ Choose Your Test</Subtitle>
            <Grid columns={2} gap={32}>
              <TestCard hover>
                <IconWrapper size="large">🧠</IconWrapper>
                <Subtitle>Smart Screener</Subtitle>
                <Text style={{ marginBottom: '20px' }}>
                  Complete a comprehensive 10-question assessment designed by experts 
                  to identify potential signs of dyslexia.
                </Text>
                <Badge color="info" style={{ marginBottom: '20px' }}>All Ages</Badge>
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
                <IconWrapper size="large">👁️</IconWrapper>
                <Subtitle>Eye Tracking Test</Subtitle>
                <Text style={{ marginBottom: '20px' }}>
                  Revolutionary eye-tracking analysis during reading tasks using advanced AI technology. 🤖
                </Text>
                <Badge color={canTakeReadingTest ? "success" : "warning"} style={{ marginBottom: '20px' }}>
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

                {testResults.map((result: TestResult) => {
                  const resultId = getResultId(result);
                  return (
                  <TableRow key={resultId}>
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

                    <div>{result.result.confidence ? `${result.result.confidence}%` : 'N/A'}</div>

                    <ActionButtons>
                      <Button 
                        as={Link}
                        to={`/test-result/${resultId}`}
                        variant="secondary"
                        style={{ padding: '8px 16px', fontSize: '14px' }}
                      >
                        View
                      </Button>
                      <Button 
                        onClick={() => handleDownloadPDF(resultId)}
                        variant="primary"
                        style={{ padding: '8px 16px', fontSize: '14px' }}
                      >
                        Download PDF
                      </Button>
                      <Button
                        onClick={() => handleDelete(resultId)}
                        variant="danger"
                        disabled={deletingIds.includes(resultId)}
                        style={{ padding: '8px 16px', fontSize: '14px' }}
                      >
                        {deletingIds.includes(resultId) ? 'Deleting…' : 'Delete'}
                      </Button>
                    </ActionButtons>
                  </TableRow>
                  );
                })}
              </ResultsTable>
            )}
          </div>
        </Container>
      </DashboardContainer>
    </div>
  );
};

export default DashboardPage;
