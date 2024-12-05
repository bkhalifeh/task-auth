import { schema } from "express-validation";
import Joi from "joi";

export const RegisterDto: schema = {
  body: Joi.object({
    fullName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    csrfToken: Joi.string().required(),
  }),
};

export type TRegisterBody = {
  fullName: string;
  email: string;
  password: string;
};
