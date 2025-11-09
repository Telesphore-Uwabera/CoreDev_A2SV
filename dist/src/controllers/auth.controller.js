"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const auth_service_1 = require("../services/auth.service");
const response_1 = require("../utils/response");
const register = async (req, res, next) => {
    try {
        const user = await auth_service_1.authService.register(req.body);
        return res
            .status(201)
            .json((0, response_1.createResponse)({ message: "User registered successfully", object: user }));
    }
    catch (error) {
        return next(error);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const result = await auth_service_1.authService.login(req.body);
        return res.status(200).json((0, response_1.createResponse)({
            message: "Login successful",
            object: result,
        }));
    }
    catch (error) {
        return next(error);
    }
};
exports.login = login;
//# sourceMappingURL=auth.controller.js.map