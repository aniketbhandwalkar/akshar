const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  testType: {
    type: String,
    enum: ['screener', 'reading'],
    required: true
  },
  responses: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  result: {
    hasDyslexia: {
      type: Boolean,
      required: true
    },
    confidence: {
      type: Number,
      min: 0,
      max: 100
    },
    advice: {
      type: String,
      required: true
    },
    reasoning: {
      type: String,
      required: true
    }
  },
  nearestDoctor: {
    name: String,
    specialization: String,
    address: String,
    phone: String,
    email: String
  },
  eyeTrackingData: {
    type: mongoose.Schema.Types.Mixed
  },
  readingPassage: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('TestResult', testResultSchema);