import request from "supertest";
import { sign } from "jsonwebtoken";
import { Prisma } from "@generated/prisma/client";
import app from "../src/app";
import { productRepository } from "../src/repositories/product.repository";
import { productService } from "../src/services/product.service";

const adminToken = sign(
  {
    userId: "admin-1",
    username: "admin",
    role: "ADMIN",
  },
  process.env.JWT_SECRET || "test-secret"
);

const userToken = sign(
  {
    userId: "user-1",
    username: "user",
    role: "USER",
  },
  process.env.JWT_SECRET || "test-secret"
);

const productId = "123e4567-e89b-12d3-a456-426614174000";

describe("Product routes", () => {
  afterEach(() => {
    productService.clearCache();
    vi.restoreAllMocks();
  });

  test("GET /api/products returns paginated results", async () => {
    vi.spyOn(productRepository, "list").mockResolvedValue([
      {
        id: productId,
        name: "Product 1",
        description: "Description 1",
        price: new Prisma.Decimal(10),
        stock: 5,
        category: "Category",
        createdAt: new Date(),
        updatedAt: new Date(),
        createdById: null,
      },
    ]);

    vi.spyOn(productRepository, "count").mockResolvedValue(1);

    const response = await request(app).get("/api/products").query({ page: 1, pageSize: 10 });

    expect(response.status).toBe(200);
    expect(response.body.Success).toBe(true);
    expect(response.body.products).toHaveLength(1);
    expect(response.body.totalProducts).toBe(1);
  });

  test("GET /api/products/:id returns product details", async () => {
    vi.spyOn(productRepository, "findById").mockResolvedValue({
      id: productId,
      name: "Product 1",
      description: "Description 1",
      price: new Prisma.Decimal(10),
      stock: 5,
      category: "Category",
      createdAt: new Date(),
      updatedAt: new Date(),
      createdById: null,
    } as Awaited<ReturnType<typeof productRepository.findById>>);

    const response = await request(app).get(`/api/products/${productId}`);

    expect(response.status).toBe(200);
    expect(response.body.Object).toMatchObject({ id: productId, name: "Product 1" });
  });

  test("POST /api/products creates product for admin", async () => {
    vi.spyOn(productRepository, "create").mockResolvedValue({
      id: productId,
      name: "Product 1",
      description: "Description 1",
      price: new Prisma.Decimal(20),
      stock: 10,
      category: "Category",
      createdAt: new Date(),
      updatedAt: new Date(),
      createdById: "admin-1",
    } as Awaited<ReturnType<typeof productRepository.create>>);

    const response = await request(app)
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
    const response = await request(app)
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

