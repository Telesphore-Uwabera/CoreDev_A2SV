import { z } from "zod";

const nameSchema = z
  .string()
  .min(3, "Name must be at least 3 characters long")
  .max(100, "Name must be at most 100 characters long");

const descriptionSchema = z
  .string()
  .min(10, "Description must be at least 10 characters long");

const priceSchema = z.coerce
  .number()
  .gt(0, "Price must be greater than 0");

const stockSchema = z.coerce
  .number()
  .int("Stock must be an integer")
  .min(0, "Stock must be a non-negative integer");

const categorySchema = z
  .string()
  .min(1, "Category is required");

export const createProductSchema = z.object({
  body: z.object({
    name: nameSchema,
    description: descriptionSchema,
    price: priceSchema,
    stock: stockSchema,
    category: categorySchema,
  }),
});

export const updateProductSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid product id"),
  }),
  body: z
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

export const getProductSchema = z.object({
  params: z.object({
    id: z.string().uuid("Invalid product id"),
  }),
});

export const deleteProductSchema = getProductSchema;

export const listProductsSchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .transform((value) => (value ? Number(value) : 1))
      .pipe(z.number().int().positive("Page must be a positive integer")),
    pageSize: z
      .string()
      .optional()
      .transform((value) => (value ? Number(value) : 10))
      .pipe(z.number().int().positive("Page size must be a positive integer")),
    search: z
      .string()
      .optional()
      .transform((value) => (value && value.trim().length > 0 ? value.trim() : undefined)),
  }),
});

