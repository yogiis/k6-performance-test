import http from 'k6/http';
import { sleep } from 'k6';
import { expect } from "https://jslib.k6.io/k6-testing/0.5.0/index.js";

export const options = {
  vus: 10, // 10 virtual users
  duration: '10s', // test akan berjalan selama 10 detik
};

export default function() {
  let res = http.get('https://quickpizza.grafana.com');
  expect.soft(res.status).toBe(200);
  sleep(1); // tunggu 1 detik sebelum iterasi berikutnya
}
