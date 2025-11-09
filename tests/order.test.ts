import request from "supertest";
import { sign } from "jsonwebtoken";
import { Prisma } from "@generated/prisma/client";
import app from "../src/app";
import { orderService } from "../src/services/order.service";

const userToken = sign(
  {
    userId: "user-1",
    username: "user",
    role: "USER",
  },
  process.env.JWT_SECRET || "test-secret"
);

const productId = "123e4567-e89b-12d3-a456-426614174000";

describe("Order routes", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("POST /api/orders creates an order", async () => {
    vi.spyOn(orderService, "create").mockResolvedValue({
      id: "order-1",
      userId: "user-1",
      description: "Test order",
      totalPrice: new Prisma.Decimal(30),
      status: "PENDING",
      createdAt: new Date(),
      updatedAt: new Date(),
      items: [
        {
          id: "item-1",
          orderId: "order-1",
          productId,
          quantity: 2,
          unitPrice: new Prisma.Decimal(10),
          product: {
            id: productId,
            name: "Product",
            description: "Desc",
            price: new Prisma.Decimal(10),
            stock: 5,
            category: "Category",
            createdAt: new Date(),
            updatedAt: new Date(),
            createdById: null,
          },
        },
      ],
    } as Awaited<ReturnType<typeof orderService.create>>);

    const response = await request(app)
      .post("/api/orders")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        description: "Test order",
        items: [{ productId, quantity: 2 }],
      });

    expect(response.status).toBe(201);
    expect(response.body.Object).toMatchObject({ id: "order-1", status: "PENDING" });
  });

  test("GET /api/orders returns user orders", async () => {
    vi.spyOn(orderService, "listForUser").mockResolvedValue([
      {
        id: "order-1",
        userId: "user-1",
        description: "Test order",
        totalPrice: new Prisma.Decimal(30),
        status: "PENDING",
        createdAt: new Date(),
        updatedAt: new Date(),
        items: [],
      },
    ] as Awaited<ReturnType<typeof orderService.listForUser>>);

    const response = await request(app)
      .get("/api/orders")
      .set("Authorization", `Bearer ${userToken}`);

    expect(response.status).toBe(200);
    expect(response.body.Object).toHaveLength(1);
  });
});

