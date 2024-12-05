import { join } from "path";

import Joi from "joi";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import passport from "passport";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { RedisStore } from "connect-redis";
import expressSession from "express-session";
import express, { Router } from "express";
import "dotenv/config";

import { MongoDb } from "./common/db";
import { Redis } from "./common/redis";
import { UserController } from "./modules/user/controller/user.controller";
import { HomeController } from "./modules/home/controller/home.controller";

async function bootstrap() {
  const app = express();

  const envValidationSchema = Joi.object<globalThis.NodeJS.ProcessEnv>({
    NODE_ENV: Joi.string()
      .valid("development", "production")
      .default("development"),
    APP_PORT: Joi.number().port().default(3000),
    APP_HOST: Joi.string().hostname().default("0.0.0.0"),
    DATABASE_URL: Joi.string().uri().required(),
    DATABASE_NAME: Joi.string().default("task_auth"),
    REDIS_URL: Joi.string().uri().required(),
    SESSION_SECRET: Joi.string()
      .base64()
      .default("rVVCoeJFEBmE+rmcnHJ9XiE7h68SOU1vWtOw6va5nN4="),
    SESSION_TTL: Joi.number().default(86400000),
  });

  const { error: envValidationError } = envValidationSchema.validate(
    process.env,
    { allowUnknown: true }
  );

  if (envValidationError) {
    throw envValidationError;
  }

  const isProduction = process.env.NODE_ENV === "production";

  await Redis.init();
  const redisStore = new RedisStore({
    client: Redis.getInstance().duplicate(),
    prefix: "session:",
  });

  await MongoDb.init();

  app.set("trust proxy", true);
  app.set("views", join(process.cwd(), "views"));
  app.set("view engine", "ejs");
  app.set("x-powered-by", false);

  app.use(helmet());
  app.use(cors());
  app.use(morgan(isProduction ? "combined" : "dev"));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(
    expressSession({
      secret: Buffer.from(process.env.SESSION_SECRET, "base64").toString(),
      cookie: {
        path: "/",
        maxAge: parseInt(process.env.SESSION_TTL),
        httpOnly: isProduction,
        sameSite: isProduction,
        secure: isProduction,
      },
      saveUninitialized: false,
      resave: false,
      store: redisStore,
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  const router = Router();

  const controllers = [HomeController, UserController];
  for (const controller of controllers) {
    new controller(router);
  }

  app.use(router);

  const port = parseInt(process.env.APP_PORT);
  const host = process.env.APP_HOST;
  const server = app.listen(port, host, () => {
    console.log(`Server start at ${host}:${port}`);
  });

  process.on("SIGTERM", () => {
    server.close((err) => {
      if (err) process.exit(1);
      process.exit(0);
    });
  });
}

bootstrap();
