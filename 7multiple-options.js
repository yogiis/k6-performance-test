import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: 50, // 50 virtual users
  stages: [
    { duration: '5s', target: 20 }, // naik ke 20 VU
    { duration: '5s', target: 20 }, // tetap 20 VU
    { duration: '5s', target: 0 }, // turun ke 0 VU
  ],
  thresholds: {
    http_req_duration: ['p(95)<500', 'avg < 10'],  // 95% request harus < 500ms, request rata-rata harus < 10ms
    http_req_failed: ['rate<0.01'],    // error rate harus < 1%
  },
  summaryTrendStats: ['avg', 'p(95)', 'min', 'max'], // menampilkan statistik tambahan pada summary
};

export default function() {
  let res = http.get('https://quickpizza.grafana.com');
  check(res, { "status is 200": (res) => res.status === 200 });
}