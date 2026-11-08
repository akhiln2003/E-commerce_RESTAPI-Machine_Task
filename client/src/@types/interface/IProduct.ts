export type ProductStatus = "active" | "inactive";

export interface IProduct {
  id: string;
  name: string;
  sku: string;
  description: string;
  price: number;
  salePrice: number | null;
  stock: number;
  categoryId: string;
  status: ProductStatus;
  createdAt: string;
  updatedAt: string;
}
