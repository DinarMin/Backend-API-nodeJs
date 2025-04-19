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


export const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body || req.params);
  const text = req.body.text;
  if (error) {
    logger.warn(`Validation failed: ${error.details[0].message}`);
    return res.status(400).json({ error: error.details[0].message });
  }
  console.log(" Валидация прошла успешно! ");
  if (text) {
    logger.info(`Валидация прошла успешно! text: ${text}`);
  }
  next();
};

