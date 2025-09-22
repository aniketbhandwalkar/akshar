const express = require('express');
const TestResult = require('../models/TestResult');
const auth = require('../middleware/auth');
const { generatePDF } = require('../utils/pdfGenerator');
const { analyzeScreenerTest, analyzeReadingTest, SCREENER_QUESTIONS } = require('../utils/testAnalyzer');
const { generateReadingPassage } = require('../utils/geminiApi');
const { getClinician } = require('../utils/clinician');

const router = express.Router();

// @route GET /api/tests/screener-questions
// @desc Get screener test questions
// @access Public
router.get('/screener-questions', (req, res) => {
  try {
    res.json({ success: true, questions: SCREENER_QUESTIONS });
  } catch (error) {
    console.error('Get screener questions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route POST /api/tests/screener
// @desc Submit screener test responses
// @access Private
router.post('/screener', auth, async (req, res) => {
  try {
    const { responses } = req.body;
    
    if (!responses || !Array.isArray(responses)) {
      return res.status(400).json({ message: 'Invalid responses format' });
    }

    const analysis = analyzeScreenerTest(responses);

    // Attach configured clinician (if available)
    const clinician = getClinician();
    
    const testResult = new TestResult({
      userId: req.user._id,
      testType: 'screener',
      responses,
      result: {
        hasDyslexia: analysis.hasDyslexia,
        confidence: analysis.confidence,
        advice: analysis.advice,
        reasoning: analysis.reasoning
      },
      nearestDoctor: clinician ? {
        name: clinician.name,
        specialization: clinician.specialization,
        address: clinician.address,
        phone: clinician.phone,
        email: clinician.email
      } : undefined
    });

    await testResult.save();
    res.json({ success: true, testResult });
  } catch (error) {
    console.error('Screener test submission error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route GET /api/tests/reading-passage
// @desc Get reading passage for reading test
// @access Public
router.get('/reading-passage', async (req, res) => {
  try {
    const passage = await generateReadingPassage();
    res.json({ success: true, passage });
  } catch (error) {
    console.error('Get reading passage error:', error);
    // Fallback passage if API fails
    const fallbackPassage = "The quick brown fox jumps over the lazy dog. This sentence contains every letter of the alphabet and is commonly used for testing fonts and keyboards. Reading comprehension is an important skill that involves understanding written text. When we read, our eyes make quick movements called saccades, and these movements can be tracked to understand reading patterns. Dyslexia is a learning disorder that affects reading ability, but with proper support and intervention, individuals with dyslexia can become successful readers.";
    res.json({ success: true, passage: fallbackPassage });
  }
});

// @route POST /api/tests/reading
// @desc Submit reading test with eye tracking data
// @access Private
router.post('/reading', auth, async (req, res) => {
  try {
    const { eyeTrackingData, readingPassage, timeTaken } = req.body;
    
    if (!eyeTrackingData || !readingPassage || !timeTaken) {
      return res.status(400).json({ message: 'Missing required data' });
    }

    const analysis = analyzeReadingTest(eyeTrackingData, timeTaken, req.user?.childAge);

    // Attach configured clinician (if available)
    const clinician = getClinician();
    
    const testResult = new TestResult({
      userId: req.user._id,
      testType: 'reading',
      responses: { timeTaken },
      eyeTrackingData,
      readingPassage,
      result: {
        hasDyslexia: analysis.hasDyslexia,
        confidence: analysis.confidence,
        advice: analysis.advice,
        reasoning: analysis.reasoning
      },
      nearestDoctor: clinician ? {
        name: clinician.name,
        specialization: clinician.specialization,
        address: clinician.address,
        phone: clinician.phone,
        email: clinician.email
      } : undefined
    });

    await testResult.save();
    res.json({ success: true, testResult });
  } catch (error) {
    console.error('Reading test submission error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route GET /api/tests/results
// @desc Get all test results for authenticated user
// @access Private
router.get('/results', auth, async (req, res) => {
  try {
    const testResults = await TestResult.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .select('-eyeTrackingData'); // Exclude large eye tracking data from list view
    
    res.json({ success: true, testResults });
  } catch (error) {
    console.error('Get test results error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route GET /api/tests/clinician
// @desc Get configured clinician details
// @access Private
router.get('/clinician', auth, (req, res) => {
  try {
    const clinician = getClinician();
    if (!clinician) {
      return res.status(404).json({ message: 'Clinician not configured' });
    }
    res.json({ success: true, clinician });
  } catch (error) {
    console.error('Get clinician error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route GET /api/tests/result/:id
// @desc Get a specific test result
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

    res.json({ success: true, testResult });
  } catch (error) {
    console.error('Get test result error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route GET /api/tests/result/:id/pdf
// @desc Download PDF report for a specific test result
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

    // Get user info for PDF
    const User = require('../models/User');
    const user = await User.findById(req.user._id);
    const pdfBuffer = await generatePDF(user, testResult);
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="dyslexia-test-report-${testResult._id}.pdf"`,
      'Content-Length': pdfBuffer.length
    });
    
    res.end(pdfBuffer);
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ message: 'Server error generating PDF' });
  }
});

// @route DELETE /api/tests/result/:id
// @desc Delete a specific test result
// @access Private
router.delete('/result/:id', auth, async (req, res) => {
  try {
    const testResult = await TestResult.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!testResult) {
      return res.status(404).json({ message: 'Test result not found' });
    }

    res.json({ success: true, message: 'Test result deleted' });
  } catch (error) {
    console.error('Delete test result error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
