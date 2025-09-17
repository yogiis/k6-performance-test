import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: 50, // 50 virtual users
  duration: '10s', // test akan berjalan selama 10 detik
  rps: 100, // maks 100 request per detik
};

export default function() {
  let res = http.get('https://quickpizza.grafana.com');
  check(res, { "status is 200": (res) => res.status === 200 });
  // sleep(1); // matikan sleep untuk membuat burst request
}