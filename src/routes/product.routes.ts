import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  listProducts,
  updateProduct,
} from "../controllers/product.controller";
import { authenticate, authorizeRoles } from "../middlewares/auth";
import { validateRequest } from "../middlewares/validateRequest";
import {
  createProductSchema,
  deleteProductSchema,
  getProductSchema,
  listProductsSchema,
  updateProductSchema,
} from "../validators/product.validator";

const router = Router();

router.get("/", validateRequest(listProductsSchema), listProducts);
router.get("/:id", validateRequest(getProductSchema), getProduct);

router.post(
  "/",
  authenticate,
  authorizeRoles("ADMIN"),
  validateRequest(createProductSchema),
  createProduct
);

router.put(
  "/:id",
  authenticate,
  authorizeRoles("ADMIN"),
  validateRequest(updateProductSchema),
  updateProduct
);

router.delete(
  "/:id",
  authenticate,
  authorizeRoles("ADMIN"),
  validateRequest(deleteProductSchema),
  deleteProduct
);

export default router;

