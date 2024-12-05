import { IVerifyOptions } from "passport-local";
import { MongoDb } from "../../../common/db";
import { Collection } from "mongodb";
import { User } from "../schema/user.schema";
import argon2 from "argon2";
import { TRegisterBody } from "../dto/register.dto";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import autoBind from "auto-bind";

export class UserService {
  private readonly userModel: Collection<User> =
    MongoDb.getInstance().collection("users");

  constructor() {
    autoBind(this);
    this.userModel
      .createIndex({ email: 1 }, { unique: true })
      .then((v) => {})
      .catch((r) => {
        throw r;
      });

    passport.use(new LocalStrategy({ usernameField: "email" }, this.login));
    passport.serializeUser((user, done) => {
      done(null, user);
    });
    passport.deserializeUser((user, done) => {
      done(null, user);
    });
  }

  public login(
    email: string,
    password: string,
    done: (
      error: any,
      user?: Express.User | false,
      options?: IVerifyOptions
    ) => void
  ) {
    this.userModel
      .findOne({ email })
      .then((user) => {
        if (user) {
          argon2
            .verify(user.password, password)
            .then((res) => {
              done(
                null,
                res
                  ? { id: user._id, email: user.email, fullName: user.fullName }
                  : false
              );
            })
            .catch((err) => {
              done(err);
            });
        } else {
          done(null, false);
        }
      })
      .catch((err) => {
        done(err);
      });
  }

  public async register(body: TRegisterBody) {
    return argon2.hash(body.password).then((hashPassword) => {
      body.password = hashPassword;
      return this.userModel.insertOne(body);
    });
  }
}
