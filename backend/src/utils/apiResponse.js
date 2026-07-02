// src/utils/apiResponse.js
export const sendSuccess = (
  res,
  data = {},
  message = "Success",
  statusCode = 200,
) => res.status(statusCode).json({ success: true, message, data });

export const sendCreated = (res, data = {}, message = "Created") =>
  res.status(201).json({ success: true, message, data });

export const sendError = (
  res,
  message = "Something went wrong",
  statusCode = 500,
  errors = null,
) => {
  const body = { success: false, message };
  if (errors) body.errors = errors;
  return res.status(statusCode).json(body);
};

export const sendNotFound = (res, message = "Not found") =>
  sendError(res, message, 404);
export const sendBadRequest = (res, message = "Bad request", errors = null) =>
  sendError(res, message, 400, errors);
export const sendUnauthorized = (res, message = "Unauthorized") =>
  sendError(res, message, 401);
export const sendForbidden = (res, message = "Forbidden") =>
  sendError(res, message, 403);
export const sendConflict = (res, message = "Conflict") =>
  sendError(res, message, 409);
