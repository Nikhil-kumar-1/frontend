class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorMiddleware = (err, req, res, next) => {
  if (!err.statusCode) err.statusCode = 500;
  if (!err.message) err.message = "Internal server error";

  if (err.name === "CaseError") {
    err.message = `Resource not found. Invalid ${err.path}`;
    err.statusCode = 400;
  } else if (err.code === 11000) {
    err.message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err.statusCode = 400;
  } else if (err.name === "JsonWebTokenError") {
    err.message = `Json web token is Invalid. Try again`;
    err.statusCode = 400;
  } else if (err.name === "TokenExpiredError") {
    err.message = `Json web token is expired. Try again`;
    err.statusCode = 400;
  }

  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

export default ErrorHandler;
