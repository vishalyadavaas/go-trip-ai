/**
 * Simple Test Script for AI Endpoints
 * 
 * Usage:
 * 1. First login to get a token:
 *    node test-ai.js login
 * 
 * 2. Copy the token from the response and export it:
 *    export AUTH_TOKEN="your_token_here"
 * 
 * 3. Test the endpoints:
 *    node test-ai.js recommend
 *    node test-ai.js packing
 *    node test-ai.js safety
 */

const axios = require('axios');

const BASE_URL = process.env.API_URL || 'http://localhost:5000';
const AUTH_TOKEN = process.env.AUTH_TOKEN;

// Color codes for terminal output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Test data
const testData = {
  login: {
    email: 'test@example.com',
    password: 'password123'
  },
  register: {
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  },
  recommend: {
    budget: 'medium',
    place: 'Paris',
    days: 5,
    travelStyle: 'adventure',
    companions: 'friends'
  },
  packing: {
    destination: 'Tokyo',
    days: 7,
    season: 'winter',
    activities: ['sightseeing', 'hiking', 'shopping'],
    budget: 'medium'
  },
  safety: {
    destination: 'Bangkok',
    travelStyle: 'adventure',
    companions: 'solo',
    season: 'summer'
  }
};

async function testLogin() {
  log('\n🔐 Testing Login...', 'blue');
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/login`, testData.login);
    log('✅ Login successful!', 'green');
    log('\n📋 Copy this token:', 'yellow');
    log(`export AUTH_TOKEN="${response.data.token}"\n`, 'green');
    log('Response:', 'blue');
    console.log(JSON.stringify(response.data, null, 2));
    return response.data.token;
  } catch (error) {
    if (error.response?.status === 401 || error.response?.status === 404) {
      log('\n⚠️  User not found. Trying to register...', 'yellow');
      return testRegister();
    }
    log('❌ Login failed:', 'red');
    console.error(error.response?.data || error.message);
  }
}

async function testRegister() {
  log('\n📝 Testing Registration...', 'blue');
  try {
    const response = await axios.post(`${BASE_URL}/api/auth/register`, testData.register);
    log('✅ Registration successful!', 'green');
    log('\n📋 Copy this token:', 'yellow');
    log(`export AUTH_TOKEN="${response.data.token}"\n`, 'green');
    log('Response:', 'blue');
    console.log(JSON.stringify(response.data, null, 2));
    return response.data.token;
  } catch (error) {
    log('❌ Registration failed:', 'red');
    console.error(error.response?.data || error.message);
  }
}

async function testRecommendTrip(token) {
  log('\n✈️  Testing Trip Recommendation...', 'blue');
  try {
    const response = await axios.post(
      `${BASE_URL}/api/ai/recommend-trip`,
      testData.recommend,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    log('✅ Success!', 'green');
    log(`\n📊 Source: ${response.data.source}`, 'yellow');
    log('\nResponse:', 'blue');
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    log('❌ Request failed:', 'red');
    console.error(error.response?.data || error.message);
  }
}

async function testPackingList(token) {
  log('\n🎒 Testing Packing List...', 'blue');
  try {
    const response = await axios.post(
      `${BASE_URL}/api/ai/packing-list`,
      testData.packing,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    log('✅ Success!', 'green');
    log(`\n📊 Source: ${response.data.source}`, 'yellow');
    log('\nResponse:', 'blue');
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    log('❌ Request failed:', 'red');
    console.error(error.response?.data || error.message);
  }
}

async function testSafetyTips(token) {
  log('\n🛡️  Testing Safety Tips...', 'blue');
  try {
    const response = await axios.post(
      `${BASE_URL}/api/ai/safety-tips`,
      testData.safety,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    log('✅ Success!', 'green');
    log(`\n📊 Source: ${response.data.source}`, 'yellow');
    log('\nResponse:', 'blue');
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    log('❌ Request failed:', 'red');
    console.error(error.response?.data || error.message);
  }
}

async function testAll() {
  log('\n🚀 Running all tests...', 'blue');
  log('=' .repeat(50), 'blue');
  
  // First, get auth token
  const token = await testLogin();
  
  if (!token) {
    log('\n❌ Cannot proceed without authentication token', 'red');
    return;
  }

  // Test all endpoints
  await testRecommendTrip(token);
  await testPackingList(token);
  await testSafetyTips(token);
  
  log('\n' + '='.repeat(50), 'blue');
  log('✅ All tests completed!', 'green');
}

// Main execution
const command = process.argv[2] || 'help';

(async () => {
  switch (command.toLowerCase()) {
    case 'login':
      await testLogin();
      break;
    
    case 'register':
      await testRegister();
      break;
    
    case 'recommend':
    case 'trip':
      if (!AUTH_TOKEN) {
        log('❌ AUTH_TOKEN not set. Run: export AUTH_TOKEN="your_token"', 'red');
        process.exit(1);
      }
      await testRecommendTrip(AUTH_TOKEN);
      break;
    
    case 'packing':
    case 'pack':
      if (!AUTH_TOKEN) {
        log('❌ AUTH_TOKEN not set. Run: export AUTH_TOKEN="your_token"', 'red');
        process.exit(1);
      }
      await testPackingList(AUTH_TOKEN);
      break;
    
    case 'safety':
      if (!AUTH_TOKEN) {
        log('❌ AUTH_TOKEN not set. Run: export AUTH_TOKEN="your_token"', 'red');
        process.exit(1);
      }
      await testSafetyTips(AUTH_TOKEN);
      break;
    
    case 'all':
      await testAll();
      break;
    
    case 'help':
    default:
      log('\n📚 AI Endpoints Test Script', 'blue');
      log('=' .repeat(50), 'blue');
      log('\nUsage:', 'yellow');
      log('  node test-ai.js <command>\n', 'green');
      log('Commands:', 'yellow');
      log('  login      - Get authentication token', 'green');
      log('  register   - Register new user', 'green');
      log('  recommend  - Test trip recommendation', 'green');
      log('  packing    - Test packing list', 'green');
      log('  safety     - Test safety tips', 'green');
      log('  all        - Run all tests', 'green');
      log('  help       - Show this help\n', 'green');
      log('Setup:', 'yellow');
      log('  1. Start your server: npm start', 'green');
      log('  2. Get token: node test-ai.js login', 'green');
      log('  3. Export token: export AUTH_TOKEN="your_token"', 'green');
      log('  4. Test endpoint: node test-ai.js recommend\n', 'green');
      log('Environment Variables:', 'yellow');
      log('  API_URL     - Server URL (default: http://localhost:5000)', 'green');
      log('  AUTH_TOKEN  - JWT authentication token\n', 'green');
      break;
  }
})();
