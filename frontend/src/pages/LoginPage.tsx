import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import {
  Container,
  Card,
  Title,
  Button,
  Input,
  Label,
  FormGroup,
  ErrorMessage,
  Text,
  LoadingSpinner,
  GlobalStyles
} from '../components/shared/EnhancedStyledComponents';

const LoginContainer = styled.div`
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
    background-image: radial-gradient(circle at 20% 50%, rgba(102, 126, 234, 0.05) 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, rgba(118, 75, 162, 0.05) 0%, transparent 50%);
  }
`;

const LoginCard = styled(Card)`
  max-width: 450px;
  margin: 40px auto;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  z-index: 2;
`;

const Form = styled.form`
  width: 100%;
`;

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <GlobalStyles />
      <Navbar />
      <LoginContainer>
        <Container>
          <LoginCard hover>
            <Title gradient animated style={{ textAlign: 'center', marginBottom: '30px' }}>
              Welcome Back
            </Title>
            
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                />
              </FormGroup>

              {error && <ErrorMessage>{error}</ErrorMessage>}

              <FormGroup style={{ marginTop: '30px' }}>
                <Button 
                  type="submit" 
                  variant="primary" 
                  size="large"
                  disabled={loading}
                  style={{ width: '100%' }}
                >
                  {loading ? <LoadingSpinner /> : ' Sign In'}
                </Button>
              </FormGroup>
            </Form>

            <div style={{ 
              textAlign: 'center', 
              marginTop: '20px',
              paddingTop: '20px',
              borderTop: '1px solid #e5e7eb'
            }}>
              <Text>
                Don't have an account?{' '}
                <Link 
                  to="/signup" 
                  style={{ 
                    color: '#4f46e5', 
                    textDecoration: 'none',
                    fontWeight: '600'
                  }}
                >
                  Sign up here
                </Link>
              </Text>
            </div>
          </LoginCard>
        </Container>
      </LoginContainer>
    </div>
  );
};

export default LoginPage;