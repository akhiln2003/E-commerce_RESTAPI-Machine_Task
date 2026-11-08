import { Router } from "express";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { asyncHandler } from "../utils/async-handler.js";
import {
  createOrderDto,
  orderParamsDto,
  orderListQueryDto,
  orderStatusDto,
} from "../dto/order.dto.js";
import {
  CreateOrderController,
  ListOwnOrdersController,
} from "../controllers/order.controller.js";
import {
  ListAllOrdersController,
  UpdateOrderStatusController,
} from "../controllers/admin/order.controller.js";

export const orderRouter = Router();

orderRouter.post(
  "/",
  requireAuth,
  validate(createOrderDto),
  asyncHandler(CreateOrderController),
);
orderRouter.get(
  "/mine",
  requireAuth,
  validate(orderListQueryDto, { target: "query" }),
  asyncHandler(ListOwnOrdersController),
);
orderRouter.get(
  "/admin",
  requireAuth,
  requireAdmin,
  asyncHandler(ListAllOrdersController),
);
orderRouter.patch(
  "/admin/:orderId/status",
  requireAuth,
  requireAdmin,
  validate(orderParamsDto, { target: "params" }),
  validate(orderStatusDto),
  asyncHandler(UpdateOrderStatusController),
);
