import type { ProductStatus } from "./IProduct";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface IOrderItem {
  productId: string;
  name: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface IOrder {
  id: string;
  userId: string;
  items: IOrderItem[];
  subtotal: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ICartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  stock: number;
  status?: ProductStatus;
}
