 function AppError(message, status) {
    this.message = message;
    this.status = status || 500;
    this.name = "AppError";
}

function AccessError(message) {
    this.message = message;
    this.status = 403;
    this.name = "AccessError";
}

module.exports = {
    AppError: AppError,
    AccessError: AccessError
};