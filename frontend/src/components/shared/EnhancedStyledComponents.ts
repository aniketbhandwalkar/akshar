import styled, { keyframes, createGlobalStyle, css } from 'styled-components';

// Global styles
export const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #fafbfc;
  }
`;

// Animations
export const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(-30px); }
  to { opacity: 1; transform: translateX(0); }
`;

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
`;

const sparkle = keyframes`
  0%, 100% { opacity: 0; transform: scale(0); }
  50% { opacity: 1; transform: scale(1); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const shimmer = keyframes`
  0% { background-position: -200px 0; }
  100% { background-position: calc(200px + 100%) 0; }
`;

// Enhanced Container with better spacing
export const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  
  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

// Animated Card with hover effects
export const Card = styled.div.withConfig({
  shouldForwardProp: (prop) => !['hover', 'delay'].includes(prop),
})<{ hover?: boolean; delay?: number }>`
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  padding: 32px;
  margin: 20px 0;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  ${props => props.delay !== undefined ? css`animation: ${fadeIn} 0.6s ease-out ${props.delay}s both;` : css`animation: ${fadeIn} 0.6s ease-out both;`}
  border: 1px solid rgba(255, 255, 255, 0.8);
  
  ${props => props.hover && `
    &:hover {
      transform: translateY(-8px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
      border-color: #667eea;
    }
  `}
  
  @media (max-width: 768px) {
    padding: 24px;
  }
`;

// Gradient Button with enhanced animations
export const Button = styled.button.withConfig({
  shouldForwardProp: (prop) => !['variant', 'size', 'animated', 'hover'].includes(prop),
})<{
  variant?: 'primary' | 'secondary' | 'danger' | 'gradient' | 'glass';
  size?: 'small' | 'medium' | 'large';
  animated?: boolean;
}>`
  padding: ${props => {
    switch (props.size) {
      case 'small': return '8px 16px';
      case 'large': return '16px 32px';
      default: return '12px 24px';
    }
  }};
  border: none;
  border-radius: 12px;
  font-size: ${props => {
    switch (props.size) {
      case 'small': return '14px';
      case 'large': return '18px';
      default: return '16px';
    }
  }};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  position: relative;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
  
  ${props => props.animated && css`
    animation: ${pulse} 2s infinite;
  `}
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s;
  }
  
  &:hover::before {
    left: 100%;
  }
  
  ${props => props.variant === 'primary' && `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
    }
  `}
  
  ${props => props.variant === 'gradient' && `
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 50%, #feca57 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(255, 107, 107, 0.6);
    }
  `}
  
  ${props => props.variant === 'glass' && `
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
    
    &:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-2px);
    }
  `}
  
  ${props => props.variant === 'secondary' && `
    background: rgba(107, 114, 128, 0.1);
    color: #4b5563;
    border: 1px solid rgba(107, 114, 128, 0.2);
    
    &:hover {
      background: rgba(107, 114, 128, 0.15);
      transform: translateY(-2px);
    }
  `}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }
`;

// Enhanced Input with focus animations
export const Input = styled.input`
  width: 100%;
  padding: 16px 20px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.3s ease;
  font-family: 'Inter', sans-serif;
  background: rgba(255, 255, 255, 0.8);
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    transform: translateY(-1px);
  }
  
  &:invalid {
    border-color: #ef4444;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
  }
`;

// Animated Title with gradient text
export const Title = styled.h1<{ gradient?: boolean; animated?: boolean }>`
  color: #1f2937;
  margin-bottom: 24px;
  font-size: 3rem;
  font-weight: 800;
  font-family: 'Poppins', sans-serif;
  line-height: 1.2;
  
  ${props => props.gradient && `
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  `}
  
  ${props => props.animated && css`
    animation: ${slideIn} 0.8s ease-out;
  `}
  
  @media (max-width: 768px) {
    font-size: 2.2rem;
  }
`;

// Enhanced Subtitle
export const Subtitle = styled.h2<{ animated?: boolean }>`
  color: #374151;
  margin-bottom: 16px;
  font-size: 1.8rem;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
  
  ${props => props.animated && css`
    animation: ${fadeIn} 0.6s ease-out 0.2s both;
  `}
`;

// Enhanced Text with better typography
export const Text = styled.p<{ animated?: boolean; delay?: number }>`
  color: #6b7280;
  line-height: 1.7;
  margin-bottom: 16px;
  font-family: 'Inter', sans-serif;
  
  ${props => props.animated && css`
    animation: ${fadeIn} 0.6s ease-out ${props.delay || 0}s both;
  `}
`;

// Loading Spinner with modern design  
const spinEnhanced = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const LoadingSpinner = styled.div`
  border: 3px solid #f3f4f6;
  border-top: 3px solid #667eea;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  ${css`animation: ${spinEnhanced} 1s linear infinite;`}
  margin: 20px auto;
`;

// Floating Action Elements
export const FloatingElement = styled.div<{ delay?: number }>`
  ${props => css`
    animation: ${float} 6s ease-in-out infinite;
    animation-delay: ${props.delay || 0}s;
  `}
`;

