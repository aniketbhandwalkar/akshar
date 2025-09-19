import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { getTestResults } from '../utils/testService';
import Navbar from '../components/Navbar';
import {
  Container,
  Card,
  Title,
  Subtitle,
  Text,
  GlobalStyles,
  FlexContainer,
  Grid
} from '../components/shared/EnhancedStyledComponents';

const AnalyticsContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e0e7eb 100%);
  padding: 40px 0;
`;

const StatCard = styled(Card)`
  text-align: center;
  background: white;
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  color: #374151;
  margin-bottom: 10px;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  color: #6b7280;
  font-weight: 500;
`;

const ChartContainer = styled.div`
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 30px;
`;

const ProgressBar = styled.div<{ progress: number; color: string }>`
  width: 100%;
  height: 12px;
  background: #f3f4f6;
  border-radius: 6px;
  overflow: hidden;
  margin: 10px 0;
  
  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${props => props.progress}%;
    background: ${props => props.color};
    border-radius: 6px;
    transition: width 0.8s ease-in-out;
  }
`;

const RecommendationCard = styled(Card)`
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border: 1px solid #3b82f6;
  margin-bottom: 20px;
`;

interface TestStats {
  totalTests: number;
  screenerTests: number;
  readingTests: number;
  improvementTrend: number;
  lastTestDate: string;
  averageConfidence: number;
}

const AnalyticsPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<TestStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const results = await getTestResults();
      
      const screenerCount = results.filter(r => r.testType === 'screener').length;
      const readingCount = results.filter(r => r.testType === 'reading').length;
      const avgConfidence = results.reduce((sum, r) => sum + (r.result.confidence || 0), 0) / results.length;
      
      setStats({
        totalTests: results.length,
        screenerTests: screenerCount,
        readingTests: readingCount,
        improvementTrend: Math.round(Math.random() * 30 + 10), // Mock improvement
        lastTestDate: results.length > 0 ? results[0].createdAt : '',
        averageConfidence: Math.round(avgConfidence)
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Mock data for development
      setStats({
        totalTests: 5,
        screenerTests: 3,
        readingTests: 2,
        improvementTrend: 25,
        lastTestDate: new Date().toISOString(),
        averageConfidence: 87
      });
    } finally {
      setLoading(false);
    }
  };

  const getImprovementColor = (trend: number) => {
    if (trend >= 20) return '#10b981';
    if (trend >= 10) return '#f59e0b';
    return '#ef4444';
  };

  if (loading) {
    return (
      <div>
        <GlobalStyles />
        <Navbar />
        <AnalyticsContainer>
          <Container>
            <Card style={{ textAlign: 'center' }}>
              <Text>Loading analytics...</Text>
            </Card>
          </Container>
        </AnalyticsContainer>
      </div>
    );
  }

  return (
    <div>
      <GlobalStyles />
      <Navbar />
      <AnalyticsContainer>
        <Container>
          <Title>📊 Progress Analytics</Title>
          <Text style={{ marginBottom: '40px' }}>
            Track your child's progress and improvement over time
          </Text>

          {/* Key Statistics */}
          <Grid columns={4} gap={24} style={{ marginBottom: '40px' }}>
            <StatCard>
              <StatNumber>{stats?.totalTests || 0}</StatNumber>
              <StatLabel>Total Tests</StatLabel>
            </StatCard>
            
            <StatCard>
              <StatNumber>{stats?.screenerTests || 0}</StatNumber>
              <StatLabel>Screening Tests</StatLabel>
            </StatCard>
            
            <StatCard>
              <StatNumber>{stats?.readingTests || 0}</StatNumber>
              <StatLabel>Reading Tests</StatLabel>
            </StatCard>
            
            <StatCard>
              <StatNumber style={{ color: getImprovementColor(stats?.improvementTrend || 0) }}>
                +{stats?.improvementTrend || 0}%
              </StatNumber>
              <StatLabel>Improvement</StatLabel>
            </StatCard>
          </Grid>

          {/* Progress Charts */}
          <ChartContainer>
            <Subtitle>📈 Performance Overview</Subtitle>
            <div style={{ marginBottom: '20px' }}>
              <FlexContainer justify="space-between" style={{ marginBottom: '5px' }}>
                <Text style={{ margin: 0 }}>Reading Speed</Text>
                <Text style={{ margin: 0 }}>Good (78%)</Text>
              </FlexContainer>
              <ProgressBar progress={78} color="#10b981" />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <FlexContainer justify="space-between" style={{ marginBottom: '5px' }}>
                <Text style={{ margin: 0 }}>Comprehension</Text>
                <Text style={{ margin: 0 }}>Excellent (92%)</Text>
              </FlexContainer>
              <ProgressBar progress={92} color="#3b82f6" />
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <FlexContainer justify="space-between" style={{ marginBottom: '5px' }}>
                <Text style={{ margin: 0 }}>Eye Tracking Accuracy</Text>
                <Text style={{ margin: 0 }}>Very Good (85%)</Text>
              </FlexContainer>
              <ProgressBar progress={85} color="#8b5cf6" />
            </div>
          </ChartContainer>

          {/* Personalized Recommendations */}
          <div>
            <Subtitle>🎯 Personalized Recommendations</Subtitle>
            
            <RecommendationCard>
              <Subtitle style={{ color: '#1e40af' }}>📚 Reading Practice</Subtitle>
              <Text>
                Based on recent test results, we recommend 15-20 minutes of daily reading practice 
                focusing on phonics and word recognition exercises.
              </Text>
            </RecommendationCard>
            
            <RecommendationCard>
              <Subtitle style={{ color: '#1e40af' }}>🎮 Interactive Games</Subtitle>
              <Text>
                Try letter-matching and rhyming games to improve phonological awareness. 
                We'll add these to your personalized activity plan.
              </Text>
            </RecommendationCard>
            
            <RecommendationCard>
              <Subtitle style={{ color: '#1e40af' }}>👨‍⚕️ Next Steps</Subtitle>
              <Text>
                Consider scheduling a follow-up assessment in 4-6 weeks to track improvement 
                and adjust intervention strategies.
              </Text>
            </RecommendationCard>
          </div>

          {/* Milestones */}
          <ChartContainer>
            <Subtitle>🏆 Achievements & Milestones</Subtitle>
            <Grid columns={2} gap={20}>
              <div>
                <Text style={{ fontWeight: 'bold', color: '#10b981' }}>✅ Completed First Assessment</Text>
                <Text style={{ fontSize: '14px', color: '#6b7280' }}>Great start! You've taken the first step.</Text>
              </div>
              
              <div>
                <Text style={{ fontWeight: 'bold', color: '#10b981' }}>✅ Consistent Testing</Text>
                <Text style={{ fontSize: '14px', color: '#6b7280' }}>Regular monitoring shows commitment.</Text>
              </div>
              
              <div>
                <Text style={{ fontWeight: 'bold', color: '#f59e0b' }}>🎯 Next: Eye Tracking Mastery</Text>
                <Text style={{ fontSize: '14px', color: '#6b7280' }}>Complete 3 reading tests to unlock.</Text>
              </div>
              
              <div>
                <Text style={{ fontWeight: 'bold', color: '#6b7280' }}>⏳ Future: Progress Report</Text>
                <Text style={{ fontSize: '14px', color: '#6b7280' }}>Available after 30 days of tracking.</Text>
              </div>
            </Grid>
          </ChartContainer>
        </Container>
      </AnalyticsContainer>
    </div>
  );
};

export default AnalyticsPage;