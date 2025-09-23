import React from 'react';
import styled from 'styled-components';
import Navbar from '../components/Navbar';
import {
  Container,
  Title,
  Card,
  Button,
  GlobalStyles
} from '../components/shared/EnhancedStyledComponents';

// Configure the LinkedIn URLs for team members
const LINKEDIN_URL_MUKUND = 'https://www.linkedin.com/in/mukund-dhenge';
const LINKEDIN_URL_YASHASVI = 'https://www.linkedin.com/in/yashasvi-yede-87b690259';
const LINKEDIN_URL_LUCKY = 'https://www.linkedin.com/in/luckynimbarte';
const LINKEDIN_URL_DEWANSHU = 'https://www.linkedin.com/in/dewanshu-katre-31462b348';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const HeroSection = styled.section`
  padding: 120px 0 80px;
  background: white;
  margin-top: 80px;
`;

const IntroContainer = styled(Container)`
  max-width: 1200px;
`;

const MainIntroDiv = styled.div`
  display: flex;
  align-items: center;
  gap: 60px;
  margin-bottom: 100px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 40px;
    text-align: center;
  }
`;

const IntroImageContainer = styled.div`
  flex: 1;
  max-width: 500px;
  
  img {
    width: 100%;
    height: auto;
    border-radius: 20px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
    
    &:hover {
      transform: translateY(-5px);
    }
  }
`;

const IntroContent = styled.div`
  flex: 1;
  
  h1 {
    font-size: 3.5rem;
    font-family: 'Baskerville', serif;
    color: #2d3748;
    margin-bottom: 24px;
    line-height: 1.2;
    
    @media (max-width: 768px) {
      font-size: 2.5rem;
    }
  }
  
  h2 {
    font-size: 1.8rem;
    font-family: 'Baskerville', serif;
    color: #4a5568;
    margin-bottom: 32px;
    font-weight: 400;
    
    @media (max-width: 768px) {
      font-size: 1.5rem;
    }
  }
  
  p {
    font-size: 1.2rem;
    line-height: 1.8;
    color: #2d3748;
    margin-bottom: 20px;
    font-family: 'Arial', sans-serif;
  }
`;

const FeaturesSection = styled.section`
  padding: 80px 0;
  background: #f8fafc;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 40px;
  margin-top: 60px;
`;

const FeatureCard = styled(Card)`
  text-align: center;
  padding: 40px 30px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  /* ensure cards have consistent height so actions align */
  min-height: 420px;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
  }
`;

const FeatureImageContainer = styled.div`
  width: 120px;
  height: 120px;
  margin: 0 auto 30px;
  border-radius: 50%;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
  
  .icon {
    font-size: 3rem;
    color: white;
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  font-family: 'Baskerville', serif;
  color: #2d3748;
  margin-bottom: 20px;
  font-weight: 600;
`;

const FeatureDescription = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  color: #4a5568;
  font-family: 'Arial', sans-serif;
