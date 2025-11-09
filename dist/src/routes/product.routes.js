"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("../controllers/product.controller");
const auth_1 = require("../middlewares/auth");
const validateRequest_1 = require("../middlewares/validateRequest");
const product_validator_1 = require("../validators/product.validator");
const router = (0, express_1.Router)();
router.get("/", (0, validateRequest_1.validateRequest)(product_validator_1.listProductsSchema), product_controller_1.listProducts);
router.get("/:id", (0, validateRequest_1.validateRequest)(product_validator_1.getProductSchema), product_controller_1.getProduct);
router.post("/", auth_1.authenticate, (0, auth_1.authorizeRoles)("ADMIN"), (0, validateRequest_1.validateRequest)(product_validator_1.createProductSchema), product_controller_1.createProduct);
router.put("/:id", auth_1.authenticate, (0, auth_1.authorizeRoles)("ADMIN"), (0, validateRequest_1.validateRequest)(product_validator_1.updateProductSchema), product_controller_1.updateProduct);
router.delete("/:id", auth_1.authenticate, (0, auth_1.authorizeRoles)("ADMIN"), (0, validateRequest_1.validateRequest)(product_validator_1.deleteProductSchema), product_controller_1.deleteProduct);
exports.default = router;
//# sourceMappingURL=product.routes.js.map