"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const jsonwebtoken_1 = require("jsonwebtoken");
const client_1 = require("@generated/prisma/client");
const app_1 = __importDefault(require("../src/app"));
const order_service_1 = require("../src/services/order.service");
const userToken = (0, jsonwebtoken_1.sign)({
    userId: "user-1",
    username: "user",
    role: "USER",
}, process.env.JWT_SECRET || "test-secret");
const productId = "123e4567-e89b-12d3-a456-426614174000";
describe("Order routes", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });
    test("POST /api/orders creates an order", async () => {
        vi.spyOn(order_service_1.orderService, "create").mockResolvedValue({
            id: "order-1",
            userId: "user-1",
            description: "Test order",
            totalPrice: new client_1.Prisma.Decimal(30),
            status: "PENDING",
            createdAt: new Date(),
            updatedAt: new Date(),
            items: [
                {
                    id: "item-1",
                    orderId: "order-1",
                    productId,
                    quantity: 2,
                    unitPrice: new client_1.Prisma.Decimal(10),
                    product: {
                        id: productId,
                        name: "Product",
                        description: "Desc",
                        price: new client_1.Prisma.Decimal(10),
                        stock: 5,
                        category: "Category",
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        createdById: null,
                    },
                },
            ],
        });
        const response = await (0, supertest_1.default)(app_1.default)
            .post("/api/orders")
            .set("Authorization", `Bearer ${userToken}`)
            .send({
            description: "Test order",
            items: [{ productId, quantity: 2 }],
        });
        if (response.status !== 201) {
            console.error("Order create response:", response.body);
        }
        expect(response.status).toBe(201);
        expect(response.body.Object).toMatchObject({ id: "order-1", status: "PENDING" });
    });
    test("GET /api/orders returns user orders", async () => {
        vi.spyOn(order_service_1.orderService, "listForUser").mockResolvedValue([
            {
                id: "order-1",
                userId: "user-1",
                description: "Test order",
                totalPrice: new client_1.Prisma.Decimal(30),
                status: "PENDING",
                createdAt: new Date(),
                updatedAt: new Date(),
                items: [],
            },
        ]);
        const response = await (0, supertest_1.default)(app_1.default)
            .get("/api/orders")
            .set("Authorization", `Bearer ${userToken}`);
        expect(response.status).toBe(200);
        expect(response.body.Object).toHaveLength(1);
    });
});
//# sourceMappingURL=order.test.js.map