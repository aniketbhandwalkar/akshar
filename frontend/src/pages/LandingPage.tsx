
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
  /* Darkened layered background using parent_mode with a stronger overlay */
  background-image: linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 60%), url('/images/parent_mode.png');
  background-size: cover;          /* fill full width/height; may crop */
  background-position: center 30%; /* bias framing slightly toward the top */
  background-repeat: no-repeat;
  color: white;
  padding: 120px 0;
  text-align: center;
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;

  

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
  color: white;
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

  .hover-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;

    img, video {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
      will-change: transform;
    }

    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,0.6);
      color: #fff;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      opacity: 1;
      transition: opacity 0.3s ease;
      padding: 12px;
      text-align: center;
    }

    .overlay-permanent {
      opacity: 1 !important;
      background-color: rgba(0,0,0,0.45); /* make slightly lighter so video remains visible */
    }

    video {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
      will-change: transform;
      display: block;
    }

    &:hover {
      img, video { transform: scale(1.06); }
    }
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
            Is your child struggling to read? AKSHAR uses AI-powered eye-tracking to detect dyslexia early and guide them toward success.
          </HeroDescription>

          <ButtonGroup>
            <Button
              as={Link}
              to="/signup"
              variant="primary"
              size="large"
            >
              Start Your Assessment
            </Button>
            <Button
              as={Link}
              to="/about"
              variant="secondary"
              size="large"
            >
              Explore the Features
            </Button>
          </ButtonGroup>



        </Container>
      </HeroSection>

      <Section>
        <Container>
          <SectionTitle> How AKSHAR Works</SectionTitle>
          <Grid columns={3} gap={32}>

            <FeatureCard style={{ position: 'relative', height: '420px' }}>
              <div className="hover-wrapper">
                <video
                  poster="/images/eye_bg.png"
                  muted
                  autoPlay
                  loop
                  playsInline
                  preload="metadata"
                  style={{ display: 'block' }}
                >
                  <source src="/images/sc_test.mp4" type="video/mp4" />
                </video>

                <div className="overlay overlay-permanent">
                  <Subtitle style={{ color: '#fff' }}>Smart Screening</Subtitle>
                  <Text style={{ color: '#fff' }}>
                    Complete a comprehensive 10-question screening assessment
                    designed by experts to identify potential signs of dyslexia.
                  </Text>
                </div>
              </div>
            </FeatureCard>


            <FeatureCard style={{ position: 'relative', height: '420px' }}>
              <div className="hover-wrapper">
                <video
                  poster="/images/eye_bg.png"
                  muted
                  autoPlay
                  loop
                  playsInline
                  preload="metadata"
                  style={{ display: 'block' }}
                >
                  <source src="/images/eye_scanner.mp4" type="video/mp4" />
                </video>

                <div className="overlay overlay-permanent">
                  <Subtitle style={{ color: '#fff' }}>Eye Tracking Analysis</Subtitle>
                  <Text style={{ color: '#fff' }}>
                    Revolutionary eye-tracking technology monitors reading patterns and
                    identifies difficulties in real-time with precision.
                  </Text>
                </div>
              </div>
            </FeatureCard>

            <FeatureCard style={{ position: 'relative', height: '420px' }}>
              <div className="hover-wrapper">
                <video
                  poster="/images/eye_bg.png"
                  muted
                  autoPlay
                  loop
                  playsInline
                  preload="metadata"
                  style={{ display: 'block' }}
                >
                  <source src="/images/ai_video.mp4" type="video/mp4" />
                </video>

                <div className="overlay overlay-permanent">
                  <Subtitle style={{ color: '#fff' }}>AI-Powered Insights</Subtitle>
                  <Text style={{ color: '#fff' }}>
                    Get detailed reports with professional recommendations
                    and personalized guidance for your child's learning journey.

                  </Text>
                </div>
              </div>
            </FeatureCard>

          </Grid>
        </Container>
      </Section>

      <CallToActionSection>
        <Container>
          <Title> Ready to Help Your Child?</Title>
          <Text style={{ fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto 40px' }}>
            Join AKSHAR family today and take the first step towards empowering your child
            with the right tools and support for a successful learning journey.
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