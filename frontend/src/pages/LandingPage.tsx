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
  GlobalStyles
} from '../components/shared/EnhancedStyledComponents';

const HeroSection = styled.div`
  background-image: url('/images/parent_mode.png');
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
    background: rgba(37, 33, 33, 0.3);
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
  font-family:'Baskerville', serif;
  margin-bottom: 24px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
 
  
  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

const HeroSubtitle = styled(Subtitle)`
  color: rgba(255, 255, 255, 0.95);
  font-size: 1.6rem;
  font-family:'Baskerville', serif;
  margin-bottom: 20px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

const HeroDescription = styled(Text)`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.6rem;
  font-family:'Baskerville', serif;
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
  background: #d1e2f3ff;
  border: 1px solid #e5e7eb;
`;


const Section = styled.section`
  padding: 80px 0;
`;

const SectionTitle = styled(Title)`
  text-align: center;
  margin-bottom: 60px;
`;

const CallToActionSection = styled.div`
  background: #f8fafc;
  padding: 100px 0;
  text-align: center;
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

const LandingPage: React.FC = () => {
  return (
    <div>
      <GlobalStyles />
      <Navbar showAuthButtons={true} />

      <HeroSection>
        <Container>
          <HeroTitle>AKSHAR</HeroTitle>
          <HeroSubtitle>AI-based Real-time Dyslexia Detection System</HeroSubtitle>
          <HeroDescription text-color="black">
            Early detection and intervention for dyslexia using advanced AI technology
            and eye-tracking analysis to help children overcome reading challenges and unlock their full potential.
          </HeroDescription>

          <ButtonGroup>
            <Button
              as={Link}
              to="/signup"
              variant="primary"
              size="large"
            >
              Get Started Free
            </Button>
            <Button
              as={Link}
              to="/about"
              variant="secondary"
              size="large"
            >
              Learn More
            </Button>
          </ButtonGroup>



        </Container>
      </HeroSection>

      <Section>
        <Container>
          <SectionTitle> How AKSHAR Works</SectionTitle>
          <Grid columns={3} gap={32}>
            <FeatureCard>
              <img
                src="/images/quiz_bg.png"
                alt="Smart Screening"
                style={{ width: '110px', height: '110px', marginBottom: '24px' }}
              />
              <Subtitle>Smart Screening</Subtitle>
              <Text>
                Complete a comprehensive 10-question screening assessment
                designed by experts to identify potential signs of dyslexia.
              </Text>
              <span style={{
                display: 'inline-block',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 600,
                textTransform: 'uppercase',
                backgroundColor: '#f7faf7ff',
                color: '#1e40af'
              }}>Expert Designed</span>
            </FeatureCard>


            <FeatureCard>
              <img
                src="/images/eye_bg.png"
                alt="eye Tracking Analysis"
                style={{ width: '110px', height: '110px', marginBottom: '24px' }}
              />
              <Subtitle>Eye Tracking Analysis</Subtitle>
              <Text>
                Revolutionary eye-tracking technology monitors reading patterns
                and identifies difficulties in real-time with precision.
              </Text>
              <span style={{
                display: 'inline-block',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 600,
                textTransform: 'uppercase',
                backgroundColor: '#d1fae5',
                color: '#065f46'
              }}>Real-time</span>
            </FeatureCard>

            <FeatureCard>
              <img
                src="/images/ai_bg.png"
                alt="AI-Powered Insights"
                style={{ width: '110px', height: '110px', marginBottom: '24px' }}
              />
              <Subtitle>AI-Powered Insights</Subtitle>
              <Text>
                Get detailed reports with professional recommendations
                and personalized guidance for your child's learning journey.
              </Text>
              <span style={{
                display: 'inline-block',
                padding: '4px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: 600,
                textTransform: 'uppercase',
                backgroundColor: '#fef3c7',
                color: '#92400e'
              }}>AI-Powered</span>
            </FeatureCard>
          </Grid>
        </Container>
      </Section>

      <CallToActionSection>
        <Container>
          <Title> Ready to Help Your Child?</Title>
          <Text style={{ fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto 40px' }}>
            Join thousands of parents who have already discovered AKSHAR's
            innovative approach to dyslexia detection and intervention.
          </Text>


          <ButtonGroup>
            <Button
              as={Link}
              to="/signup"
              variant="primary"
              size="large"
            >
              Start Free Assessment
            </Button>
            <Button
              as={Link}
              to="/login"
              variant="secondary"
              size="large"
            >
              Sign In
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
                <span style={{ color: '#9ca3af' }}>email: scraperpilot3@gmail.com</span>
                <span style={{ color: '#9ca3af' }}>Contact Us @ +91 8530258831</span>
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

          </div>
        </Container>
      </Section>
    </div>
  );
};

export default LandingPage;