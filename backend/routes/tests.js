const express = require('express');
const TestResult = require('../models/TestResult');
const auth = require('../middleware/auth');
const { generatePDF } = require('../utils/pdfGenerator');
const { analyzeScreenerTest, analyzeReadingTest, SCREENER_QUESTIONS } = require('../utils/testAnalyzer');
const { generateReadingPassage } = require('../utils/geminiApi');

const router = express.Router();

// @route GET /api/tests/screener-questions
// @desc Get screener test questions
// @access Private
router.get('/screener-questions', auth, (req, res) => {
  try {
    res.json({
      success: true,
      questions: SCREENER_QUESTIONS
    });
  } catch (error) {
    console.error('Get screener questions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route POST /api/tests/screener
// @desc Submit screener test results
// @access Private
router.post('/screener', auth, async (req, res) => {
  try {
    const { responses } = req.body;
    
    // Analyze the screener test responses
    const analysis = analyzeScreenerTest(responses);
    
    // Create test result
    const testResult = new TestResult({
      userId: req.user._id,
      testType: 'screener',
      responses,
      result: analysis,
      nearestDoctor: {
        name: "Dr. Smith",
        address: `${req.user.area} Medical Center`,
        phone: "+1-234-567-8900"
      }
    });

    await testResult.save();

    res.json({
      success: true,
      testResult: {
        id: testResult._id,
        result: testResult.result,
        nearestDoctor: testResult.nearestDoctor,
        createdAt: testResult.createdAt
      }
    });
  } catch (error) {
    console.error('Screener test error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route POST /api/tests/reading
// @desc Submit reading test results
// @access Private
router.post('/reading', auth, async (req, res) => {
  try {
    const { eyeTrackingData, readingPassage, timeTaken } = req.body;
    
    // Check if child is in eligible age range
    if (req.user.childAge < 5 || req.user.childAge > 12) {
      return res.status(400).json({ 
        message: 'Reading test is only available for children aged 5-12' 
      });
    }
    
    // Analyze the reading test data
    const analysis = analyzeReadingTest(eyeTrackingData, timeTaken, req.user.childAge);
    
    // Create test result
    const testResult = new TestResult({
      userId: req.user._id,
      testType: 'reading',
      responses: { timeTaken },
      result: analysis,
      nearestDoctor: {
        name: "Dr. Smith",
        address: `${req.user.area} Medical Center`,
        phone: "+1-234-567-8900"
      },
      eyeTrackingData,
      readingPassage
    });

    await testResult.save();

    res.json({
      success: true,
      testResult: {
        id: testResult._id,
        result: testResult.result,
        nearestDoctor: testResult.nearestDoctor,
        createdAt: testResult.createdAt
      }
    });
  } catch (error) {
    console.error('Reading test error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route GET /api/tests/results
// @desc Get all test results for user
// @access Private
router.get('/results', auth, async (req, res) => {
  try {
    const testResults = await TestResult.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .select('-eyeTrackingData -responses');

    res.json({
      success: true,
      testResults
    });
  } catch (error) {
    console.error('Get results error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route GET /api/tests/result/:id
// @desc Get specific test result
// @access Private
router.get('/result/:id', auth, async (req, res) => {
  try {
    const testResult = await TestResult.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!testResult) {
      return res.status(404).json({ message: 'Test result not found' });
    }

    res.json({
      success: true,
      testResult
    });
  } catch (error) {
    console.error('Get result error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route GET /api/tests/result/:id/pdf
// @desc Download test result as PDF
// @access Private
router.get('/result/:id/pdf', auth, async (req, res) => {
  try {
    const testResult = await TestResult.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!testResult) {
      return res.status(404).json({ message: 'Test result not found' });
    }

    const pdfBuffer = await generatePDF(req.user, testResult);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="test-result-${testResult._id}.pdf"`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ message: 'Error generating PDF' });
  }
});

// @route GET /api/tests/reading-passage
// @desc Get a new reading passage from Gemini API
// @access Private
router.get('/reading-passage', auth, async (req, res) => {
  try {
    const passage = await generateReadingPassage(req.user.childAge);
    res.json({
      success: true,
      passage
    });
  } catch (error) {
    console.error('Reading passage error:', error);
    res.status(500).json({ message: 'Error generating reading passage' });
  }
});

module.exports = router;