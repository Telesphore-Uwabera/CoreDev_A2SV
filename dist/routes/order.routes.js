"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = require("../controllers/order.controller");
const auth_1 = require("../middlewares/auth");
const validateRequest_1 = require("../middlewares/validateRequest");
const order_validator_1 = require("../validators/order.validator");
const router = (0, express_1.Router)();
router.post("/", auth_1.authenticate, (0, auth_1.authorizeRoles)("USER"), (0, validateRequest_1.validateRequest)(order_validator_1.createOrderSchema), order_controller_1.createOrder);
router.get("/", auth_1.authenticate, order_controller_1.listOrders);
exports.default = router;
//# sourceMappingURL=order.routes.js.map