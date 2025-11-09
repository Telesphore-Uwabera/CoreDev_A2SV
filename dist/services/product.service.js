"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productService = void 0;
const product_repository_1 = require("../repositories/product.repository");
const errors_1 = require("../utils/errors");
exports.productService = {
    create: async (params) => {
        const product = await product_repository_1.productRepository.create({
            name: params.name,
            description: params.description,
            price: params.price,
            stock: params.stock,
            category: params.category,
            createdBy: params.createdById
                ? {
                    connect: { id: params.createdById },
                }
                : undefined,
        });
        return product;
    },
    update: async (id, data) => {
        const existing = await product_repository_1.productRepository.findById(id);
        if (!existing) {
            throw new errors_1.AppError("Product not found", 404);
        }
        const product = await product_repository_1.productRepository.update(id, data);
        return product;
    },
    remove: async (id) => {
        const existing = await product_repository_1.productRepository.findById(id);
        if (!existing) {
            throw new errors_1.AppError("Product not found", 404);
        }
        await product_repository_1.productRepository.delete(id);
    },
    findById: async (id) => {
        const product = await product_repository_1.productRepository.findById(id);
        if (!product) {
            throw new errors_1.AppError("Product not found", 404);
        }
        return product;
    },
    list: async (params) => {
        const skip = (params.page - 1) * params.pageSize;
        const searchTerm = params.search?.trim();
        const search = searchTerm ? searchTerm : undefined;
        const [items, totalSize] = await Promise.all([
            product_repository_1.productRepository.list({
                skip,
                take: params.pageSize,
                search,
            }),
            product_repository_1.productRepository.count(search),
        ]);
        return {
            items,
            pageNumber: params.page,
            pageSize: params.pageSize,
            totalSize,
        };
    },
};
//# sourceMappingURL=product.service.js.map