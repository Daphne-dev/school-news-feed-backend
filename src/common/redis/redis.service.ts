import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly configService: ConfigService,
  ) {}

  async get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  async set<T = unknown>(key: string, value: T, time: number): Promise<void> {
    await this.redis.set(key, JSON.stringify(value), 'EX', time);
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }

  generateKey(...segments: string[]): string {
    const prefix = this.configService.getOrThrow<string>('ENVIRONMENT');
    return `${prefix}:${segments.join(':')}`;
  }
}
