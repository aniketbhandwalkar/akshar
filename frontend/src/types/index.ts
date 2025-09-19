export interface User {
  id: string;
  parentName: string;
  email: string;
  age: number;
  area: string;
  childAge: number;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface TestResult {
  id?: string;
  _id?: string; // MongoDB ID field
  testType: 'screener' | 'reading';
  result: {
    hasDyslexia: boolean;
    confidence?: number;
    advice: string;
    reasoning: string;
  };
  nearestDoctor?: {
    name: string;
    address: string;
    phone: string;
  };
  createdAt: string;
  updatedAt?: string;
}

export interface ScreenerResponse {
  questionIndex: number;
  response: 'yes' | 'no';
}

export interface EyeTrackingData {
  gazePoints: Array<{
    x: number;
    y: number;
    timestamp: number;
  }>;
  fixations: Array<{
    x: number;
    y: number;
    duration: number;
  }>;
}

export interface ReadingTestData {
  eyeTrackingData: EyeTrackingData;
  readingPassage: string;
  timeTaken: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}