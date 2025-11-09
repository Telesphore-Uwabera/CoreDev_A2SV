"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderService = void 0;
const client_1 = require("@generated/prisma/client");
const prisma_1 = require("../config/prisma");
const order_repository_1 = require("../repositories/order.repository");
const errors_1 = require("../utils/errors");
exports.orderService = {
    create: async (params) => {
        if (!params.items.length) {
            throw new errors_1.AppError("At least one product must be included in the order", 400);
        }
        return prisma_1.prisma.$transaction(async (tx) => {
            const productIds = params.items.map((item) => item.productId);
            const products = await tx.product.findMany({
                where: { id: { in: productIds } },
            });
            if (products.length !== productIds.length) {
                const existingIds = new Set(products.map((product) => product.id));
                const missing = productIds.filter((id) => !existingIds.has(id));
                throw new errors_1.AppError(`Product not found: ${missing.join(", ")}`, 404);
            }
            const productMap = new Map(products.map((product) => [product.id, product]));
            let totalPrice = new client_1.Prisma.Decimal(0);
            for (const item of params.items) {
                const product = productMap.get(item.productId);
                if (!product) {
                    throw new errors_1.AppError(`Product not found: ${item.productId}`, 404);
                }
                if (product.stock < item.quantity) {
                    throw new errors_1.AppError(`Insufficient stock for product ${product.name}`, 400, [`Available stock: ${product.stock}`]);
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
            const order = await order_repository_1.orderRepository.create({
                description: params.description,
                totalPrice,
                status: "PENDING",
                user: {
                    connect: { id: params.userId },
                },
                items: {
                    create: params.items.map((item) => {
                        const product = productMap.get(item.productId);
                        return {
                            quantity: item.quantity,
                            unitPrice: product.price,
                            product: {
                                connect: { id: product.id },
                            },
                        };
                    }),
                },
            }, tx);
            return order;
        });
    },
    listForUser: (userId) => order_repository_1.orderRepository.listByUser(userId),
};
//# sourceMappingURL=order.service.js.map