import userService from "../services/userService.js";

export const userController = async (req, res) => {
  const { name } = req.body;
  try {
    if (name) {
      await userService.register(req.body);
      res.status(200).json({ message: "User registered" });
    } else {
      const token = await userService.login(req.body);
      res.status(200).json({ token });
    }
  } catch (error) {
    res.status(404).json({ error });
    console.log("Произошла ошибка:" + error);
  }
};
