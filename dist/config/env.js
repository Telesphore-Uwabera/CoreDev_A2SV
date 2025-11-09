"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = require("dotenv");
const zod_1 = require("zod");
(0, dotenv_1.config)();
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z
        .enum(["development", "test", "production"])
        .default("development"),
    PORT: zod_1.z.coerce.number().int().positive().default(3000),
    DATABASE_URL: zod_1.z.string().min(1, { message: "DATABASE_URL is required" }),
    JWT_SECRET: zod_1.z.string().min(1, { message: "JWT_SECRET is required" }),
    JWT_EXPIRES_IN: zod_1.z.string().default("1h"),
    BCRYPT_SALT_ROUNDS: zod_1.z.coerce.number().int().positive().default(10),
    CACHE_TTL_SECONDS: zod_1.z.coerce.number().int().positive().default(60),
});
const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
    console.error("❌ Invalid environment configuration:", parsed.error.flatten().fieldErrors);
    throw new Error("Invalid environment configuration");
}
exports.env = parsed.data;
//# sourceMappingURL=env.js.map