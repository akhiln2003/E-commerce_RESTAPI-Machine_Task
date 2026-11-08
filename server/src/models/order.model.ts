import mongoose, { Schema } from "mongoose";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

interface OrderItem {
  productId: mongoose.Types.ObjectId;
  name: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

interface OrderAttrs {
  userId: mongoose.Types.ObjectId;
  items: OrderItem[];
  subtotal: number;
  total: number;
  status: OrderStatus;
}

interface OrderDoc extends OrderAttrs {
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<OrderItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    sku: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 },
    lineTotal: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const orderSchema = new Schema<OrderDoc>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    items: { type: [orderItemSchema], required: true, minlength: 1 },
    subtotal: { type: Number, required: true, min: 0 },
    total: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
      required: true,
    },
  },
  { timestamps: true },
);

orderSchema.set("toJSON", {
  transform(_doc, ret) {
    const result = ret as unknown as Record<string, unknown>;
    result.id = String(result._id);
    result.userId = String(result.userId);
    delete result._id;
    delete result.__v;
    return result;
  },
});

export const OrderModel = mongoose.model<OrderDoc>("Order", orderSchema);
