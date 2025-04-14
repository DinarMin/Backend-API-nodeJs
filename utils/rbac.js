import logger from "./logger.js";
import User from "../server/models/User.js";
import pool from "../db/postgres.js";

const permissions = {
  admin: ["users:read", "tasks:manage"],
  user: ["tasks:create", "tasks:read"],
};

const checkPermissions = (permission) => async (req, res, next) => {
  const result = await pool.query('SELECT role FROM users WHERE id = $1', [req.userId]);
  const user = result.rows[0];
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
