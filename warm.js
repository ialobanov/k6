import http from 'k6/http';
import { check } from 'k6';

export let options = {
    scenarios: {
        line_rps: {
            executor: 'ramping-arrival-rate',
            startRate: 10,
            timeUnit: '1s',
            preAllocatedVUs: 10,
            maxVUs: 100,
            stages: [
                { target: 250, duration: '30s' },
            ],
        },
    },
    thresholds: {
        'http_req_duration': ['p(95)<1000'], // аналог quantile(95,1s,10s)
        'http_req_failed': ['rate<0.25'],   // аналог net(110,25%,1s)
    },
};

const params = {
    headers: {
        'Host': 'dvwa',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.6723.70 Safari/537.36',
        'Connection': 'close'
    }
};

export default function () {
    let res = http.get('http://10.72.55.130:80/', params);
    check(res, {
        'is status 200': (r) => r.status === 200,
    });
}