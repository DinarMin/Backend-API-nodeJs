import Queue from "bull";
import logger from "../utils/logger.js";

const emailQueue = new Queue("email", {
  redis: {
    host: "localhost",
    port: 6379,
  },
});

emailQueue.process(async (job) => {
  const { userId, message } = job.data;
  logger.info(`Processing email for user ${userId}: ${message}`);
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { status: "sent" };
});

emailQueue.on("failed", (job, err) => {
  logger.error(`Email job failed for user ${job.data.userId}: ${err.message}`);
});

emailQueue.on("completed", (job, result) => {
  logger.info(
    `Email job completed for user ${job.data.userId}: ${result.status}`
  );
});

export default emailQueue;
