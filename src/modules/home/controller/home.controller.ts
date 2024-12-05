import autoBind from "auto-bind";
import { Request, Response, Router } from "express";
import isAuth from "../../../common/is-auth";

export class HomeController {
  constructor(router: Router) {
    autoBind(this);
    const homeRoutes = Router();
    homeRoutes.all("/", isAuth, this.home);
    router.use(homeRoutes);
  }

  home(req: Request, res: Response) {
    res.render("welcome", { user: req.user });
  }
}
