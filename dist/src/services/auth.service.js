"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = require("jsonwebtoken");
const env_1 = require("../config/env");
const user_repository_1 = require("../repositories/user.repository");
const errors_1 = require("../utils/errors");
exports.authService = {
    register: async (params) => {
        const existingByEmail = await user_repository_1.userRepository.findByEmail(params.email);
        if (existingByEmail) {
            throw new errors_1.AppError("Email already registered", 400);
        }
        const existingByUsername = await user_repository_1.userRepository.findByUsername(params.username);
        if (existingByUsername) {
            throw new errors_1.AppError("Username already taken", 400);
        }
        const hashedPassword = await bcryptjs_1.default.hash(params.password, env_1.env.BCRYPT_SALT_ROUNDS);
        const user = await user_repository_1.userRepository.create({
            username: params.username,
            email: params.email,
            password: hashedPassword,
        });
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
        };
    },
    login: async (params) => {
        const user = await user_repository_1.userRepository.findByEmail(params.email);
        if (!user) {
            throw new errors_1.AppError("Invalid credentials", 401);
        }
        const isValid = await bcryptjs_1.default.compare(params.password, user.password);
        if (!isValid) {
            throw new errors_1.AppError("Invalid credentials", 401);
        }
        const token = (0, jsonwebtoken_1.sign)({
            userId: user.id,
            username: user.username,
            role: user.role,
            email: user.email,
        }, env_1.env.JWT_SECRET, { expiresIn: env_1.env.JWT_EXPIRES_IN });
        return {
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
            },
        };
    },
};
//# sourceMappingURL=auth.service.js.map