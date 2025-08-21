"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (error, _req, res, _next) => {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal server error';
    // Log error details
    console.error(`Error ${statusCode}: ${message}`);
    console.error(error.stack);
    // Send error response
    res.status(statusCode).json({
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map