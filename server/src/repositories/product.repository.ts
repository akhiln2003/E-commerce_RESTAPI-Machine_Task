import mongoose from "mongoose";
import { ProductModel, ProductStatus } from "../models/product.model.js";

interface ProductData {
  name: string;
  sku: string;
  description: string;
  price: number;
  salePrice: number | null;
  stock: number;
  categoryId: mongoose.Types.ObjectId;
  status: ProductStatus;
}

export type ProductSort =
  | "newest"
  | "priceAsc"
  | "priceDesc"
  | "nameAsc"
  | "nameDesc";

const create = async (data: ProductData) => ProductModel.create(data);

const findAll = async (filters: {
  categoryIds?: string[];
  status?: ProductStatus;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sort: ProductSort;
  page: number;
  limit: number;
}) => {
  const query: {
    categoryId?: { $in: string[] };
    status?: ProductStatus;
    name?: { $regex: string; $options: string };
    $or?: Array<
      | { name: { $regex: string; $options: string } }
      | { description: { $regex: string; $options: string } }
      | { sku: { $regex: string; $options: string } }
    >;
    $expr?: {
      $and: Array<Record<string, unknown>>;
    };
  } = {};

  if (filters.categoryIds) {
    query.categoryId = { $in: filters.categoryIds };
  }
  if (filters.status) {
    query.status = filters.status;
  }
  if (filters.search) {
    const search = filters.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { sku: { $regex: search, $options: "i" } },
    ];
  }
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    query.$expr = {
      $and: [
        ...(filters.minPrice === undefined
          ? []
          : [{ $gte: [{ $ifNull: ["$salePrice", "$price"] }, filters.minPrice] }]),
        ...(filters.maxPrice === undefined
          ? []
          : [{ $lte: [{ $ifNull: ["$salePrice", "$price"] }, filters.maxPrice] }]),
      ],
    };
  }

  const skip = (filters.page - 1) * filters.limit;
  const sortOptions: Record<string, Record<string, 1 | -1>> = {
    newest: { createdAt: -1 },
    priceAsc: { salePrice: 1, price: 1 },
    priceDesc: { salePrice: -1, price: -1 },
    nameAsc: { name: 1 },
    nameDesc: { name: -1 },
  };
  const sort = sortOptions[filters.sort];
  const [products, total] = await Promise.all([
    ProductModel.find(query)
      .sort(sort)
      .skip(skip)
      .limit(filters.limit)
      .exec(),
    ProductModel.countDocuments(query).exec(),
  ]);

  return { products, total };
};

const findById = async (productId: string) => ProductModel.findById(productId).exec();
const findBySku = async (sku: string) => ProductModel.findOne({ sku }).exec();

const update = async (productId: string, data: Partial<ProductData>) =>
  ProductModel.findByIdAndUpdate(
    productId,
    { $set: data },
    { new: true, runValidators: true },
  ).exec();

const deleteById = async (productId: string) =>
  ProductModel.findByIdAndDelete(productId).exec();

const findForOrder = async (
  productId: string,
  session: mongoose.ClientSession,
) => ProductModel.findOne({ _id: productId, status: "active" }).session(session).exec();

const decrementStock = async (
  productId: string,
  quantity: number,
  session: mongoose.ClientSession,
) =>
  ProductModel.findOneAndUpdate(
    { _id: productId, status: "active", stock: { $gte: quantity } },
    { $inc: { stock: -quantity } },
    { new: true, session },
  ).exec();

export const productRepository = {
  create,
  findAll,
  findById,
  findBySku,
  update,
  deleteById,
  findForOrder,
  decrementStock,
};
