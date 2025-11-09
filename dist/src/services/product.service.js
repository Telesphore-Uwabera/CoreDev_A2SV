"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productService = void 0;
const env_1 = require("../config/env");
const product_repository_1 = require("../repositories/product.repository");
const cache_1 = require("../utils/cache");
const errors_1 = require("../utils/errors");
const cacheTtlMs = env_1.env.CACHE_TTL_SECONDS * 1000;
const productCache = new cache_1.InMemoryCache(cacheTtlMs);
const PRODUCT_CACHE_PREFIX = "products";
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
        productCache.clearByPrefix(PRODUCT_CACHE_PREFIX);
        return product;
    },
    update: async (id, data) => {
        const existing = await product_repository_1.productRepository.findById(id);
        if (!existing) {
            throw new errors_1.AppError("Product not found", 404);
        }
        const product = await product_repository_1.productRepository.update(id, data);
        productCache.clearByPrefix(PRODUCT_CACHE_PREFIX);
        return product;
    },
    remove: async (id) => {
        const existing = await product_repository_1.productRepository.findById(id);
        if (!existing) {
            throw new errors_1.AppError("Product not found", 404);
        }
        await product_repository_1.productRepository.delete(id);
        productCache.clearByPrefix(PRODUCT_CACHE_PREFIX);
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
        const cacheKey = `${PRODUCT_CACHE_PREFIX}:${params.page}:${params.pageSize}:${search ?? ""}`;
        const cached = productCache.get(cacheKey);
        if (cached) {
            return cached;
        }
        const [items, totalSize] = await Promise.all([
            product_repository_1.productRepository.list({
                skip,
                take: params.pageSize,
                search,
            }),
            product_repository_1.productRepository.count(search),
        ]);
        const result = {
            items,
            pageNumber: params.page,
            pageSize: params.pageSize,
            totalSize,
        };
        productCache.set(cacheKey, result);
        return result;
    },
    clearCache: () => {
        productCache.clearByPrefix(PRODUCT_CACHE_PREFIX);
    },
};
//# sourceMappingURL=product.service.js.map