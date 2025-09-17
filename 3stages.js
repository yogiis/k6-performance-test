import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  stages: [
    { duration: '5s', target: 20 }, // naik ke 20 VU
    { duration: '5s', target: 20 }, // tetap 20 VU
    { duration: '5s', target: 0 }, // turun ke 0 VU
  ],
};

export default function() {
  let res = http.get('https://quickpizza.grafana.com');
  check(res, { "status is 200": (res) => res.status === 200 });
  sleep(1); // tunggu 1 detik sebelum iterasi berikutnya
}