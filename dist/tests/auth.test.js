"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const app_1 = __importDefault(require("../src/app"));
const user_repository_1 = require("../src/repositories/user.repository");
describe("Auth routes", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });
    test("POST /api/auth/register succeeds with valid payload", async () => {
        vi.spyOn(user_repository_1.userRepository, "findByEmail").mockResolvedValue(null);
        vi.spyOn(user_repository_1.userRepository, "findByUsername").mockResolvedValue(null);
        vi.spyOn(user_repository_1.userRepository, "create").mockResolvedValue({
            id: "user-123",
            username: "testuser",
            email: "test@example.com",
            password: "hashed-password",
            role: "USER",
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        const response = await (0, supertest_1.default)(app_1.default).post("/api/auth/register").send({
            username: "testuser",
            email: "test@example.com",
            password: "Password1!",
        });
        expect(response.status).toBe(201);
        expect(response.body.Success).toBe(true);
        expect(response.body.Object).toMatchObject({
            id: "user-123",
            username: "testuser",
            email: "test@example.com",
            role: "USER",
        });
        expect(response.body.Object).not.toHaveProperty("password");
    });
    test("POST /api/auth/register fails with invalid payload", async () => {
        const response = await (0, supertest_1.default)(app_1.default).post("/api/auth/register").send({
            username: "ab",
            email: "not-an-email",
            password: "weak",
        });
        expect(response.status).toBe(400);
        expect(response.body.Success).toBe(false);
    });
    test("POST /api/auth/login succeeds with valid credentials", async () => {
        const hashedPassword = await bcryptjs_1.default.hash("Password1!", 4);
        vi.spyOn(user_repository_1.userRepository, "findByEmail").mockResolvedValue({
            id: "user-123",
            username: "testuser",
            email: "test@example.com",
            password: hashedPassword,
            role: "USER",
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        const response = await (0, supertest_1.default)(app_1.default).post("/api/auth/login").send({
            email: "test@example.com",
            password: "Password1!",
        });
        expect(response.status).toBe(200);
        expect(response.body.Success).toBe(true);
        expect(response.body.Object.token).toBeDefined();
        expect(response.body.Object.user).toMatchObject({
            id: "user-123",
            username: "testuser",
            email: "test@example.com",
            role: "USER",
        });
    });
    test("POST /api/auth/login returns 401 for invalid credentials", async () => {
        vi.spyOn(user_repository_1.userRepository, "findByEmail").mockResolvedValue(null);
        const response = await (0, supertest_1.default)(app_1.default).post("/api/auth/login").send({
            email: "missing@example.com",
            password: "Password1!",
        });
        expect(response.status).toBe(401);
        expect(response.body.Success).toBe(false);
    });
});
//# sourceMappingURL=auth.test.js.map