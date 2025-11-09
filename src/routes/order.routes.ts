import { Router } from "express";
import { createOrder, listOrders } from "../controllers/order.controller";
import { authenticate, authorizeRoles } from "../middlewares/auth";
import { validateRequest } from "../middlewares/validateRequest";
import { createOrderSchema } from "../validators/order.validator";

const router = Router();

router.post(
  "/",
  authenticate,
  authorizeRoles("USER"),
  validateRequest(createOrderSchema),
  createOrder
);

router.get("/", authenticate, listOrders);

export default router;

