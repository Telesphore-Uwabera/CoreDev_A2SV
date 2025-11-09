"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listProductsSchema = exports.deleteProductSchema = exports.getProductSchema = exports.updateProductSchema = exports.createProductSchema = void 0;
const zod_1 = require("zod");
const nameSchema = zod_1.z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(100, "Name must be at most 100 characters long");
const descriptionSchema = zod_1.z
    .string()
    .min(10, "Description must be at least 10 characters long");
const priceSchema = zod_1.z.coerce
    .number()
    .gt(0, "Price must be greater than 0");
const stockSchema = zod_1.z.coerce
    .number()
    .int("Stock must be an integer")
    .min(0, "Stock must be a non-negative integer");
const categorySchema = zod_1.z
    .string()
    .min(1, "Category is required");
exports.createProductSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: nameSchema,
        description: descriptionSchema,
        price: priceSchema,
        stock: stockSchema,
        category: categorySchema,
    }),
});
exports.updateProductSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid("Invalid product id"),
    }),
    body: zod_1.z
        .object({
        name: nameSchema.optional(),
        description: descriptionSchema.optional(),
        price: priceSchema.optional(),
        stock: stockSchema.optional(),
        category: categorySchema.optional(),
    })
        .refine((data) => Object.keys(data).length > 0, {
        message: "At least one field must be provided",
    }),
});
exports.getProductSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid("Invalid product id"),
    }),
});
exports.deleteProductSchema = exports.getProductSchema;
exports.listProductsSchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z
            .string()
            .optional()
            .transform((value) => (value ? Number(value) : 1))
            .pipe(zod_1.z.number().int().positive("Page must be a positive integer")),
        pageSize: zod_1.z
            .string()
            .optional()
            .transform((value) => (value ? Number(value) : 10))
            .pipe(zod_1.z.number().int().positive("Page size must be a positive integer")),
        search: zod_1.z
            .string()
            .optional()
            .transform((value) => (value && value.trim().length > 0 ? value.trim() : undefined)),
    }),
});
//# sourceMappingURL=product.validator.js.map