`;

const FeatureActions = styled.div`
  margin-top: auto;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SectionTitle = styled(Title)`
  text-align: center;
  font-size: 3rem;
  font-family: 'Baskerville', serif;
  color: #2d3748;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;


const AboutPage: React.FC = () => {
  return (
    <PageContainer>
      <GlobalStyles />
      <Navbar showAuthButtons={true} />

      <HeroSection>
        <IntroContainer>
          {/* Main Introduction Section */}
          <MainIntroDiv>
            <IntroImageContainer>
              <img
                src="/images/logo_akshar.png"
                alt="AKSHAR - Dyslexia Detection System"
                onError={(e) => {

                  e.currentTarget.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                  e.currentTarget.style.display = 'flex';
                  e.currentTarget.style.alignItems = 'center';
                  e.currentTarget.style.justifyContent = 'center';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.fontSize = '4rem';
                  e.currentTarget.style.fontFamily = 'Baskerville, serif';
                  e.currentTarget.innerHTML = 'AKSHAR';
                }}
              />
            </IntroImageContainer>

            <IntroContent>
              <h1>About AKSHAR</h1>
              <h2>Revolutionizing Dyslexia Detection Through AI</h2>
              <p>
                AKSHAR is an innovative AI-powered platform that combines cutting-edge eye-tracking technology
                with advanced machine learning algorithms to provide early, accurate, and non-invasive dyslexia detection.
              </p>
              <p>
                Unlike traditional assessment methods that can be time-consuming and subjective, AKSHAR offers
                a seamless, engaging experience that analyzes reading patterns in real-time, providing instant
                insights to help children, parents, and educators take proactive steps toward reading success.
              </p>
              <p>
                Our mission is to democratize dyslexia screening by making it accessible, affordable, and
                accurate for everyone, ensuring that no child's potential goes unrecognized due to undiagnosed
                reading difficulties.
              </p>
            </IntroContent>
          </MainIntroDiv>
        </IntroContainer>
      </HeroSection>

      <FeaturesSection>
        <Container>
          <SectionTitle>Meet Our Team</SectionTitle>


          <FeaturesGrid>
            {/* Mukund Profile */}
            <FeatureCard>
              <FeatureImageContainer>
                <img
                  src="/images/proPFP.jpg"
                  alt="Eye Tracking Technology"

                />
              </FeatureImageContainer>
              <FeatureTitle>Mukund Dhenge</FeatureTitle>
              <FeatureDescription>
                With Expertise in Machine learning and Computer vision technologies, Mukund has been instrumental in developing
                the core algorithms that power AKSHAR's dyslexia detection capabilities. His innovative approach to
                eye-tracking technology ensures accurate and reliable assessments, making early detection accessible
                to all children.
              </FeatureDescription>
              <FeatureActions>
                <a href={LINKEDIN_URL_MUKUND} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  <Button variant="primary" size="small" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4.98 3.5C4.98 4.88071 3.88071 6 2.5 6C1.11929 6 0 4.88071 0 3.5C0 2.11929 1.11929 1 2.5 1C3.88071 1 4.98 2.11929 4.98 3.5Z" fill="currentColor" />
                      <path d="M0.5 8H4.5V23H0.5V8Z" fill="currentColor" />
                      <path d="M8.5 8H12.1V10.1H12.2C12.9 9 14.6 7.8 17.1 7.8C21.7 7.8 22 10.9 22 15.3V23H18V15.9C18 14.3 17.9 12.2 15 12.2C12.1 12.2 11.6 14.1 11.6 15.8V23H8.5V8Z" fill="currentColor" />
                    </svg>
                    Connect on LinkedIn
                  </Button>
                </a>
              </FeatureActions>
            </FeatureCard>

            {/* Yashasvi Profile */}
            <FeatureCard>
              <FeatureImageContainer>
                <img
                  src="/images/yos.jpg"
                  alt="Yashasvi Yede"
                />
              </FeatureImageContainer>
              <FeatureTitle>Yashasvi Yede </FeatureTitle>
              <FeatureDescription>
                Every great system needs a spine — Yashasvi built ours, Yashasvi has architected AKSHAR's robust and scalable
                infrastructure. Her expertise ensures that our platform can handle real-time data processing and
                deliver instant results, providing a seamless experience for users worldwide.
              </FeatureDescription>
              <FeatureActions>
                <a href={LINKEDIN_URL_YASHASVI} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  <Button variant="primary" size="small" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4.98 3.5C4.98 4.88071 3.88071 6 2.5 6C1.11929 6 0 4.88071 0 3.5C0 2.11929 1.11929 1 2.5 1C3.88071 1 4.98 2.11929 4.98 3.5Z" fill="currentColor" />
                      <path d="M0.5 8H4.5V23H0.5V8Z" fill="currentColor" />
                      <path d="M8.5 8H12.1V10.1H12.2C12.9 9 14.6 7.8 17.1 7.8C21.7 7.8 22 10.9 22 15.3V23H18V15.9C18 14.3 17.9 12.2 15 12.2C12.1 12.2 11.6 14.1 11.6 15.8V23H8.5V8Z" fill="currentColor" />
                    </svg>
                    Connect on LinkedIn
                  </Button>
                </a>
              </FeatureActions>
            </FeatureCard>

            {/* Lucky Profile */}
            <FeatureCard>
              <FeatureImageContainer>
                <img
                  src="/images/lucky.jpg"
                  alt="Lucky Nimbarte"
                />
              </FeatureImageContainer>
              <FeatureTitle>Lucky Nimbarte</FeatureTitle>
              <FeatureDescription>
                What's is an idea without execution? Lucky with his expertise in frontend development has crafted AKSHAR's
                intuitive and user-friendly interface. His focus on accessibility ensures that our platform is easy to
                navigate for children, parents, and educators alike, making dyslexia screening a hassle-free experience.
              </FeatureDescription>
              <FeatureActions>
                <a href={LINKEDIN_URL_LUCKY} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  <Button variant="primary" size="small" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <svg width="16" height="16" viewBox="0 0 48 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4.98 3.5C4.98 4.88071 3.88071 6 2.5 6C1.11929 6 0 4.88071 0 3.5C0 2.11929 1.11929 1 2.5 1C3.88071 1 4.98 2.11929 4.98 3.5Z" fill="currentColor" />
                      <path d="M0.5 8H4.5V23H0.5V8Z" fill="currentColor" />
                      <path d="M8.5 8H12.1V10.1H12.2C12.9 9 14.6 7.8 17.1 7.8C21.7 7.8 22 10.9 22 15.3V23H18V15.9C18 14.3 17.9 12.2 15 12.2C12.1 12.2 11.6 14.1 11.6 15.8V23H8.5V8Z" fill="currentColor" />
                    </svg>
                    Connect on LinkedIn
                  </Button>
                </a>
              </FeatureActions>
            </FeatureCard>

            {/* Dewanshu Profile */}
            <FeatureCard>
              <FeatureImageContainer>
                <img
                  src="/images/dew.png"
                  alt="Dewanshu Katre"
                />
              </FeatureImageContainer>
              <FeatureTitle>Dewanshu Katre</FeatureTitle>
              <FeatureDescription>
                "Every idea needs a vision" and Dewanshu is the visionary behind the AKSHAR, with experince in UI/UX design,
                he has ensured that our platform not only looks appealing but also provides an engaging and supportive
                experience for users. His dedication to user-centric design helps AKSHAR stand out as a leader in dyslexia
                detection technology.
              </FeatureDescription>
              <FeatureActions>
                <a href={LINKEDIN_URL_DEWANSHU} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                  <Button variant="primary" size="small" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4.98 3.5C4.98 4.88071 3.88071 6 2.5 6C1.11929 6 0 4.88071 0 3.5C0 2.11929 1.11929 1 2.5 1C3.88071 1 4.98 2.11929 4.98 3.5Z" fill="currentColor" />
                      <path d="M0.5 8H4.5V23H0.5V8Z" fill="currentColor" />
                      <path d="M8.5 8H12.1V10.1H12.2C12.9 9 14.6 7.8 17.1 7.8C21.7 7.8 22 10.9 22 15.3V23H18V15.9C18 14.3 17.9 12.2 15 12.2C12.1 12.2 11.6 14.1 11.6 15.8V23H8.5V8Z" fill="currentColor" />
                    </svg>
                    Connect on LinkedIn
                  </Button>
                </a>
              </FeatureActions>
            </FeatureCard>
          </FeaturesGrid>
        </Container>
      </FeaturesSection>
    </PageContainer>
  );
};

export default AboutPage;