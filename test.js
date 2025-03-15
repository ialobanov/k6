import http from 'k6/http';
import { Rate } from 'k6/metrics';
import { check } from 'k6';

const failures = new Rate('falied_requests');

export const options = {
  vus: 1000,
  duration: '10s',
  thresholds: {
    http_req_failed: ['rate<=0'],
    http_req_duration: ['p(95)<500']
  }
}

export default function() {
  const result = http.get('https://quickpizza.grafana.com/');
  check(result, {
    'http response status code is 200': r => r.status === 200,
  });
  failures.add(result.status !== 200);
}