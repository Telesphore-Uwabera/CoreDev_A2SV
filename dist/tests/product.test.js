"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const jsonwebtoken_1 = require("jsonwebtoken");
const client_1 = require("@generated/prisma/client");
const app_1 = __importDefault(require("../src/app"));
const product_repository_1 = require("../src/repositories/product.repository");
const product_service_1 = require("../src/services/product.service");
const adminToken = (0, jsonwebtoken_1.sign)({
    userId: "admin-1",
    username: "admin",
    role: "ADMIN",
}, process.env.JWT_SECRET || "test-secret");
const userToken = (0, jsonwebtoken_1.sign)({
    userId: "user-1",
    username: "user",
    role: "USER",
}, process.env.JWT_SECRET || "test-secret");
const productId = "123e4567-e89b-12d3-a456-426614174000";
describe("Product routes", () => {
    afterEach(() => {
        product_service_1.productService.clearCache();
        vi.restoreAllMocks();
    });
    test("GET /api/products returns paginated results", async () => {
        vi.spyOn(product_repository_1.productRepository, "list").mockResolvedValue([
            {
                id: productId,
                name: "Product 1",
                description: "Description 1",
                price: new client_1.Prisma.Decimal(10),
                stock: 5,
                category: "Category",
                createdAt: new Date(),
                updatedAt: new Date(),
                createdById: null,
            },
        ]);
        vi.spyOn(product_repository_1.productRepository, "count").mockResolvedValue(1);
        const response = await (0, supertest_1.default)(app_1.default).get("/api/products").query({ page: 1, pageSize: 10 });
        expect(response.status).toBe(200);
        expect(response.body.Success).toBe(true);
        expect(response.body.products).toHaveLength(1);
        expect(response.body.totalProducts).toBe(1);
    });
    test("GET /api/products/:id returns product details", async () => {
        vi.spyOn(product_repository_1.productRepository, "findById").mockResolvedValue({
            id: productId,
            name: "Product 1",
            description: "Description 1",
            price: new client_1.Prisma.Decimal(10),
            stock: 5,
            category: "Category",
            createdAt: new Date(),
            updatedAt: new Date(),
            createdById: null,
        });
        const response = await (0, supertest_1.default)(app_1.default).get(`/api/products/${productId}`);
        // Debugging: ensure response body for failing cases
        if (response.status !== 200) {
            console.error("Product details response:", response.body);
        }
        expect(response.status).toBe(200);
        expect(response.body.Object).toMatchObject({ id: productId, name: "Product 1" });
    });
    test("POST /api/products creates product for admin", async () => {
        vi.spyOn(product_repository_1.productRepository, "create").mockResolvedValue({
            id: productId,
            name: "Product 1",
            description: "Description 1",
            price: new client_1.Prisma.Decimal(20),
            stock: 10,
            category: "Category",
            createdAt: new Date(),
            updatedAt: new Date(),
            createdById: "admin-1",
        });
        const response = await (0, supertest_1.default)(app_1.default)
            .post("/api/products")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
            name: "Product 1",
            description: "Description 1",
            price: 20,
            stock: 10,
            category: "Category",
        });
        expect(response.status).toBe(201);
        expect(response.body.Object).toMatchObject({ id: productId, name: "Product 1" });
    });
    test("POST /api/products returns 403 for non-admin", async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .post("/api/products")
            .set("Authorization", `Bearer ${userToken}`)
            .send({
            name: "Product 1",
            description: "Description 1",
            price: 20,
            stock: 10,
            category: "Category",
        });
        expect(response.status).toBe(403);
    });
});
//# sourceMappingURL=product.test.js.map