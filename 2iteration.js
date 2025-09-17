import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: 10, // 10 virtual users
  iterations: 100, // total 100 request
};

export default function() {
  let res = http.get('https://quickpizza.grafana.com');
  check(res, { "status is 200": (res) => res.status === 200 });
  sleep(1); // tunggu 1 detik sebelum iterasi berikutnya
}