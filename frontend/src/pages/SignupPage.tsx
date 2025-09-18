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
  Grid,
  GlobalStyles
} from '../components/shared/EnhancedStyledComponents';

const SignupContainer = styled.div`
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
    background-image: radial-gradient(circle at 30% 70%, rgba(102, 126, 234, 0.05) 0%, transparent 50%),
                      radial-gradient(circle at 70% 30%, rgba(118, 75, 162, 0.05) 0%, transparent 50%);
  }
`;

const SignupCard = styled(Card)`
  max-width: 700px;
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

const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState({
    parentName: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    area: '',
    childAge: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    const age = parseInt(formData.age);
    const childAge = parseInt(formData.childAge);

    if (age < 18) {
      setError('Parent must be at least 18 years old');
      return;
    }

    if (childAge < 3 || childAge > 18) {
      setError('Child age must be between 3 and 18 years');
      return;
    }

    setLoading(true);

    try {
      await signup({
        parentName: formData.parentName,
        email: formData.email,
        password: formData.password,
        age,
        area: formData.area,
        childAge
      });
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
      <SignupContainer>
        <Container>
          <SignupCard hover>
            <Title gradient animated style={{ textAlign: 'center', marginBottom: '30px' }}>
              🎆 Join AKSHAR Family
            </Title>
            
            <Form onSubmit={handleSubmit}>
              <Grid columns={2} gap={20}>
                <FormGroup>
                  <Label htmlFor="parentName">Parent's Name *</Label>
                  <Input
                    type="text"
                    id="parentName"
                    name="parentName"
                    value={formData.parentName}
                    onChange={handleChange}
                    required
                    placeholder="Enter parent's full name"
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                  />
                </FormGroup>
              </Grid>

              <Grid columns={2} gap={20}>
                <FormGroup>
                  <Label htmlFor="age">Your Age *</Label>
                  <Input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    required
                    min="18"
                    placeholder="Enter your age"
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="childAge">Child's Age *</Label>
                  <Input
                    type="number"
                    id="childAge"
                    name="childAge"
                    value={formData.childAge}
                    onChange={handleChange}
                    required
                    min="3"
                    max="18"
                    placeholder="Enter child's age"
                  />
                </FormGroup>
              </Grid>

              <FormGroup>
                <Label htmlFor="area">Area/Location *</Label>
                <Input
                  type="text"
                  id="area"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  required
                  placeholder="Enter your city/area"
                />
              </FormGroup>

              <Grid columns={2} gap={20}>
                <FormGroup>
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                    placeholder="Create a password"
                  />
                </FormGroup>

                <FormGroup>
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    minLength={6}
                    placeholder="Confirm your password"
                  />
                </FormGroup>
              </Grid>

              {error && <ErrorMessage>{error}</ErrorMessage>}

              <FormGroup style={{ marginTop: '30px' }}>
                <Button 
                  type="submit" 
                  variant="gradient" 
                  size="large"
                  disabled={loading}
                  style={{ width: '100%' }}
                  animated
                >
                  {loading ? <LoadingSpinner /> : '🎉 Create My Account'}
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
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  style={{ 
                    color: '#4f46e5', 
                    textDecoration: 'none',
                    fontWeight: '600'
                  }}
                >
                  Login here
                </Link>
              </Text>
            </div>

            <div style={{ 
              marginTop: '20px',
              padding: '15px',
              backgroundColor: '#f3f4f6',
              borderRadius: '6px'
            }}>
              <Text style={{ 
                fontSize: '14px', 
                color: '#6b7280',
                margin: 0,
                textAlign: 'center'
              }}>
                By creating an account, you agree to our Terms of Service 
                and Privacy Policy. Your data is secure and protected.
              </Text>
            </div>
          </SignupCard>
        </Container>
      </SignupContainer>
    </div>
  );
};

export default SignupPage;