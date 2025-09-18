import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Navbar from '../components/Navbar';
import {
  Container,
  Title,
  Subtitle,
  Text,
  Button,
  Card,
  FlexContainer,
  Grid,
  FloatingElement,
  Sparkle,
  IconWrapper,
  Badge,
  GlobalStyles
} from '../components/shared/EnhancedStyledComponents';

const HeroSection = styled.div`
  background-image: url('/images/parentmode.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  color: white;
  padding: 120px 0;
  text-align: center;
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(102, 126, 234, 0.8) 0%,
      rgba(118, 75, 162, 0.9) 100%
    );
    z-index: 1;
  }
  
  & > * {
    position: relative;
    z-index: 2;
  }
`;

const HeroTitle = styled(Title)`
  color: white;
  font-size: 4.5rem;
  margin-bottom: 24px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

const HeroSubtitle = styled(Subtitle)`
  color: rgba(255, 255, 255, 0.95);
  font-size: 1.6rem;
  margin-bottom: 20px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

const HeroDescription = styled(Text)`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.2rem;
  margin-bottom: 40px;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
    max-width: 90%;
  }
`;

const FeatureCard = styled(Card)`
  text-align: center;
  height: 100%;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid rgba(102, 126, 234, 0.1);
  
  &:hover {
    transform: translateY(-12px) scale(1.02);
    box-shadow: 0 20px 60px rgba(102, 126, 234, 0.2);
    border-color: rgba(102, 126, 234, 0.3);
  }
`;

const FeatureIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 24px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
  transition: transform 0.3s ease;
  
  ${FeatureCard}:hover & {
    transform: scale(1.1) rotate(5deg);
  }
`;

const Section = styled.section`
  padding: 80px 0;
`;

const SectionTitle = styled(Title)`
  text-align: center;
  margin-bottom: 60px;
`;

const CallToActionSection = styled.div`
  background: linear-gradient(145deg, #f8fafc 0%, #e0e7ff 100%);
  padding: 100px 0;
  text-align: center;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 20"><defs><radialGradient id="a" cx="50%" cy="50%" r="50%"><stop offset="0%" style="stop-color:rgba(102,126,234,0.1)"/><stop offset="100%" style="stop-color:rgba(102,126,234,0)"/></radialGradient></defs><circle cx="50" cy="10" r="10" fill="url(%23a)"/></svg>');
    animation: float 20s ease-in-out infinite;
  }
`;

const TestimonialCard = styled(Card)<{ animated?: boolean }>`
  max-width: 600px;
  margin: 40px auto;
  background: linear-gradient(145deg, #ffffff 0%, #f1f5f9 100%);
  border: 2px solid rgba(102, 126, 234, 0.1);
  
  ${props => props.animated && `
    animation: fadeIn 0.8s ease-out 0.4s both;
  `}
`;

const TestimonialText = styled.p`
  font-size: 1.2rem;
  font-style: italic;
  color: #4b5563;
  margin-bottom: 16px;
  line-height: 1.6;
`;

const TestimonialAuthor = styled.p`
  font-weight: 600;
  color: #667eea;
  margin: 0;
`;

const ButtonGroup = styled(FlexContainer)`
  justify-content: center;
  gap: 24px;
  margin-top: 48px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-top: 60px;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    gap: 24px;
    margin-top: 40px;
  }
`;

const StatCard = styled.div<{ animated?: boolean; delay?: number }>`
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  padding: 24px 32px;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-4px);
    background: rgba(255, 255, 255, 0.3);
  }
  
  ${props => props.animated && `
    animation: fadeIn 0.8s ease-out ${props.delay || 0}s both;
  `}
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  color: white;
  margin-bottom: 8px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  font-family: 'Poppins', sans-serif;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
