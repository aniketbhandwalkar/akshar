# AKSHAR: AI-based Real-time Dyslexia Detection System

AKSHAR is a comprehensive web application designed to help parents identify potential signs of dyslexia in their children through AI-powered screening tests and eye-tracking analysis.

## Features

- **Screening Test**: 10-question assessment to identify potential dyslexia indicators
- **Reading Test**: Eye-tracking analysis for children aged 5-12 years
- **AI-Powered Results**: Detailed reports with professional recommendations
- **PDF Reports**: Downloadable test results with doctor recommendations
- **User Authentication**: Secure parent accounts with child information
- **Real-time Analysis**: Immediate test results and advice

## Tech Stack

### Frontend
- React 18 with TypeScript
- React Router for navigation
- Styled Components for UI
- Axios for API calls
- WebGazer.js for eye tracking

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- JWT authentication
- Google Gemini AI for reading passages
- PDFKit for report generation
- Security middleware (helmet, CORS, rate limiting)

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account (or local MongoDB)
- Google Gemini API key

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `.env`:
   ```env
   MONGODB_URI=mongodb+srv://scraperpilot3_db_user:akshar1409@cluster0.08kfcql.mongodb.net/akshar_dyslexia_db?retryWrites=true&w=majority&appName=Cluster0
   GEMINI_API_KEY=your_gemini_api_key_here
   JWT_SECRET=your_jwt_secret_here_generate_a_random_string
   PORT=5000
   NODE_ENV=development
   ```

4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables in `.env`:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. Add a background image for the reading test:
   - Place a child-friendly background image named `child.png` in `public/images/`
   - Recommended size: 1920x1080 or similar high resolution

5. Start the frontend development server:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new parent account
- `POST /api/auth/login` - Login existing user
- `GET /api/auth/profile` - Get user profile (protected)

### Tests
- `GET /api/tests/screener-questions` - Get screening test questions
- `POST /api/tests/screener` - Submit screener test responses
- `GET /api/tests/reading-passage` - Get reading passage from AI
- `POST /api/tests/reading` - Submit reading test results
- `GET /api/tests/results` - Get all user test results
- `GET /api/tests/result/:id` - Get specific test result
- `GET /api/tests/result/:id/pdf` - Download test result as PDF

## Usage Flow

1. **Landing Page**: Users learn about AKSHAR and can sign up
2. **Registration**: Parents create accounts with their and child's information
3. **Dashboard**: Access to both test types and previous results
4. **Screener Test**: 10-question assessment with immediate results
5. **Reading Test** (ages 5-12): Eye-tracking analysis during reading
6. **Results**: Detailed analysis, recommendations, and doctor referrals
7. **PDF Reports**: Downloadable professional reports

## Database Schema

### User Model
- parentName: String (required)
- email: String (unique, required)
- password: String (hashed, required)
- age: Number (minimum 18)
- area: String (location)
- childAge: Number (3-18 range)

### TestResult Model
- userId: ObjectId (reference to User)
- testType: 'screener' | 'reading'
- responses: Mixed (test responses)
- result: Object (AI analysis results)
- eyeTrackingData: Mixed (for reading tests)
- nearestDoctor: Object (doctor information)

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting (100 requests per 15 minutes)
- CORS protection
- Security headers with Helmet
- Input validation and sanitization

## AI Integration

- **Google Gemini AI**: Generates age-appropriate reading passages
- **Eye Tracking Analysis**: WebGazer.js for real-time gaze tracking
- **Fixation Detection**: Algorithm to identify reading patterns
- **Result Analysis**: AI-powered assessment of test responses

## Development Notes

- Frontend runs on port 3000
- Backend runs on port 5000
- MongoDB connection string is pre-configured
- WebGazer.js loads from CDN during reading tests
- PDF generation happens server-side

## Production Deployment

1. Set NODE_ENV=production in backend .env
2. Build frontend: `npm run build`
3. Serve frontend build files
4. Update CORS origins for production domains
5. Use production MongoDB cluster
6. Implement proper logging and monitoring

## Support

For technical support or questions about AKSHAR, please contact the development team.

---

© 2024 AKSHAR - AI-based Real-time Dyslexia Detection System