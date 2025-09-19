import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';

const VideoContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => !['isDragging'].includes(prop),
})<{ isDragging: boolean }>`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 200px;
  height: 150px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 2px solid #10b981;
  background: #1f2937;
  cursor: ${props => props.isDragging ? 'grabbing' : 'grab'};
  user-select: none;
  z-index: 150;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const VideoOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  pointer-events: none;
`;

const StatusIndicator = styled.div.withConfig({
  shouldForwardProp: (prop) => !['isTracking'].includes(prop),
})<{ isTracking: boolean }>`
  position: absolute;
  top: 8px;
  left: 8px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.isTracking ? '#10b981' : '#ef4444'};
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
  animation: ${props => props.isTracking ? 'pulse 2s infinite' : 'none'};
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }
`;

const StatusText = styled.div`
  position: absolute;
  bottom: 4px;
  left: 4px;
  right: 4px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  font-size: 10px;
  font-weight: 500;
  padding: 4px 6px;
  border-radius: 4px;
  text-align: center;
`;

const GazePoint = styled.div.attrs<{ x: number; y: number }>((props) => ({
  style: {
    left: `${props.x}%`,
    top: `${props.y}%`,
  },
}))<{ x: number; y: number }>`
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #fbbf24;
  border: 1px solid white;
  transform: translate(-50%, -50%);
  pointer-events: none;
  animation: gazePoint 0.5s ease-out;
  
  @keyframes gazePoint {
    0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
    50% { transform: translate(-50%, -50%) scale(1.5); opacity: 1; }
    100% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
  }
`;

const DragHandle = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 20px;
  height: 20px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  cursor: grab;
  
  &:active {
    cursor: grabbing;
  }
`;

interface FloatingVideoPreviewProps {
  stream: MediaStream | null;
  isTracking: boolean;
  currentGaze?: { x: number; y: number } | null;
  isVisible: boolean;
}

const FloatingVideoPreview: React.FC<FloatingVideoPreviewProps> = ({
  stream,
  isTracking,
  currentGaze,
  isVisible
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: window.innerWidth - 240, y: window.innerHeight - 170 });
  const [gazeHistory, setGazeHistory] = useState<Array<{ x: number; y: number; id: number }>>([]);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    if (currentGaze) {
      // Show gaze point as relative to screen coordinates
      // Convert screen percentage to video preview percentage
      const screenX = (currentGaze.x / window.innerWidth) * 100;
      const screenY = (currentGaze.y / window.innerHeight) * 100;
      
      // Add some randomness for visual effect since we're showing screen gaze on video
      const randomOffset = 10; // 10% random offset
      const adjustedX = Math.max(0, Math.min(100, screenX + (Math.random() - 0.5) * randomOffset));
      const adjustedY = Math.max(0, Math.min(100, screenY + (Math.random() - 0.5) * randomOffset));
      
      const pointId = Date.now() + Math.random(); // Unique ID
      const newGazePoint = { x: adjustedX, y: adjustedY, id: pointId };
      
      setGazeHistory(prev => {
        // Keep only last 2 points to prevent memory issues
        const updated = [...prev.slice(-1), newGazePoint];
        return updated;
      });
      
      // Use a ref to avoid setState in timeout callback
      const timeoutId = setTimeout(() => {
        setGazeHistory(current => current.filter(point => point.id !== pointId));
      }, 1000);
      
      // Cleanup timeout on unmount or new gaze
      return () => clearTimeout(timeoutId);
    }
  }, [currentGaze]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      // Keep within viewport bounds
      const maxX = window.innerWidth - 200;
      const maxY = window.innerHeight - 150;
      
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  if (!isVisible || !stream) return null;

  return (
    <VideoContainer
      ref={containerRef}
      isDragging={isDragging}
      onMouseDown={handleMouseDown}
      style={{
        left: position.x,
        top: position.y
      }}
    >
      <Video ref={videoRef} autoPlay muted playsInline />
      
      <VideoOverlay>
        <StatusIndicator isTracking={isTracking} />
        <DragHandle>⋮⋮</DragHandle>
        
        <StatusText>
          {isTracking ? '👁️ Tracking Active' : '⏸️ Tracking Paused'}
        </StatusText>
      </VideoOverlay>
      
      {/* Gaze point visualization */}
      {gazeHistory.map(point => (
        <GazePoint
          key={point.id}
          x={point.x}
          y={point.y}
        />
      ))}
    </VideoContainer>
  );
};

export default FloatingVideoPreview;