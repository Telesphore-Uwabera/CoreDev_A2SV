"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listOrders = exports.createOrder = void 0;
const order_service_1 = require("../services/order.service");
const response_1 = require("../utils/response");
const createOrder = async (req, res, next) => {
    try {
        const order = await order_service_1.orderService.create({
            userId: req.user.id,
            description: req.body.description,
            items: req.body.items,
        });
        return res
            .status(201)
            .json((0, response_1.createResponse)({ message: "Order placed successfully", object: order }));
    }
    catch (error) {
        return next(error);
    }
};
exports.createOrder = createOrder;
const listOrders = async (req, res, next) => {
    try {
        const orders = await order_service_1.orderService.listForUser(req.user.id);
        return res.status(200).json((0, response_1.createResponse)({
            message: "Orders retrieved successfully",
            object: orders,
        }));
    }
    catch (error) {
        return next(error);
    }
};
exports.listOrders = listOrders;
//# sourceMappingURL=order.controller.js.map