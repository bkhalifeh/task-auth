import { NextFunction, Request, Response } from "express";

const isAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/user/login");
  }
};

export default isAuth;
