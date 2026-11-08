import type { RequestHandler } from "express";
import { orderService } from "../services/order.service.js";
import HttpStatusCode from "../utils/httpStatusCode.js";
import { AppError } from "../utils/AppError.js";

const authenticatedUserId = (req: Parameters<RequestHandler>[0]) => {
  if (!req.userId) {
    throw new AppError(HttpStatusCode.Unauthorized, "Authentication required");
  }
  return req.userId;
};

export const CreateOrderController: RequestHandler = async (req, res) => {
  const order = await orderService.createOrder(
    authenticatedUserId(req),
    req.body,
  );
  res.status(HttpStatusCode.Created).json({
    success: true,
    message: "Order placed successfully",
    order,
  });
};

export const ListOwnOrdersController: RequestHandler = async (req, res) => {
  const result = await orderService.listOwnOrders(
    authenticatedUserId(req),
    Number(req.query.page),
    Number(req.query.limit),
  );
  res.status(HttpStatusCode.OK).json({ success: true, ...result });
};