// Sparkle Effect
export const Sparkle = styled.div<{ top: string; left: string; delay?: number }>`
  position: absolute;
  top: ${props => props.top};
  left: ${props => props.left};
  width: 4px;
  height: 4px;
  background: #fbbf24;
  border-radius: 50%;
  ${props => css`
    animation: ${sparkle} 2s ease-in-out infinite;
    animation-delay: ${props.delay || 0}s;
  `}
`;

// Enhanced Badge with animations
export const Badge = styled.span<{ 
  color?: 'success' | 'warning' | 'danger' | 'info';
  animated?: boolean;
}>`
  display: inline-block;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  
  ${props => props.animated && css`
    animation: ${bounce} 2s infinite;
  `}
  
  ${props => props.color === 'success' && `
    background: linear-gradient(135deg, #10b981, #059669);
    color: white;
    box-shadow: 0 2px 10px rgba(16, 185, 129, 0.3);
  `}
  
  ${props => props.color === 'warning' && `
    background: linear-gradient(135deg, #f59e0b, #d97706);
    color: white;
    box-shadow: 0 2px 10px rgba(245, 158, 11, 0.3);
  `}
  
  ${props => props.color === 'danger' && `
    background: linear-gradient(135deg, #ef4444, #dc2626);
    color: white;
    box-shadow: 0 2px 10px rgba(239, 68, 68, 0.3);
  `}
  
  ${props => props.color === 'info' && `
    background: linear-gradient(135deg, #3b82f6, #2563eb);
    color: white;
    box-shadow: 0 2px 10px rgba(59, 130, 246, 0.3);
  `}
`;

// Enhanced Grid with responsive behavior
export const Grid = styled.div<{ columns?: number; gap?: number; animated?: boolean }>`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${props => props.gap || 24}px;
  
  ${props => props.animated && css`
    & > * {
      animation: ${fadeIn} 0.6s ease-out both;
    }
    
    & > *:nth-child(1) { animation-delay: 0.1s; }
    & > *:nth-child(2) { animation-delay: 0.2s; }
    & > *:nth-child(3) { animation-delay: 0.3s; }
    & > *:nth-child(4) { animation-delay: 0.4s; }
  `}
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(${props => props.columns || 1}, 1fr);
  }
`;

// Progress Bar with animation
export const ProgressBar = styled.div<{ progress: number; animated?: boolean }>`
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: ${props => props.progress}%;
    background: linear-gradient(135deg, #667eea, #764ba2);
    border-radius: 4px;
    transition: width 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    
    ${props => props.animated && css`
      background-image: linear-gradient(45deg, rgba(255,255,255,.2) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.2) 50%, rgba(255,255,255,.2) 75%, transparent 75%, transparent);
      background-size: 20px 20px;
      animation: ${shimmer} 2s linear infinite;
    `}
  }
`;

// Modal backdrop
export const ModalBackdrop = styled.div<{ show: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${props => props.show ? 1 : 0};
  visibility: ${props => props.show ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
`;

// Toast notification
export const Toast = styled.div<{ type: 'success' | 'error' | 'info' }>`
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 16px 24px;
  border-radius: 12px;
  color: white;
  font-weight: 500;
  z-index: 1100;
  ${css`animation: ${slideIn} 0.3s ease-out;`}
  
  ${props => props.type === 'success' && `
    background: linear-gradient(135deg, #10b981, #059669);
  `}
  
  ${props => props.type === 'error' && `
    background: linear-gradient(135deg, #ef4444, #dc2626);
  `}
  
  ${props => props.type === 'info' && `
    background: linear-gradient(135deg, #3b82f6, #2563eb);
  `}
`;

// Flex Container with enhanced options
export const FlexContainer = styled.div<{
  direction?: 'row' | 'column';
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  gap?: number;
  wrap?: boolean;
}>`
  display: flex;
  flex-direction: ${props => props.direction || 'row'};
  justify-content: ${props => props.justify || 'flex-start'};
  align-items: ${props => props.align || 'stretch'};
  gap: ${props => props.gap || 0}px;
  flex-wrap: ${props => props.wrap ? 'wrap' : 'nowrap'};
`;

export const IconWrapper = styled.div<{ size?: 'small' | 'medium' | 'large'; animated?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${props => {
    switch (props.size) {
      case 'small': return '32px';
      case 'large': return '64px';
      default: return '48px';
    }
  }};
  height: ${props => {
    switch (props.size) {
      case 'small': return '32px';
      case 'large': return '64px';
      default: return '48px';
    }
  }};
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  margin-bottom: 16px;
  
  ${props => props.animated && css`
    animation: ${bounce} 2s infinite;
  `}
`;

// Error and Success Messages with enhanced styling
export const ErrorMessage = styled.div`
  color: #dc2626;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 14px;
  margin-top: 8px;
  ${css`animation: ${fadeIn} 0.3s ease-out;`}
`;

export const SuccessMessage = styled.div`
  color: #059669;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 14px;
  margin-top: 8px;
  ${css`animation: ${fadeIn} 0.3s ease-out;`}
`;

export const FormGroup = styled.div`
  margin-bottom: 24px;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #374151;
  font-family: 'Inter', sans-serif;
`;