"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRepository = void 0;
const prisma_1 = require("../config/prisma");
const getClient = (tx) => tx ?? prisma_1.prisma;
exports.orderRepository = {
    create: (data, tx) => getClient(tx).order.create({
        data,
        include: {
            items: {
                include: {
                    product: true,
                },
            },
        },
    }),
    findById: (id, tx) => getClient(tx).order.findUnique({
        where: { id },
        include: {
            items: {
                include: {
                    product: true,
                },
            },
        },
    }),
    listByUser: (userId) => prisma_1.prisma.order.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        include: {
            items: {
                include: {
                    product: true,
                },
            },
        },
    }),
};
//# sourceMappingURL=order.repository.js.map