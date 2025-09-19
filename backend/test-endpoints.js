const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

async function testEndpoints() {
  console.log('Testing AKSHAR Backend Endpoints...\n');
  
  try {
    // Test health endpoint
    const health = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health endpoint:', health.data);
    
    // Test screener questions
    const questions = await axios.get(`${BASE_URL}/tests/screener-questions`);
    console.log('✅ Screener questions:', questions.data.questions.length, 'questions loaded');
    
    // Test reading passage
    const passage = await axios.get(`${BASE_URL}/tests/reading-passage`);
    console.log('✅ Reading passage loaded:', passage.data.passage.substring(0, 50) + '...');
    
    console.log('\n🎉 All public endpoints working correctly!');
    console.log('\nNote: Protected endpoints (results, submit tests) require authentication token.');
    
  } catch (error) {
    console.error('❌ Error testing endpoints:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testEndpoints();