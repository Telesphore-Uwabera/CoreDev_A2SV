"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const prisma_1 = require("../config/prisma");
const response_1 = require("../utils/response");
const authenticate = async (req, res, next) => {
    try {
        const header = req.headers.authorization;
        if (!header || !header.startsWith("Bearer ")) {
            return res
                .status(401)
                .json((0, response_1.createResponse)({
                success: false,
                message: "Authentication required",
                errors: ["Missing or invalid Authorization header"],
            }));
        }
        const token = header.split(" ")[1];
        const payload = jsonwebtoken_1.default.verify(token, env_1.env.JWT_SECRET);
        if (env_1.env.NODE_ENV === "test") {
            req.user = {
                id: payload.userId,
                username: payload.username,
                email: payload.email ?? `${payload.userId}@test.local`,
                role: payload.role,
            };
            return next();
        }
        const user = await prisma_1.prisma.user.findUnique({
            where: { id: payload.userId },
            select: { id: true, username: true, email: true, role: true },
        });
        if (!user) {
            return res
                .status(401)
                .json((0, response_1.createResponse)({
                success: false,
                message: "Invalid token",
                errors: ["User no longer exists"],
            }));
        }
        req.user = user;
        return next();
    }
    catch (error) {
        return res
            .status(401)
            .json((0, response_1.createResponse)({
            success: false,
            message: "Authentication failed",
            errors: ["Invalid or expired token"],
        }));
    }
};
exports.authenticate = authenticate;
const authorizeRoles = (...roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        return res
            .status(403)
            .json((0, response_1.createResponse)({
            success: false,
            message: "Forbidden",
            errors: ["You do not have permission to perform this action"],
        }));
    }
    return next();
};
exports.authorizeRoles = authorizeRoles;
//# sourceMappingURL=auth.js.map