`;

const LandingPage: React.FC = () => {
  return (
    <div>
      <GlobalStyles />
      <Navbar showAuthButtons={true} />
      
      <HeroSection>
        <Container>
          {/* Floating sparkles */}
          <Sparkle top="20%" left="10%" delay={0} />
          <Sparkle top="60%" left="85%" delay={1} />
          <Sparkle top="30%" left="75%" delay={2} />
          <Sparkle top="80%" left="15%" delay={0.5} />
          
          <FloatingElement delay={0}>
            <HeroTitle animated gradient>AKSHAR</HeroTitle>
          </FloatingElement>
          
          <FloatingElement delay={0.2}>
            <HeroSubtitle>AI-based Real-time Dyslexia Detection System</HeroSubtitle>
          </FloatingElement>
          
          <FloatingElement delay={0.4}>
            <HeroDescription>
              🌟 Early detection and intervention for dyslexia using advanced AI technology 
              and eye-tracking analysis to help children overcome reading challenges and unlock their full potential.
            </HeroDescription>
          </FloatingElement>
          
          <FloatingElement delay={0.6}>
            <ButtonGroup>
              <Button 
                as={Link} 
                to="/signup" 
                variant="glass"
                size="large"
                animated
              >
                🚀 Get Started Free
              </Button>
              <Button 
                as={Link} 
                to="/about"
                variant="glass"
                size="large"
              >
                📚 Learn More
              </Button>
            </ButtonGroup>
          </FloatingElement>
          
          {/* Stats Section */}
          <StatsContainer>
            <StatCard animated delay={0.8}>
              <StatNumber>10,000+</StatNumber>
              <StatLabel>Children Helped</StatLabel>
            </StatCard>
            <StatCard animated delay={1}>
              <StatNumber>95%</StatNumber>
              <StatLabel>Accuracy Rate</StatLabel>
            </StatCard>
            <StatCard animated delay={1.2}>
              <StatNumber>500+</StatNumber>
              <StatLabel>Happy Families</StatLabel>
            </StatCard>
          </StatsContainer>
        </Container>
      </HeroSection>

      <Section>
        <Container>
          <SectionTitle animated>✨ How AKSHAR Works</SectionTitle>
          <Grid columns={3} gap={32} animated>
            <FeatureCard hover>
              <IconWrapper animated size="large">
                🧠
              </IconWrapper>
              <Subtitle animated>Smart Screening</Subtitle>
              <Text animated delay={0.2}>
                Complete a comprehensive 10-question screening assessment 
                designed by experts to identify potential signs of dyslexia.
              </Text>
              <Badge color="info" animated>Expert Designed</Badge>
            </FeatureCard>
            
            <FeatureCard hover>
              <IconWrapper animated size="large">
                👁️
              </IconWrapper>
              <Subtitle animated>Eye Tracking Analysis</Subtitle>
              <Text animated delay={0.4}>
                Revolutionary eye-tracking technology monitors reading patterns 
                and identifies difficulties in real-time with precision.
              </Text>
              <Badge color="success" animated>Real-time</Badge>
            </FeatureCard>
            
            <FeatureCard hover>
              <IconWrapper animated size="large">
                🤖
              </IconWrapper>
              <Subtitle animated>AI-Powered Insights</Subtitle>
              <Text animated delay={0.6}>
                Get detailed reports with professional recommendations 
                and personalized guidance for your child's learning journey.
              </Text>
              <Badge color="warning" animated>AI-Powered</Badge>
            </FeatureCard>
          </Grid>
        </Container>
      </Section>

      <CallToActionSection>
        <Container>
          <Title animated gradient>🎆 Ready to Help Your Child?</Title>
          <Text animated style={{ fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto 40px' }}>
            Join thousands of parents who have already discovered AKSHAR's 
            innovative approach to dyslexia detection and intervention. 🌟
          </Text>
          
          <TestimonialCard animated>
            <TestimonialText>
              "AKSHAR helped us identify our daughter's reading difficulties early. 
              The detailed reports and recommendations were invaluable!"
            </TestimonialText>
            <TestimonialAuthor>— Sarah M., Parent</TestimonialAuthor>
          </TestimonialCard>
          
          <ButtonGroup>
            <Button 
              as={Link} 
              to="/signup" 
              variant="gradient"
              size="large"
              animated
            >
              🚀 Start Free Assessment
            </Button>
            <Button 
              as={Link} 
              to="/login"
              variant="secondary"
              size="large"
            >
              🔑 Sign In
            </Button>
          </ButtonGroup>
        </Container>
      </CallToActionSection>

      <Section style={{ backgroundColor: '#1f2937', color: 'white' }}>
        <Container>
          <Grid columns={4} gap={40}>
            <div>
              <Subtitle style={{ color: 'white' }}>AKSHAR</Subtitle>
              <Text style={{ color: '#9ca3af' }}>
                Empowering children through early dyslexia detection and intervention.
              </Text>
            </div>
            
            <div>
              <Subtitle style={{ color: 'white', fontSize: '1.2rem' }}>Quick Links</Subtitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Link to="/about" style={{ color: '#9ca3af', textDecoration: 'none' }}>About Us</Link>
                <Link to="/help" style={{ color: '#9ca3af', textDecoration: 'none' }}>Help & Support</Link>
                <Link to="/signup" style={{ color: '#9ca3af', textDecoration: 'none' }}>Get Started</Link>
              </div>
            </div>
            
            <div>
              <Subtitle style={{ color: 'white', fontSize: '1.2rem' }}>Support</Subtitle>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ color: '#9ca3af' }}>help@akshar.com</span>
                <span style={{ color: '#9ca3af' }}>1-800-AKSHAR</span>
                <span style={{ color: '#9ca3af' }}>24/7 Support</span>
              </div>
            </div>
            
            <div>
              <Subtitle style={{ color: 'white', fontSize: '1.2rem' }}>Follow Us</Subtitle>
              <div style={{ display: 'flex', gap: '16px' }}>
                <span style={{ color: '#9ca3af' }}>Facebook</span>
                <span style={{ color: '#9ca3af' }}>Twitter</span>
                <span style={{ color: '#9ca3af' }}>LinkedIn</span>
              </div>
            </div>
          </Grid>
          
          <div style={{ 
            borderTop: '1px solid #374151', 
            marginTop: '40px', 
            paddingTop: '20px', 
            textAlign: 'center' 
          }}>
            <Text style={{ color: '#9ca3af', margin: 0 }}>
              © 2024 AKSHAR. All rights reserved.
            </Text>
          </div>
        </Container>
      </Section>
    </div>
  );
};

export default LandingPage;