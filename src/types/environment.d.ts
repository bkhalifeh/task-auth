export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production";
      APP_PORT: string;
      APP_HOST: string;
      DATABASE_URL: string;
      DATABASE_NAME: string;
      REDIS_URL: string;
      SESSION_SECRET: string;
      SESSION_TTL: string;
    }
  }
}
