# API Rate Limiting & Caching System

## Overview
This Node.js microservice implements:
1. API Rate Limiting (10 requests per minute per user).
2. Response Caching (60 seconds default).

## Features
- Rate Limiting per User: Users are identified by `userId` in the request header.
- Response Caching: Cached responses for 60 seconds to improve performance.
- Graceful Degradation: Logs cache failures and serves data without caching.

## Setup

### Prerequisites
- Node.js
- Yarn (or npm)

### Installation

1. Clone the repository:
    ```bash
    git clone <repository-url>
    cd interview-challenge-main
    ```

2. Install dependencies:
    ```bash
    yarn install
    ```

3. Run the service:
    ```bash
    yarn start:dev
    ```

The service will start on `http://localhost:3000`.

## API Endpoints

### GET /data

Request Headers:
- `userId`: A unique identifier for the user.

Response: 
- 200 OK: Returns mock user data.
- 429 Too Many Requests: Rate limit exceeded.

### Sample API Calls:

#### Normal Request:
```bash
curl -X GET http://localhost:3000/data -H "userid: user1"
```

#### Exceeding Rate Limit (more than 10 requests per minute):
```bash
for i in {1..12}; do curl -X GET http://localhost:3000/data -H "userid: user1"; done
```

- The first 10 requests will return the data.
- After 10 requests, you will receive the following response:
  ```json
  {
    "statusCode": 429,
    "message": "Too many requests, please try again later"
  }
  ```

### Response Caching:
Make the same request within 60 seconds to observe the cached response:
```bash
curl -X GET http://localhost:3000/data -H "userid: user2"
curl -X GET http://localhost:3000/data -H "userid: user2"
```

The second call will return the same cached data.

## Testing

To run unit tests:
```bash
yarn test
```

### Expected Test Results:

```bash
 PASS  test/api.service.spec.ts
  ApiService
    ✓ should allow up to 10 requests per minute (5ms)
    ✓ should cache the response for 60 seconds (3ms)
    ✓ should reset rate limit after 1 minute (2ms)

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
Snapshots:   0 total
Time:        2.349s
```

### Verifying Behavior:

- **Rate Limiting**: You'll receive a `429` error when exceeding the request limit.
- **Caching**: The cached response will be returned for repeated requests within 60 seconds.