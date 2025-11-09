import { Prisma } from "@generated/prisma/client";
import { prisma } from "../config/prisma";
import { orderRepository } from "../repositories/order.repository";
import { AppError } from "../utils/errors";

export const orderService = {
  create: async (params: {
    userId: string;
    description?: string;
    items: Array<{ productId: string; quantity: number }>;
  }) => {
    if (!params.items.length) {
      throw new AppError("At least one product must be included in the order", 400);
    }

    return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const productIds = params.items.map((item) => item.productId);

      const products = await tx.product.findMany({
        where: { id: { in: productIds } },
      });

      if (products.length !== productIds.length) {
        const existingIds = new Set(products.map((product) => product.id));
        const missing = productIds.filter((id) => !existingIds.has(id));
        throw new AppError(`Product not found: ${missing.join(", ")}`, 404);
      }

      type Product = (typeof products)[number];

      const productMap = new Map<string, Product>(
        products.map((product) => [product.id, product] as const)
      );
      let totalPrice = new Prisma.Decimal(0);

      for (const item of params.items) {
        const product = productMap.get(item.productId);
        if (!product) {
          throw new AppError(`Product not found: ${item.productId}`, 404);
        }

        if (product.stock < item.quantity) {
          throw new AppError(
            `Insufficient stock for product ${product.name}`,
            400,
            [`Available stock: ${product.stock}`]
          );
        }

        totalPrice = totalPrice.add(product.price.mul(item.quantity));
      }

      for (const item of params.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      const order = await orderRepository.create(
        {
          description: params.description,
          totalPrice,
          status: "PENDING",
          user: {
            connect: { id: params.userId },
          },
          items: {
            create: params.items.map((item) => {
              const product = productMap.get(item.productId)!;
              return {
                quantity: item.quantity,
                unitPrice: product.price,
                product: {
                  connect: { id: product.id },
                },
              };
            }),
          },
        },
        tx
      );

      return order;
    });
  },

  listForUser: (userId: string) => orderRepository.listByUser(userId),
};

