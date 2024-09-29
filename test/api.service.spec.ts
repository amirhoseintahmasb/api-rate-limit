
import { ApiService } from '../src/modules/api/api.service';

describe('ApiService', () => {
  let apiService: ApiService;

  beforeEach(() => {
    apiService = new ApiService();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it('should allow up to 10 requests per minute', async () => {
    const userId = 'user1';

    for (let i = 0; i < 10; i++) {
      const result = await apiService.getData(userId);
      expect(result.status).toBe(200);
    }

    const result = await apiService.getData(userId);
    expect(result.status).toBe(429);
    expect(result.data).toBe('Too many requests, please try again later');
  });

  it('should cache the response for 60 seconds', async () => {
    const userId = 'user2';

    const firstResult = await apiService.getData(userId);
    expect(firstResult.status).toBe(200);

    const secondResult = await apiService.getData(userId);
    expect(secondResult.status).toBe(200);
    expect(secondResult.data).toStrictEqual(firstResult.data); // Cached data
  });

  it('should reset rate limit after 1 minute', async () => {
    const userId = 'user3';

    for (let i = 0; i < 10; i++) {
      const result = await apiService.getData(userId);
      expect(result.status).toBe(200);
    }

    jest.advanceTimersByTime(60000); // Fast forward 1 minute

    const result = await apiService.getData(userId);
    expect(result.status).toBe(200); // Rate limit reset
  });
});
