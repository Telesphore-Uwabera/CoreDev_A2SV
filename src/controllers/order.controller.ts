import { Request, Response, NextFunction } from "express";
import { orderService } from "../services/order.service";
import { createResponse } from "../utils/response";

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await orderService.create({
      userId: req.user!.id,
      description: req.body.description,
      items: req.body.items,
    });

    return res
      .status(201)
      .json(createResponse({ message: "Order placed successfully", object: order }));
  } catch (error) {
    return next(error);
  }
};

export const listOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await orderService.listForUser(req.user!.id);
    return res.status(200).json(
      createResponse({
        message: "Orders retrieved successfully",
        object: orders,
      })
    );
  } catch (error) {
    return next(error);
  }
};

