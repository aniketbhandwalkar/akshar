import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { Container, Button } from './shared/EnhancedStyledComponents';

const NavbarContainer = styled.nav`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  color: #1f2937;
  padding: 1rem 0;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
  transition: all 0.3s ease;
`;

const NavContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: 1.8rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-decoration: none;
  font-family: 'Poppins', sans-serif;
  transition: all 0.3s ease;
  
  &:hover {
    text-decoration: none;
    transform: scale(1.05);
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

const NavLink = styled(Link)<{ $active?: boolean }>`
  color: #4b5563;
  text-decoration: none;
  font-weight: 500;
  padding: 10px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
  
  ${props => props.$active && `
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  `}
  
  &:hover {
    background: rgba(102, 126, 234, 0.1);
    color: #667eea;
    text-decoration: none;
    transform: translateY(-2px);
  }
`;

const NavButton = styled(Button)`
  margin-left: 8px;
`;

interface NavbarProps {
  showAuthButtons?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ showAuthButtons = false }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <NavbarContainer>
      <Container>
        <NavContent>
          <Logo to="/">AKSHAR</Logo>
          
          <NavLinks>
            {user ? (
              // Authenticated user navigation
              <>
                <NavLink to="/dashboard" $active={isActive('/dashboard')}>
                  Home
                </NavLink>
                <NavLink to="/about" $active={isActive('/about')}>
                  About Us
                </NavLink>
                <NavLink to="/search" $active={isActive('/search')}>
                  Search
                </NavLink>
                <NavLink to="/help" $active={isActive('/help')}>
                  Help
                </NavLink>
                <span>Welcome, {user.parentName}</span>
                <NavButton variant="secondary" onClick={handleLogout}>
                  Logout
                </NavButton>
              </>
            ) : (
              // Guest navigation
              <>
                <NavLink to="/about" $active={isActive('/about')}>
                  About Us
                </NavLink>
                <NavLink to="/help" $active={isActive('/help')}>
                  Help?
                </NavLink>
                {showAuthButtons && (
                  <>
                    <NavButton 
                      as={Link} 
                      to="/login" 
                      variant="secondary"
                    >
                      Login
                    </NavButton>
                    <NavButton 
                      as={Link} 
                      to="/signup" 
                      style={{ backgroundColor: 'white', color: '#4f46e5' }}
                    >
                      Signup
                    </NavButton>
                  </>
                )}
              </>
            )}
          </NavLinks>
        </NavContent>
      </Container>
    </NavbarContainer>
  );
};

export default Navbar;