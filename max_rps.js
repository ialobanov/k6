import http from 'k6/http';
import { Rate } from 'k6/metrics';
import { check } from 'k6';

const failures = new Rate('falied_requests');

export const options = {
  scenarios: {
    constants: {
      executor: 'ramping-arrival-rate',
      startRate: 1, // Start iterations per `timeUnit`
      timeUnit: '1s', // 1000 iterations per second, i.e. 1000 RPS
      preAllocatedVUs: 10, // how large the initial pool of VUs would be
      maxVUs: 400, // if the preAllocatedVUs are not enough, we can initialize more
      stages: [
        { target: 1500, duration: '5m' }
      ],
    },
  },
  thresholds: {
    http_req_failed: [
      {
        threshold: 'rate<=0',
        abortOnFail: true, // boolean
        delayAbortEval: '1s', // string
      },
    ],
    http_req_duration: [
      {
        threshold: 'p(95)<300',
        abortOnFail: true, // boolean
        delayAbortEval: '1s', // string
      },
    ],
  },
};

const params = {
  headers: {
      'Host': 'dvwa',
      'Accept-Language': 'en-US,en;q=0.9',
      'Upgrade-Insecure-Requests': '1',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.70 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'ru,en;q=0.9,en-GB;q=0.8,en-US;q=0.7',
      'Cookie': 'PHPSESSID=l84go889v1oh2igsm8geru3cn6; security=low',
      'Connection': 'keep-alive'
  }
};

export default function() {
  const result = http.get('http://10.72.55.130:80', params);
  check(result, {
    'http response status code is 200': r => r.status === 200,
  });
  failures.add(result.status !== 200);
}