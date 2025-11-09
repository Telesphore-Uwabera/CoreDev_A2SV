"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRepository = void 0;
const prisma_1 = require("../config/prisma");
exports.productRepository = {
    create: (data) => prisma_1.prisma.product.create({
        data,
    }),
    update: (id, data) => prisma_1.prisma.product.update({
        where: { id },
        data,
    }),
    delete: (id) => prisma_1.prisma.product.delete({
        where: { id },
    }),
    findById: (id) => prisma_1.prisma.product.findUnique({
        where: { id },
    }),
    list: ({ skip, take, search, }) => prisma_1.prisma.product.findMany({
        skip,
        take,
        orderBy: { createdAt: "desc" },
        where: search
            ? {
                name: {
                    contains: search,
                    mode: "insensitive",
                },
            }
            : undefined,
    }),
    count: (search) => prisma_1.prisma.product.count({
        where: search
            ? {
                name: {
                    contains: search,
                    mode: "insensitive",
                },
            }
            : undefined,
    }),
};
//# sourceMappingURL=product.repository.js.map