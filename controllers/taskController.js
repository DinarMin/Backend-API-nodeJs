import taskService from "../services/taskService.js";
import logger from "../utils/logger.js";

export const createTask = async (req, res) => {
  try {
    const { title } = req.body;
    const result = await taskService.createTask(title, req.userId);
    logger.info(`Задача успешно добавлена! userid: ${req.userId} ${result}`);
    res.status(201).json({ message: "Задача успешно добавлена", result});
  } catch (err) {
    console.error("Ошибка при создании задачи:", err);
    logger.warn(
      `Не удалось создать задачу. userId: ${req.userId}, ${err.message}`
    );
    res.status(500).json({
      error: "Ошибка сервера. Не удалось создать задачу. Попробуйте снова.",
    });
  }
};

export const getAllTask = async (req, res) => {
  try {
    const result = await taskService.getAllTask(req.userId);
    res.json(result.rows);
  } catch (error) {
    console.log(error);
    logger.warn(`Не удалось получить список задач! userid: ${req.userId}`);
    res.status(500).json({ error: "Не удалось получить список задач." });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const result = await taskService.updateStatus(req);
    logger.info(`Статус задачи успешно обновлена. taskID: ${req.body.taskId}`);
    res.status(200).json({ task: result });
  } catch (error) {
    console.log(error);
    res
      .status(404)
      .json({ error: "Произошла ошибка, повторите попытку еще раз." });
  }
};

export const deleteTask = async (req, res) => {
  try {
    await taskService.deleteTask(req);
    res.status(204).end();
  } catch (error) {
    res.status(404).json(error.message);
  }
};
