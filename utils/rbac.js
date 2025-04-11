import logger from "./logger.js";
import User from "../server/models/User.js";

const permissions = {
  admin: ["users:read", "tasks:manage"],
  user: ["tasks:create", "tasks:read"],
};

const checkPermissions = (permission) => async (req, res, next) => {
  const user = await User.findById(req.userId);
  if (!user) {
    logger.error(`User nod found: ${req.userId}`);
    return res.status(404).json({ error: "User not found" });
  }
  const userPermissions = permissions[user.role] || [];
  if (!userPermissions.includes(permission)) {
    logger.warn(
      `Access denied for ${req.userId}: required ${permission}, role: ${user.role}`
    );
    return res.status(403).json({ error: "Forbidden" });
  }
  logger.info(`Permission check passed for ${req.userId}: ${permission}`);
  next();
};

export default checkPermissions;
