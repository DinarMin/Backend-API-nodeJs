import Joi from "joi";

export const registerSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string().min(3).max(50).required().email().trim(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("user", "admin").optional(),
});

export const loginSchema = Joi.object({
  email: Joi.string().min(3).max(50).required().email().trim(),
  password: Joi.string().min(6).required(),
});

export const taskSchema = Joi.object({
  title: Joi.string().min(2).required(),
});

export const weatherSchema = Joi.object({
  city: Joi.string().min(3).required(),
});
