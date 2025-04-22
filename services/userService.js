import { registerSchema, loginSchema } from "../validations/validation.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import logger from "../utils/logger.js";
import userModel from "../models/PostgreSQL/userModel.js";

const register = async ({ name, email, password, role }) => {
  const { error } = registerSchema.validate({ name, email, password });
  if (error) {
    logger.warn(`Ошибка валидации: ${error.details}`);
    throw new Error(`error: ${error.details[0].message}`);
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  await userModel.create({ name, email, hashedPassword, role });
  logger.info(`Регистрация прошла успешно! email: ${email}`);
};

const login = async ({ email, password }) => {
  const { error } = loginSchema.validate({ email, password });
  if (error) {
    throw new Error(`error: ${error.details[0].message}`);
  }
  const result = await userModel.check(email);
  const user = result.rows[0];
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error("error: Неверный логин или пароль!");
  }
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "60d",
  });
  logger.info(`Авторизация прошла успешно! email: ${email}`);
  return token;
};

export default { register, login };
