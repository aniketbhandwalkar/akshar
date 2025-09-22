import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { Container, Button } from './shared/EnhancedStyledComponents';

const NavbarContainer = styled.nav`
  background: tranparent;
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  color: #1f2937;
  padding: 0.35rem 0;   /* much smaller height */
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
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

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.03);
  }
`;

const LogoImage = styled.img`
  height: 60px;  /* shorter logo */
  width: auto;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 18px; /* reduced spacing */
`;

const NavLink = styled(Link)<{ $active?: boolean }>`
  color: #4b5563;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;  /* slightly smaller text */
  padding: 4px 10px;  /* shorter clickable area */
  border-radius: 6px;
  transition: all 0.2s ease;

  ${(props) =>
    props.$active &&
    `
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(102, 126, 234, 0.25);
  `}

  &:hover {
    background: rgba(102, 126, 234, 0.1);
    color: #667eea;
    text-decoration: none;
    transform: translateY(-1px);
  }
`;

const NavButton = styled(Button)`
  margin-left: 6px;
  background: #4f46e5;
  color: white;
  padding: 6px 12px; /* smaller button size */
  font-size: 0.85rem;
  border-radius: 6px;
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
          {/* Logo */}
          <LogoLink to="/">
            <LogoImage src="/images/logo_akshar.png" alt="Akshar Logo" />
          </LogoLink>

          {/* Navigation Links */}
          <NavLinks>
            {user ? (
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
              <>
                <NavLink to="/about" $active={isActive('/about')}>
                  About Us
                </NavLink>
                <NavLink to="/help" $active={isActive('/help')}>
                  Help?
                </NavLink>
                {showAuthButtons && (
                  <>
                    <NavButton as={Link} to="/login" variant="secondary">
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
