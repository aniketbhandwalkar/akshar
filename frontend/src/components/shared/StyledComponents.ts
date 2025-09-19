import styled, { css, keyframes } from 'styled-components';

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

export const Card = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 30px;
  margin: 20px 0;
`;

export const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  
  ${props => props.variant === 'primary' && `
    background-color: #4f46e5;
    color: white;
    
    &:hover {
      background-color: #4338ca;
    }
  `}
  
  ${props => props.variant === 'secondary' && `
    background-color: #6b7280;
    color: white;
    
    &:hover {
      background-color: #4b5563;
    }
  `}
  
  ${props => props.variant === 'danger' && `
    background-color: #ef4444;
    color: white;
    
    &:hover {
      background-color: #dc2626;
    }
  `}
  
  ${props => !props.variant && `
    background-color: #f3f4f6;
    color: #374151;
    
    &:hover {
      background-color: #e5e7eb;
    }
  `}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #d1d5db;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: #4f46e5;
  }
  
  &:invalid {
    border-color: #ef4444;
  }
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #374151;
`;

export const FormGroup = styled.div`
  margin-bottom: 20px;
`;

export const ErrorMessage = styled.div`
  color: #ef4444;
  font-size: 14px;
  margin-top: 5px;
`;

export const SuccessMessage = styled.div`
  color: #10b981;
  font-size: 14px;
  margin-top: 5px;
`;

export const Title = styled.h1`
  color: #1f2937;
  margin-bottom: 24px;
  font-size: 2.5rem;
  font-weight: 700;
`;

export const Subtitle = styled.h2`
  color: #374151;
  margin-bottom: 16px;
  font-size: 1.8rem;
  font-weight: 600;
`;

export const Text = styled.p`
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 16px;
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const LoadingSpinner = styled.div`
  border: 4px solid #f3f4f6;
  border-top: 4px solid #4f46e5;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  ${css`animation: ${spin} 1s linear infinite;`}
  margin: 20px auto;
`;

export const FlexContainer = styled.div<{ 
  direction?: 'row' | 'column';
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  gap?: number;
}>`
  display: flex;
  flex-direction: ${props => props.direction || 'row'};
  justify-content: ${props => props.justify || 'flex-start'};
  align-items: ${props => props.align || 'stretch'};
  gap: ${props => props.gap || 0}px;
`;

export const Grid = styled.div<{ columns?: number; gap?: number }>`
  display: grid;
  grid-template-columns: repeat(${props => props.columns || 1}, 1fr);
  gap: ${props => props.gap || 20}px;
`;

export const Badge = styled.span<{ color?: 'success' | 'warning' | 'danger' | 'info' }>`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  
  ${props => props.color === 'success' && `
    background-color: #d1fae5;
    color: #065f46;
  `}
  
  ${props => props.color === 'warning' && `
    background-color: #fef3c7;
    color: #92400e;
  `}
  
  ${props => props.color === 'danger' && `
    background-color: #fee2e2;
    color: #991b1b;
  `}
  
  ${props => props.color === 'info' && `
    background-color: #dbeafe;
    color: #1e40af;
  `}
  
  ${props => !props.color && `
    background-color: #f3f4f6;
    color: #374151;
  `}
`;