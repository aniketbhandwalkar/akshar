// Screener test questions and analysis
const SCREENER_QUESTIONS = [
  "Does your child have difficulty reading aloud?",
  "Does your child often confuse letters like 'b' and 'd' or 'p' and 'q'?",
  "Does your child have trouble sounding out words?",
  "Does your child avoid reading activities?",
  "Does your child have difficulty with spelling?",
  "Does your child read much slower than peers?",
  "Does your child have trouble understanding what they read?",
  "Does your child struggle to learn letter names and sounds?",
  "Does your child have difficulty with rhyming words?",
  "Does your child often lose their place while reading?"
];

const analyzeScreenerTest = (responses) => {
  // Count 'Yes' responses (indicating potential dyslexia signs)
  const yesCount = responses.filter(response => response === 'yes').length;
  const totalQuestions = responses.length;
  
  // Calculate confidence percentage
  const confidence = Math.round((yesCount / totalQuestions) * 100);
  
  let hasDyslexia = false;
  let advice = "";
  let reasoning = "";
  
  if (yesCount >= 7) {
    hasDyslexia = true;
    advice = "We strongly recommend consulting with a learning specialist or educational psychologist for a comprehensive evaluation. Early intervention can significantly help your child develop effective reading strategies.";
    reasoning = `Your child shows ${yesCount} out of ${totalQuestions} indicators commonly associated with dyslexia. This high number suggests your child may benefit from specialized reading support and professional assessment.`;
  } else if (yesCount >= 4) {
    hasDyslexia = true;
    advice = "Consider consulting with your child's teacher and possibly a reading specialist. Some targeted reading support may be beneficial.";
    reasoning = `Your child shows ${yesCount} out of ${totalQuestions} indicators that may suggest reading difficulties. While not definitive, these signs warrant attention and possible intervention.`;
  } else {
    hasDyslexia = false;
    advice = "Your child shows minimal signs of dyslexia based on this screening. Continue to monitor their reading progress and provide supportive reading activities at home.";
    reasoning = `Your child shows only ${yesCount} out of ${totalQuestions} indicators, which is within the normal range. However, continue to support their reading development through regular practice and engagement.`;
  }
  
  return {
    hasDyslexia,
    confidence,
    advice,
    reasoning
  };
};

const analyzeReadingTest = (eyeTrackingData, timeTaken, childAge = 8) => {
  // Expected reading time ranges by age (in seconds)
  const expectedReadingTimes = {
    5: { min: 120, max: 180 },
    6: { min: 90, max: 150 },
    7: { min: 60, max: 120 },
    8: { min: 45, max: 90 },
    9: { min: 30, max: 75 },
    10: { min: 30, max: 60 },
    11: { min: 25, max: 50 },
    12: { min: 20, max: 45 }
  };

  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  const ageRange = expectedReadingTimes[childAge] || expectedReadingTimes[8];

  const gazePoints = Array.isArray(eyeTrackingData?.gazePoints) ? eyeTrackingData.gazePoints : [];
  const totalPoints = gazePoints.length;

  // Eye movement metrics
  let regressionCount = 0;
  let jumpDistances = [];
  let longGaps = 0;

  for (let i = 1; i < totalPoints; i++) {
    const current = gazePoints[i];
    const previous = gazePoints[i - 1];
    const dx = current.x - previous.x;
    const dy = current.y - previous.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    jumpDistances.push(dist);

    // Backward movement across text lines (heuristic threshold)
    if (dx < -35) regressionCount++;

    const dt = current.timestamp - previous.timestamp;
    if (dt > 500) longGaps++;
  }

  const avgJump = jumpDistances.length ? (jumpDistances.reduce((s, d) => s + d, 0) / jumpDistances.length) : 0;
  const largeJumps = jumpDistances.filter(d => d > 150).length;
  const largeJumpRatio = totalPoints > 1 ? largeJumps / (totalPoints - 1) : 0;
  const regressionRatio = totalPoints > 1 ? regressionCount / (totalPoints - 1) : 0;

  // Tracking quality metrics
  const dataRateHz = timeTaken > 0 ? totalPoints / timeTaken : 0; // points per second
  const continuityPenalty = totalPoints > 1 ? (longGaps / (totalPoints - 1)) : 1; // proportion of long gaps

  const stabilityScore = clamp(100 - (avgJump / 10), 0, 100); // higher is better
  const rateScore = clamp((dataRateHz / 12) * 100, 0, 100); // 12Hz target
  const continuityScore = clamp(100 - continuityPenalty * 100, 0, 100);
  const trackingQuality = Math.round(0.5 * rateScore + 0.5 * continuityScore);

  // Reading time signals
  const isSlowReading = timeTaken > ageRange.max;
  const isVerySlow = timeTaken > ageRange.max * 1.5;
  const isFastReading = timeTaken < ageRange.min * 0.8; // possible skimming

  // Indicator strength combines multiple signals
  const timeOver = Math.max(0, timeTaken - ageRange.max);
  const timeScore = clamp(timeOver / Math.max(1, ageRange.max), 0, 1); // 0..1
  const regScore = clamp((regressionRatio - 0.1) / 0.4, 0, 1); // baseline 10%, saturate at 50%
  const jumpScore = clamp((largeJumpRatio - 0.05) / 0.25, 0, 1); // baseline 5%, saturate at 30%

  let indicatorStrength = 0.5 * timeScore + 0.3 * regScore + 0.2 * jumpScore;
  if (isFastReading) indicatorStrength = Math.max(indicatorStrength, 0.2);

  const hasDyslexia = indicatorStrength >= 0.55 || isVerySlow;

  // Confidence reflects tracking quality and signal strength (not a medical certainty)
  let confidence;
  const qualityFactor = trackingQuality / 100; // 0..1
  if (hasDyslexia) {
    confidence = Math.round(clamp(50 + 40 * indicatorStrength * qualityFactor + 10 * (stabilityScore / 100), 40, 95));
  } else {
    const negativeStrength = 1 - indicatorStrength;
    confidence = Math.round(clamp(45 + 35 * negativeStrength * qualityFactor + 10 * (stabilityScore / 100), 35, 95));
  }

  // Compose reasoning
  const reasoningParts = [];
  reasoningParts.push(`Reading time: ${timeTaken}s (expected ${ageRange.min}-${ageRange.max}s for age ${childAge || 'N/A'})`);
  reasoningParts.push(`Tracking quality: ${trackingQuality}% (rate ~${dataRateHz.toFixed(1)}Hz, regressions ${Math.round(regressionRatio * 100)}%)`);
  if (hasDyslexia) {
    reasoningParts.push(`Signals: ${isSlowReading ? 'slow reading' : ''}${isVerySlow ? ' (very slow)' : ''}${regressionRatio > 0.2 ? (isSlowReading ? ', ' : '') + 'frequent regressions' : ''}${largeJumpRatio > 0.15 ? ', large saccades' : ''}`);
  } else {
    reasoningParts.push('Eye movement patterns and timing fall within expected ranges.');
  }

  const advice = hasDyslexia
    ? 'These screening signals suggest possible reading difficulties. Please consider a comprehensive evaluation by a qualified specialist.'
    : "Current signals are within expected ranges. Continue regular reading practice and monitoring; seek evaluation if concerns persist.";

  return {
    hasDyslexia,
    confidence,
    advice,
    reasoning: reasoningParts.join(' | ')
  };
};

module.exports = {
  analyzeScreenerTest,
  analyzeReadingTest,
  SCREENER_QUESTIONS
};