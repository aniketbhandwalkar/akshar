import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const MeterContainer = styled.div`
  position: fixed;
  top: 100px;
  right: 20px;
  background: white;
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  z-index: 100;
  min-width: 200px;
`;

const MeterTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 10px;
  text-align: center;
`;

const ConfidenceBar = styled.div.withConfig({
  shouldForwardProp: (prop) => !['confidence', 'color'].includes(prop),
})<{ confidence: number; color: string }>`
  width: 100%;
  height: 8px;
  background: #f3f4f6;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
  
  &::after {
    content: '';
    display: block;
    height: 100%;
    width: ${props => props.confidence}%;
    background: ${props => props.color};
    border-radius: 4px;
    transition: all 0.3s ease;
  }
`;

const StatusText = styled.div.withConfig({
  shouldForwardProp: (prop) => !['color'].includes(prop),
})<{ color: string }>`
  font-size: 12px;
  font-weight: 500;
  color: ${props => props.color};
  text-align: center;
  margin-bottom: 8px;
`;

const MetricRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #6b7280;
  margin-bottom: 4px;
`;

const BlinkIndicator = styled.div.withConfig({
  shouldForwardProp: (prop) => !['isBlinking'].includes(prop),
})<{ isBlinking: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${props => props.isBlinking ? '#ef4444' : '#10b981'};
  margin-right: 5px;
  transition: background 0.2s ease;
`;

interface ConfidenceMeterProps {
  gazeData: Array<{ x: number; y: number; timestamp: number }>;
  isVisible: boolean;
}

interface TrackingMetrics {
  confidence: number;
  stability: number;
  gazePoints: number;
  blinkCount: number;
  isBlinking: boolean;
  status: 'excellent' | 'good' | 'fair' | 'poor';
}

const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({ gazeData, isVisible }) => {
  const [metrics, setMetrics] = useState<TrackingMetrics>({
    confidence: 0,
    stability: 0,
    gazePoints: 0,
    blinkCount: 0,
    isBlinking: false,
    status: 'poor'
  });

  useEffect(() => {
    if (gazeData.length > 0) {
      calculateMetrics();
    }
  }, [gazeData]);

  const calculateMetrics = () => {
    const recentData = gazeData.slice(-20); // Last 20 data points
    
    if (recentData.length < 5) {
      setMetrics(prev => ({ ...prev, confidence: 0, status: 'poor' }));
      return;
    }

    // Calculate stability (less variation = more stable)
    const xVariation = calculateVariation(recentData.map(d => d.x));
    const yVariation = calculateVariation(recentData.map(d => d.y));
    const avgVariation = (xVariation + yVariation) / 2;
    const stability = Math.max(0, 100 - avgVariation / 2);

    // Calculate confidence based on data consistency
    const dataRate = recentData.length;
    const timeSpread = recentData[recentData.length - 1].timestamp - recentData[0].timestamp;
    const expectedRate = timeSpread > 0 ? (dataRate / timeSpread) * 1000 : 0;
    
    const confidenceScore = Math.min(100, (stability * 0.6) + (Math.min(expectedRate / 10, 40)));

    // Determine status
    let status: 'excellent' | 'good' | 'fair' | 'poor';
    if (confidenceScore >= 80) status = 'excellent';
    else if (confidenceScore >= 60) status = 'good';
    else if (confidenceScore >= 40) status = 'fair';
    else status = 'poor';

    // Simulate blinking detection
    const isBlinking = Math.random() < 0.1; // 10% chance of "blink" detection

    setMetrics(prev => ({
      confidence: Math.round(confidenceScore),
      stability: Math.round(stability),
      gazePoints: gazeData.length,
      blinkCount: isBlinking ? prev.blinkCount + 1 : prev.blinkCount,
      isBlinking,
      status
    }));
  };

  const calculateVariation = (values: number[]): number => {
    if (values.length < 2) return 0;
    
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'excellent': return '#10b981';
      case 'good': return '#3b82f6';
      case 'fair': return '#f59e0b';
      case 'poor': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'excellent': return '🎯 Excellent Tracking';
      case 'good': return '✅ Good Tracking';
      case 'fair': return '⚠️ Fair Tracking';
      case 'poor': return '❌ Poor Tracking';
      default: return '⏳ Initializing...';
    }
  };

  if (!isVisible) return null;

  return (
    <MeterContainer>
      <MeterTitle>👁️ Tracking Quality</MeterTitle>
      
      <ConfidenceBar 
        confidence={metrics.confidence} 
        color={getStatusColor(metrics.status)}
      />
      
      <StatusText color={getStatusColor(metrics.status)}>
        {getStatusText(metrics.status)}
      </StatusText>
      
      <MetricRow>
        <span>Confidence:</span>
        <span>{metrics.confidence}%</span>
      </MetricRow>
      
      <MetricRow>
        <span>Stability:</span>
        <span>{metrics.stability}%</span>
      </MetricRow>
      
      <MetricRow>
        <span>Gaze Points:</span>
        <span>{metrics.gazePoints}</span>
      </MetricRow>
      
      <MetricRow>
        <span style={{ display: 'flex', alignItems: 'center' }}>
          <BlinkIndicator isBlinking={metrics.isBlinking} />
          Blinks:
        </span>
        <span>{metrics.blinkCount}</span>
      </MetricRow>
    </MeterContainer>
  );
};

export default ConfidenceMeter;