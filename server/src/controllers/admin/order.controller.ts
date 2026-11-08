import type { RequestHandler } from "express";
import { orderService } from "../../services/order.service.js";
import HttpStatusCode from "../../utils/httpStatusCode.js";

export const ListAllOrdersController: RequestHandler = async (_req, res) => {
  const orders = await orderService.listAllOrders();
  res.status(HttpStatusCode.OK).json({ success: true, orders });
};

export const UpdateOrderStatusController: RequestHandler = async (req, res) => {
  const orderId = Array.isArray(req.params.orderId)
    ? req.params.orderId[0]
    : req.params.orderId;
  const order = await orderService.updateStatus(orderId, req.body.status);
  res.status(HttpStatusCode.OK).json({
    success: true,
    message: "Order status updated successfully",
    order,
  });
};
