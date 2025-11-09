"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrderSchema = void 0;
const zod_1 = require("zod");
const orderItemSchema = zod_1.z.object({
    productId: zod_1.z.string().uuid("Invalid productId"),
    quantity: zod_1.z.coerce
        .number()
        .int("Quantity must be an integer")
        .min(1, "Quantity must be at least 1"),
});
exports.createOrderSchema = zod_1.z.object({
    body: zod_1.z.object({
        description: zod_1.z.string().optional(),
        items: zod_1.z
            .array(orderItemSchema)
            .min(1, "At least one product must be included in the order"),
    }),
});
//# sourceMappingURL=order.validator.js.map