import { Router } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "CoreDev E-commerce API",
    version: "1.0.0",
    description:
      "REST API documentation for the CoreDev Interviews 2025 backend assessment. All endpoints return the standard response envelope described in the brief.",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Local development",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      BaseResponse: {
        type: "object",
        properties: {
          Success: { type: "boolean" },
          Message: { type: "string" },
          Object: {},
          Errors: {
            type: "array",
            items: { type: "string" },
            nullable: true,
          },
        },
      },
      PaginatedResponse: {
        allOf: [
          { $ref: "#/components/schemas/BaseResponse" },
          {
            type: "object",
            properties: {
              PageNumber: { type: "integer" },
              PageSize: { type: "integer" },
              TotalSize: { type: "integer" },
              products: {
                type: "array",
                items: { $ref: "#/components/schemas/Product" },
              },
              totalProducts: { type: "integer" },
              totalPages: { type: "integer" },
            },
          },
        ],
      },
      Product: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string" },
          description: { type: "string" },
          price: { type: "number" },
          stock: { type: "integer" },
          category: { type: "string" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      OrderItemInput: {
        type: "object",
        required: ["productId", "quantity"],
        properties: {
          productId: { type: "string", format: "uuid" },
          quantity: { type: "integer", minimum: 1 },
        },
      },
      Order: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          description: { type: "string", nullable: true },
          totalPrice: { type: "number" },
          status: { type: "string" },
          items: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string", format: "uuid" },
                quantity: { type: "integer" },
                unitPrice: { type: "number" },
                product: { $ref: "#/components/schemas/Product" },
              },
            },
          },
        },
      },
    },
  },
  paths: {
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["username", "email", "password"],
                properties: {
                  username: { type: "string" },
                  email: { type: "string", format: "email" },
                  password: { type: "string", minLength: 8 },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "User created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/BaseResponse" },
              },
            },
          },
          400: { description: "Validation error" },
        },
      },
    },
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Authenticate a user and issue JWT",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email" },
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Login successful" },
          401: { description: "Invalid credentials" },
        },
      },
    },
    "/api/products": {
      get: {
        tags: ["Products"],
        summary: "List products with pagination and optional name search",
        parameters: [
          {
            name: "page",
            in: "query",
            schema: { type: "integer", default: 1 },
          },
          {
            name: "pageSize",
            in: "query",
            schema: { type: "integer", default: 10 },
          },
          {
            name: "search",
            in: "query",
            schema: { type: "string" },
          },
        ],
        responses: {
          200: {
            description: "Paginated product list",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/PaginatedResponse" },
              },
            },
          },
        },
      },
      post: {
        tags: ["Products"],
        summary: "Create a product (admin only)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "description", "price", "stock", "category"],
                properties: {
                  name: { type: "string" },
                  description: { type: "string" },
                  price: { type: "number", minimum: 0 },
                  stock: { type: "integer", minimum: 0 },
                  category: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Product created" },
          403: { description: "Forbidden" },
        },
      },
    },
    "/api/products/{id}": {
      get: {
        tags: ["Products"],
        summary: "Get product details",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          200: {
            description: "Product details",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/BaseResponse" },
              },
            },
          },
          404: { description: "Product not found" },
        },
      },
      put: {
        tags: ["Products"],
        summary: "Update a product (admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  description: { type: "string" },
                  price: { type: "number", minimum: 0 },
                  stock: { type: "integer", minimum: 0 },
                  category: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Product updated" },
          404: { description: "Product not found" },
        },
      },
      delete: {
        tags: ["Products"],
        summary: "Delete a product (admin only)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string", format: "uuid" },
          },
        ],
        responses: {
          200: { description: "Product deleted" },
          404: { description: "Product not found" },
        },
      },
    },
    "/api/orders": {
      post: {
        tags: ["Orders"],
        summary: "Place a new order",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["items"],
                properties: {
                  description: { type: "string" },
                  items: {
                    type: "array",
                    items: { $ref: "#/components/schemas/OrderItemInput" },
                  },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Order created" },
          400: { description: "Insufficient stock" },
        },
      },
      get: {
        tags: ["Orders"],
        summary: "Get current user's orders",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "User orders",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/BaseResponse" },
              },
            },
          },
        },
      },
    },
  },
};

const swaggerOptions = {
  definition: swaggerDefinition,
  apis: [],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export const swaggerRouter = Router();

swaggerRouter.use("/", swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));

export { swaggerSpec };
