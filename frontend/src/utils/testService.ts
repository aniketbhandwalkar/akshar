import axios from 'axios';
import { TestResult, EyeTrackingData } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Screener Questions
export const getScreenerQuestions = async (): Promise<string[]> => {
  try {
    const response = await api.get('/tests/screener-questions');
    return response.data.questions;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to get screener questions');
  }
};

// Submit Screener Test
export const submitScreenerTest = async (responses: string[]): Promise<TestResult> => {
  try {
    const response = await api.post('/tests/screener', { responses });
    return response.data.testResult;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to submit screener test');
  }
};

// Get Reading Passage
export const getReadingPassage = async (): Promise<string> => {
  try {
    const response = await api.get('/tests/reading-passage');
    return response.data.passage;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to get reading passage');
  }
};

// Submit Reading Test
export const submitReadingTest = async (
  eyeTrackingData: EyeTrackingData,
  readingPassage: string,
  timeTaken: number
): Promise<TestResult> => {
  try {
    const response = await api.post('/tests/reading', {
      eyeTrackingData,
      readingPassage,
      timeTaken,
    });
    return response.data.testResult || response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to submit reading test');
  }
};

// Get All Test Results
export const getTestResults = async (): Promise<TestResult[]> => {
  try {
    const response = await api.get('/tests/results');
    return response.data.testResults;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to get test results');
  }
};

// Get Single Test Result
export const getTestResult = async (id: string): Promise<TestResult> => {
  try {
    const response = await api.get(`/tests/result/${id}`);
    return response.data.testResult;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to get test result');
  }
};

// Download PDF
export const downloadTestResultPDF = async (id: string): Promise<Blob> => {
  try {
    const response = await api.get(`/tests/result/${id}/pdf`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to download PDF');
  }
};

export const deleteTestResult = async (id: string): Promise<void> => {
  try {
    await api.delete(`/tests/result/${id}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete test result');
  }
};
