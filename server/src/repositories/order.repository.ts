import mongoose from "mongoose";
import { OrderModel, OrderStatus } from "../models/order.model.js";

interface OrderItemData {
  productId: mongoose.Types.ObjectId;
  name: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

const create = async (
  data: {
    userId: mongoose.Types.ObjectId;
    items: OrderItemData[];
    subtotal: number;
    total: number;
  },
  session: mongoose.ClientSession,
) => OrderModel.create([{ ...data, status: "pending" }], { session }).then(([order]) => order);

const findByUser = async (userId: string, page: number, limit: number) => {
  const filter = { userId };
  const [orders, total] = await Promise.all([
    OrderModel.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec(),
    OrderModel.countDocuments(filter).exec(),
  ]);

  return { orders, total };
};

const findAll = async () => OrderModel.find().sort({ createdAt: -1 }).exec();

const findById = async (orderId: string) => OrderModel.findById(orderId).exec();

const updateStatus = async (orderId: string, status: OrderStatus) =>
  OrderModel.findByIdAndUpdate(
    orderId,
    { $set: { status } },
    { new: true, runValidators: true },
  ).exec();

export const orderRepository = {
  create,
  findByUser,
  findAll,
  findById,
  updateStatus,
};
