import winston from "winston";
import MongoDB from "winston-mongodb";
import dotenv from "dotenv";

dotenv.config();

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: "app.log" }),
    // new winston.transports.MongoDB({
    //   db: process.env.DBURL,
    //   collection: "logs",
    //   level: "info",
    // }),
  ],
});

export default logger;
