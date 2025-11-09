import { env } from "../config/env";
import { productRepository } from "../repositories/product.repository";
import { InMemoryCache } from "../utils/cache";
import { AppError } from "../utils/errors";

const cacheTtlMs = env.CACHE_TTL_SECONDS * 1000;

const productCache = new InMemoryCache<{
  items: Awaited<ReturnType<typeof productRepository.list>>;
  pageNumber: number;
  pageSize: number;
  totalSize: number;
}>(cacheTtlMs);

const PRODUCT_CACHE_PREFIX = "products";

export const productService = {
  create: async (params: {
    name: string;
    description: string;
    price: number;
    stock: number;
    category: string;
    createdById?: string;
  }) => {
    const product = await productRepository.create({
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

  update: async (
    id: string,
    data: Partial<{
      name: string;
      description: string;
      price: number;
      stock: number;
      category: string;
    }>
  ) => {
    const existing = await productRepository.findById(id);
    if (!existing) {
      throw new AppError("Product not found", 404);
    }

    const product = await productRepository.update(id, data);
    productCache.clearByPrefix(PRODUCT_CACHE_PREFIX);
    return product;
  },

  remove: async (id: string) => {
    const existing = await productRepository.findById(id);
    if (!existing) {
      throw new AppError("Product not found", 404);
    }
    await productRepository.delete(id);
    productCache.clearByPrefix(PRODUCT_CACHE_PREFIX);
  },

  findById: async (id: string) => {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new AppError("Product not found", 404);
    }
    return product;
  },

  list: async (params: { page: number; pageSize: number; search?: string }) => {
    const skip = (params.page - 1) * params.pageSize;
    const searchTerm = params.search?.trim();
    const search = searchTerm ? searchTerm : undefined;

    const cacheKey = `${PRODUCT_CACHE_PREFIX}:${params.page}:${params.pageSize}:${
      search ?? ""
    }`;
    const cached = productCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const [items, totalSize] = await Promise.all([
      productRepository.list({
        skip,
        take: params.pageSize,
        search,
      }),
      productRepository.count(search),
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

