# AKSHAR - Complete Setup Guide for Fresh Windows Laptop

This guide will help you set up the AKSHAR Dyslexia Detection System on a fresh Windows laptop with no prior installations.

## 📋 System Requirements

- **Operating System**: Windows 10/11
- **RAM**: Minimum 8GB (16GB recommended)
- **Storage**: At least 5GB free space
- **Internet Connection**: Required for downloading dependencies and MongoDB Atlas connection

## 🛠️ Step-by-Step Installation

### Step 1: Install Node.js and npm

1. **Download Node.js**:
   - Go to [https://nodejs.org/](https://nodejs.org/)
   - Download the **LTS version** (Long Term Support) - currently v20.x.x
   - Choose the Windows Installer (.msi) for your system (64-bit recommended)

2. **Install Node.js**:
   - Run the downloaded installer
   - Accept the license agreement
   - Keep all default settings
   - Make sure "Add to PATH" is checked
   - Complete the installation

3. **Verify Installation**:
   ```powershell
   node --version
   npm --version
   ```
   - Node.js should be >= v16.0.0
   - npm should be >= v8.0.0

### Step 2: Install Git (for version control)

1. **Download Git**:
   - Go to [https://git-scm.com/download/win](https://git-scm.com/download/win)
   - Download the latest version

2. **Install Git**:
   - Run the installer with default settings
   - Choose "Use Git from the Windows Command Prompt"

3. **Verify Installation**:
   ```powershell
   git --version
   ```

### Step 3: Install Visual Studio Code (Recommended Editor)

1. **Download VS Code**:
   - Go to [https://code.visualstudio.com/](https://code.visualstudio.com/)
   - Download for Windows

2. **Install VS Code**:
   - Run the installer
   - Check "Add to PATH" option
   - Install recommended extensions for better development experience

3. **Recommended Extensions**:
   - ES7+ React/Redux/React-Native snippets
   - TypeScript Hero
   - Auto Rename Tag
   - Bracket Pair Colorizer
   - GitLens

### Step 4: Clone or Download the AKSHAR Project

**Option A: Using Git (Recommended)**
```powershell
git clone https://github.com/your-repo/AKSHAR-Dyslexia-Detection.git
cd AKSHAR-Dyslexia-Detection
```

**Option B: Download ZIP**
- Download the project as ZIP
- Extract to a folder like `C:\Projects\AKSHAR-Dyslexia-Detection`
- Open PowerShell and navigate to the folder

### Step 5: Install Project Dependencies

1. **Open PowerShell as Administrator** (Right-click PowerShell → "Run as Administrator")

2. **Navigate to project directory**:
   ```powershell
   cd "C:\path\to\AKSHAR-Dyslexia-Detection"
   ```

3. **Install all dependencies** (using the convenience script):
   ```powershell
   npm run install:all
   ```

   Or install manually:
   ```powershell
   # Install backend dependencies
   cd backend
   npm install
   
   # Install frontend dependencies
   cd ../frontend
   npm install
   
   # Return to root
   cd ..
   ```

### Step 6: Environment Configuration

1. **Backend Environment Variables**:
   - Navigate to `backend` folder
   - The `.env` file should already exist with these variables:
     ```
     MONGODB_URI=mongodb+srv://scraperpilot3_db_user:akshar1409@cluster0.08kfcql.mongodb.net/akshar_dyslexia_db?retryWrites=true&w=majority&appName=Cluster0
     GEMINI_API_KEY=AIzaSyAhsMeNd0ie5L8zsJtc6OFUcwJ54jdiyxI
     JWT_SECRET=akshar_jwt_secret_key_2024_dyslexia_detection_system_secure_token_generator
     PORT=5000
     NODE_ENV=development
     ```

2. **If `.env` file is missing**, create it in the `backend` folder with the above content.

### Step 7: Install Additional Tools (Optional but Recommended)

1. **MongoDB Compass** (Database GUI):
   - Download from [https://www.mongodb.com/products/compass](https://www.mongodb.com/products/compass)
   - Useful for viewing and managing database

2. **Postman** (API Testing):
   - Download from [https://www.postman.com/downloads/](https://www.postman.com/downloads/)
   - Useful for testing backend API endpoints

## 🚀 Running the Application

### Method 1: Run Both Frontend and Backend Separately

1. **Start Backend Server**:
   ```powershell
   # Open first PowerShell window
   cd backend
   npm run dev
   # or
   npm start
   ```
   - Server should start on `http://localhost:5000`

2. **Start Frontend Development Server**:
   ```powershell
   # Open second PowerShell window
   cd frontend
   npm start
   ```
   - Frontend should start on `http://localhost:3000`
   - Browser should automatically open

### Method 2: Using Root Scripts

From the root directory:
```powershell
# Start backend
npm run dev:backend

# In another terminal, start frontend
npm run dev:frontend
```

## 🔧 Common Issues and Solutions

### Issue 1: Node.js/npm not recognized
**Solution**: 
- Restart PowerShell after Node.js installation
- Check if Node.js is added to system PATH
- Reinstall Node.js if necessary

### Issue 2: Permission errors during npm install
**Solutions**:
```powershell
# Run PowerShell as Administrator
# Or clear npm cache
npm cache clean --force

# Or change npm permissions
npm config set registry https://registry.npmjs.org/
```

### Issue 3: Port already in use
**Solution**:
```powershell
# Find and kill process using port 3000 or 5000
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F
```

### Issue 4: MongoDB connection issues
**Solution**:
- Check internet connection
- Verify MongoDB URI in `.env` file
- Ensure MongoDB Atlas cluster is running

### Issue 5: TypeScript compilation errors
**Solution**:
```powershell
cd frontend
npm install --save-dev @types/react @types/react-dom
```

## 📱 Testing the Application

1. **Frontend**: Open `http://localhost:3000`
   - You should see the AKSHAR landing page
   - Test signup/login functionality
   - Navigate to About page

2. **Backend API**: Test at `http://localhost:5000/api/health`
   - Should return: `{"success": true, "message": "AKSHAR API is running"}`

3. **Database**: Check MongoDB Atlas dashboard to verify connections

## 🔍 Project Structure

```
AKSHAR-Dyslexia-Detection/
├── backend/                 # Node.js/Express backend
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── config/             # Database config
│   ├── utils/              # Utility functions
│   ├── .env                # Environment variables
│   ├── package.json        # Backend dependencies
│   └── server.js           # Main server file
├── frontend/               # React TypeScript frontend
│   ├── public/             # Static assets
│   ├── src/                # Source code
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context
│   │   └── App.tsx         # Main app component
│   └── package.json        # Frontend dependencies
├── package.json            # Root package.json
└── SETUP_GUIDE.md          # This file
```

## 🎯 Development Workflow

1. **Make changes** to frontend (src folder) or backend
2. **Save files** - both servers have hot reload enabled
3. **Test changes** in browser
4. **Use browser DevTools** for debugging
5. **Check terminal** for any errors

## 📞 Support

If you encounter issues:
1. Check this guide first
2. Look at terminal/console errors
3. Verify all dependencies are installed
4. Ensure ports 3000 and 5000 are available
5. Check `.env` file configuration

## 🔐 Security Notes

- Never commit `.env` file to version control
- Change JWT_SECRET in production
- Use strong passwords for production MongoDB
- Enable proper CORS settings for production

---

**Congratulations!** 🎉 You should now have the AKSHAR Dyslexia Detection System running on your Windows laptop.