import { sendForbidden } from "../utils/apiResponse.js";

// Reads role from Clerk's public metadata
export const requireRole =
  (...roles) =>
  (req, res, next) => {
    const auth = req.auth?.();
    const role =
      auth?.sessionClaims?.metadata?.role ||
      auth?.sessionClaims?.public_metadata?.role;

    if (!role || !roles.includes(role)) {
      return sendForbidden(res, `Access restricted to: ${roles.join(", ")}`);
    }
    next();
  };
