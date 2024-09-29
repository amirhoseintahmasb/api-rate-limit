
import { Injectable, HttpStatus } from '@nestjs/common';
import * as NodeCache from 'node-cache';

@Injectable()
export class ApiService {
  private readonly cache: NodeCache;
  private readonly rateLimitMap: Map<string, { timestamp: number, count: number }>;

  constructor() {
    this.cache = new NodeCache({ stdTTL: 60 });
    this.rateLimitMap = new Map();
  }

  async getData(userId: string) {
    const currentTime = Date.now();
    const userRate = this.rateLimitMap.get(userId) || { timestamp: currentTime, count: 0 };

    if (currentTime - userRate.timestamp < 60000) {
      if (userRate.count >= 10) {
        return { status: HttpStatus.TOO_MANY_REQUESTS, data: 'Too many requests, please try again later' };
      } else {
        userRate.count += 1;
      }
    } else {
      userRate.timestamp = currentTime;
      userRate.count = 1;
    }

    this.rateLimitMap.set(userId, userRate);

    const cachedData = this.cache.get(userId);
    if (cachedData) {
      return { status: HttpStatus.OK, data: cachedData };
    }

    const mockData = { id: userId, data: 'Random user data' }; // Mock data
    this.cache.set(userId, mockData);

    return { status: HttpStatus.OK, data: mockData };
  }
}
