import { Request, Response, Router } from "express";
import { UserService } from "../service/user.service";
import {
  csrfSynchronisedProtection,
  generateToken,
} from "../../../common/csrf";
import { validate } from "express-validation";
import { LoginDto } from "../dto/login.dto";
import { RegisterDto } from "../dto/register.dto";
import passport from "passport";
import autoBind from "auto-bind";

export class UserController {
  private readonly userService = new UserService();

  constructor(router: Router) {
    autoBind(this);
    const userRoutes = Router();

    userRoutes
      .route("/register")
      .get(this.registerGet)
      .post(
        csrfSynchronisedProtection,
        validate(RegisterDto) as any,
        this.registerPost
      );

    userRoutes
      .route("/login")
      .get(this.loginGet)
      .post(
        csrfSynchronisedProtection,
        validate(LoginDto) as any,
        passport.authenticate("local"),
        this.loginPost
      );

    userRoutes.route("/logout").all(this.logout);

    router.use("/user", userRoutes);
  }

  registerGet(req: Request, res: Response) {
    res.render("register", { csrfToken: generateToken(req, true) });
  }

  registerPost(req: Request, res: Response) {
    this.userService.register(req.body).then((insertedResult) => {
      res.redirect("/user/login");
    });
  }

  loginGet(req: Request, res: Response) {
    res.render("login", { csrfToken: generateToken(req, true) });
  }

  loginPost(req: Request, res: Response) {
    res.redirect("/");
  }

  logout(req: Request, res: Response) {
    req.logOut((err) => {
      if (err) throw err;
    });
    res.redirect("/user/login");
  }
}
