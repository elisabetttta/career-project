class AppError extends Error {
  constructor(message, status = 500) {
    super(message);

    this.status = status;
    this.name = 'AppError';

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;