import mongoose from "mongoose";
import { orderRepository } from "../repositories/order.repository.js";
import { productRepository } from "../repositories/product.repository.js";
import { AppError } from "../utils/AppError.js";
import HttpStatusCode from "../utils/httpStatusCode.js";
import type { OrderStatus } from "../models/order.model.js";

interface OrderInput {
  items: { productId: string; quantity: number }[];
}

const createOrder = async (userId: string, input: OrderInput) => {
  const session = await mongoose.startSession();
  try {
    let order;
    await session.withTransaction(async () => {
      const quantities = new Map<string, number>();
      for (const item of input.items) {
        quantities.set(
          item.productId,
          (quantities.get(item.productId) ?? 0) + item.quantity,
        );
      }

      const orderItems = [];
      for (const [productId, quantity] of quantities) {
        const product = await productRepository.findForOrder(productId, session);
        if (!product) {
          throw new AppError(
            HttpStatusCode.NotFound,
            "One or more products are unavailable",
          );
        }
        if (product.stock < quantity) {
          throw new AppError(
            HttpStatusCode.Conflict,
            `Insufficient stock for ${product.name}`,
          );
        }

        const unitPrice = product.salePrice ?? product.price;
        const updatedProduct = await productRepository.decrementStock(
          productId,
          quantity,
          session,
        );
        if (!updatedProduct) {
          throw new AppError(HttpStatusCode.Conflict, "Stock changed; please retry");
        }

        orderItems.push({
          productId: updatedProduct._id,
          name: updatedProduct.name,
          sku: updatedProduct.sku,
          quantity,
          unitPrice,
          lineTotal: unitPrice * quantity,
        });
      }

      const subtotal = orderItems.reduce((sum, item) => sum + item.lineTotal, 0);
      order = await orderRepository.create(
        {
          userId: new mongoose.Types.ObjectId(userId),
          items: orderItems,
          subtotal,
          total: subtotal,
        },
        session,
      );
    });
    return order;
  } finally {
    await session.endSession();
  }
};

const listOwnOrders = async (userId: string, page: number, limit: number) => {
  const { orders, total } = await orderRepository.findByUser(userId, page, limit);

  return {
    orders,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};
const listAllOrders = async () => orderRepository.findAll();

const updateStatus = async (orderId: string, status: OrderStatus) => {
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new AppError(HttpStatusCode.BadRequest, "Invalid order id");
  }
  const order = await orderRepository.findById(orderId);
  if (!order) throw new AppError(HttpStatusCode.NotFound, "Order not found");
  if (order.status === "cancelled" || order.status === "delivered") {
    throw new AppError(HttpStatusCode.Conflict, "This order status cannot be changed");
  }
  const transitions: Record<OrderStatus, OrderStatus[]> = {
    pending: ["confirmed", "cancelled"],
    confirmed: ["processing", "cancelled"],
    processing: ["shipped", "cancelled"],
    shipped: ["delivered"],
    delivered: [],
    cancelled: [],
  };
  if (!transitions[order.status].includes(status)) {
    throw new AppError(
      HttpStatusCode.Conflict,
      `Order cannot move from ${order.status} to ${status}`,
    );
  }
  return orderRepository.updateStatus(orderId, status);
};

export const orderService = {
  createOrder,
  listOwnOrders,
  listAllOrders,
  updateStatus,
};
