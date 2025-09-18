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

const analyzeReadingTest = (eyeTrackingData, timeTaken, childAge) => {
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
  
  const ageRange = expectedReadingTimes[childAge] || expectedReadingTimes[8];
  const isSlowReading = timeTaken > ageRange.max;
  const isFastReading = timeTaken < ageRange.min;
  
  // Analyze eye tracking patterns (simplified analysis)
  let erraticEyeMovement = false;
  let regressionCount = 0;
  
  if (eyeTrackingData && eyeTrackingData.gazePoints) {
    // Count backward eye movements (regressions)
    for (let i = 1; i < eyeTrackingData.gazePoints.length; i++) {
      const current = eyeTrackingData.gazePoints[i];
      const previous = eyeTrackingData.gazePoints[i - 1];
      
      // If current x position is significantly less than previous (regression)
      if (current.x < previous.x - 50) {
        regressionCount++;
      }
    }
    
    // More than 20% regressions indicate difficulty
    erraticEyeMovement = regressionCount > (eyeTrackingData.gazePoints.length * 0.2);
  }
  
  // Determine results
  let hasDyslexia = false;
  let confidence = 0;
  let advice = "";
  let reasoning = "";
  
  if (isSlowReading && erraticEyeMovement) {
    hasDyslexia = true;
    confidence = 85;
    advice = "The reading test results suggest potential dyslexia indicators. We recommend a comprehensive evaluation by a qualified specialist for proper diagnosis and intervention planning.";
    reasoning = `Your child took ${timeTaken} seconds to read the passage (expected range: ${ageRange.min}-${ageRange.max} seconds) and showed ${regressionCount} backward eye movements, indicating potential reading difficulties.`;
  } else if (isSlowReading || erraticEyeMovement) {
    hasDyslexia = true;
    confidence = 60;
    advice = "Some indicators suggest your child may benefit from additional reading support. Consider discussing these results with their teacher or a reading specialist.";
    reasoning = isSlowReading 
      ? `Your child took longer than expected to read the passage (${timeTaken} vs ${ageRange.max} seconds expected).`
      : `Your child showed irregular eye movement patterns with ${regressionCount} regressions during reading.`;
  } else {
    hasDyslexia = false;
    confidence = 25;
    advice = "The reading test results are within normal ranges. Continue encouraging regular reading practice to support your child's development.";
    reasoning = `Your child completed the reading test in ${timeTaken} seconds (within expected range: ${ageRange.min}-${ageRange.max}) with normal eye movement patterns.`;
  }
  
  return {
    hasDyslexia,
    confidence,
    advice,
    reasoning
  };
};

module.exports = {
  analyzeScreenerTest,
  analyzeReadingTest,
  SCREENER_QUESTIONS
};