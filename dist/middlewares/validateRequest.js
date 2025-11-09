"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const zod_1 = require("zod");
const response_1 = require("../utils/response");
const validateRequest = (schema) => (req, res, next) => {
    try {
        const result = schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        if (result.body !== undefined) {
            req.body = result.body;
        }
        if (result.query !== undefined) {
            req.query = result.query;
        }
        if (result.params !== undefined) {
            req.params = result.params;
        }
        return next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            const errors = error.issues.map((issue) => issue.message);
            return res
                .status(400)
                .json((0, response_1.createResponse)({ success: false, message: "Validation error", errors }));
        }
        return next(error);
    }
};
exports.validateRequest = validateRequest;
//# sourceMappingURL=validateRequest.js.map