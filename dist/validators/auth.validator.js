"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]).{8,}$/;
exports.registerSchema = zod_1.z.object({
    body: zod_1.z.object({
        username: zod_1.z
            .string()
            .min(3, "Username must be at least 3 characters long")
            .max(30, "Username must be at most 30 characters long")
            .regex(/^[a-zA-Z0-9]+$/, "Username must be alphanumeric"),
        email: zod_1.z.string().email("Invalid email address"),
        password: zod_1.z
            .string()
            .min(8, "Password must be at least 8 characters long")
            .regex(passwordRegex, "Password must include uppercase, lowercase, number, and special character"),
    }),
});
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email("Invalid email address"),
        password: zod_1.z.string().min(1, "Password is required"),
    }),
});
//# sourceMappingURL=auth.validator.js.map