import userService from "../services/userService.js";

export const userController = async (req, res) => {
  const { name } = req.body;
  if (name) {
    try {
      await userService.register(req.body);
      res.status(200).json({ message: "User registered" });
    } catch (error) {
      console.log("Ошибка:", error);
      res.status(400).json({ error: "Email already exists" });
    }
  } else {
    try {
      const token = await userService.login(req.body);
      res.status(200).json({ token });
    } catch (error) {
      res.status(401).json({ error: "Invalid credentials" });
    }
  }
};
