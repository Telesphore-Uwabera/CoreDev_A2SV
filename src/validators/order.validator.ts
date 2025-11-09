import { z } from "zod";

const orderItemSchema = z.object({
  productId: z.string().uuid("Invalid productId"),
  quantity: z.coerce
    .number()
    .int("Quantity must be an integer")
    .min(1, "Quantity must be at least 1"),
});

export const createOrderSchema = z.object({
  body: z.object({
    description: z.string().optional(),
    items: z
      .array(orderItemSchema)
      .min(1, "At least one product must be included in the order"),
  }),
});

