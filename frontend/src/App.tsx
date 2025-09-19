import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ScreenerTestPage from './pages/ScreenerTestPage';
import ReadingTestPage from './pages/ReadingTestPage';
import TestResultPage from './pages/TestResultPage';
import { LoadingSpinner, GlobalStyles } from './components/shared/EnhancedStyledComponents';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <LoadingSpinner />
      </div>
    );
  }
  
  return user ? <>{children}</> : <Navigate to="/login" />;
};

// Public Route Component (redirect if logged in)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <LoadingSpinner />
      </div>
    );
  }
  
  return user ? <Navigate to="/dashboard" /> : <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <GlobalStyles />
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route 
              path="/" 
              element={
                <PublicRoute>
                  <LandingPage />
                </PublicRoute>
              } 
            />
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              } 
            />
            <Route 
              path="/signup" 
              element={
                <PublicRoute>
                  <SignupPage />
                </PublicRoute>
              } 
            />
            
            {/* Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/screener-test" 
              element={
                <ProtectedRoute>
                  <ScreenerTestPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/reading-test" 
              element={
                <ProtectedRoute>
                  <ReadingTestPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/test-result/:id" 
              element={
                <ProtectedRoute>
                  <TestResultPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Temporary placeholder routes - will implement later */}
            <Route path="/about" element={<div>About page coming soon...</div>} />
            <Route path="/help" element={<div>Help page coming soon...</div>} />
            <Route path="/search" element={<div>Search page coming soon...</div>} />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
