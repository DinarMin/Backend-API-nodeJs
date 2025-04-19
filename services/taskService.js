import emailQueue from "../queues/emailQueue.js";
import logger from "../utils/logger.js";
import taskModel from "../models/PostgreSQL/taskModel.js";

const createTask = async (title, userId) => {
  const result = await taskModel.createTask(title, userId);
  await emailQueue.add({
    userId: userId,
    message: `Task "${title}" created successfully`,
  });
  logger.info(`Task created: ${title} by user ${userId}`);
  return result;
};

const getAllTask = async (userId) => {
  const result = await taskModel.getAllTask(userId);
  return result;
};

const updateStatus = async (req) => {
  const { userId } = req;
  const { status, taskId } = req.body;
  const result = await taskModel.updateStatus(status, taskId, userId);
  const task = result.rows;
  if (task.length === 0) {
    logger.warn(
      `Произошла ошибка, задача не найдена в базе данных! userID: ${userId}`
    );
    return {
      message: "Произошла ошибка, задача не найдена в базе данных!",
    };
  }
  return task;
};

const deleteTask = async (req) => {
  const result = await taskModel.deleteTask(req.body.id, req.userId);
  if (!result.rows[0]) {
    return {
      message: "Произошла ошибка, задача не найдена в базе данных!",
    };
  }
};

export default { createTask, getAllTask, updateStatus, deleteTask };
