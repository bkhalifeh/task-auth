import IoRedis from "ioredis";

export class Redis extends IoRedis {
  private static instance: Redis;
  public static getInstance() {
    return this.instance;
  }

  public static async init() {
    if (!this.instance) {
      this.instance = new Redis(process.env.REDIS_URL);
    }
  }
}
