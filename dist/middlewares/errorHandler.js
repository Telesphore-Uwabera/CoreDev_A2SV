"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const zod_1 = require("zod");
const env_1 = require("../config/env");
const logger_1 = require("../utils/logger");
const response_1 = require("../utils/response");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const errorHandler = (err, _req, res, _next) => {
    if (err instanceof zod_1.ZodError) {
        const errors = err.issues.map((issue) => issue.message);
        return res
            .status(400)
            .json((0, response_1.createResponse)({ success: false, message: "Validation error", errors }));
    }
    const statusCode = err.status || 500;
    const message = err.message || "Internal Server Error";
    const errors = Array.isArray(err.errors) ? err.errors : undefined;
    if (statusCode >= 500) {
        logger_1.logger.error("Unhandled error", err);
    }
    else {
        logger_1.logger.warn("Handled error", err);
    }
    return res.status(statusCode).json((0, response_1.createResponse)({
        success: false,
        message,
        errors: errors ?? (env_1.env.NODE_ENV === "development" ? [err.stack] : null),
    }));
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map