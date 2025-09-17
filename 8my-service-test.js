import http from 'k6/http';
import { check, fail } from 'k6';

// init
export const options = {
  vus: 5,
  stages: [
    { duration: '5s', target: 10 },// naik ke 10 VU
    { duration: '5s', target: 10 },// tetap 10 VU
    { duration: '5s', target: 0 },// turun ke 0 VU
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],  // 95% request harus < 500ms, request rata-rata harus < 10ms
    http_req_failed: ['rate<0.01'],    // error rate harus < 1%,
  },
  summaryTrendStats: ['avg', 'p(95)', 'min', 'max'], // menampilkan statistik tambahan pada summary
};

// base URL for the API
const BASE_URL = __ENV.BASE_URL || 'http://localhost:8030'; // base URL for the API
const EMAIL = __ENV.EMAIL || 'yogi@gmail.com'; // default email
const PASSWORD = __ENV.PASSWORD || 'password'; // default password

// setup function
export function setup() {
  const email = EMAIL; 
  const password = PASSWORD; 

  console.log(`🔑 Logging in to get token for user: ${email}`);

  const loginRes = http.post(`${BASE_URL}/api/v1/sessions`, JSON.stringify({
    email: email,
    password: password,
  }), {
    headers: { 'Content-Type': 'application/json' },
  }); // login request

  const body = JSON.parse(loginRes.body); // parse JSON response
  if (!body.data || !body.data.token) {
    fail('❌ Failed to login and retrieve token');
  }

  const token = body.data.token; // extract token from response
  console.log(`✅ Get token: ${token}`); // log token

  // return as object
  return { email, token }; // return email and token
}

// default function
export default function (setupData) { // menerima data dari setup
  const token = setupData.token; // ambil token dari setup data

  const res = http.get(`${BASE_URL}/api/v1/users/1/weekly-summary`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  }); // request ke endpoint dengan header Authorization

  check(res, { 
    'status is 200': (r) => r.status === 200, // status harus 200
    'response contains data': (r) => r.body.includes('code'), // body harus mengandung 'code'
    'response has message success': (r) => r.json('message') === 'Weekly summary retrieved successfully', // message harus sesuai
  });
}

// teardown function
export function teardown(setupData) {
  console.log(`🧹 Teardown called. Token used: ${setupData.token}, for user: ${setupData.email}`); // log token dan email
}

// BASE_URL=http://localhost:8030 EMAIL=yogi@gmail.com PASSWORD=password k6 run my-service-test.js