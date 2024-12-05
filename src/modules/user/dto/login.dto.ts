import { schema } from "express-validation";
import Joi from "joi";

export const LoginDto: schema = {
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    csrfToken: Joi.string().required(),
  }),
};
