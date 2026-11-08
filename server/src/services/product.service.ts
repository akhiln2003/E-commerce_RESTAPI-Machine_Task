import mongoose from "mongoose";
import { categoryRepository } from "../repositories/category.repository.js";
import {
  productRepository,
  type ProductSort,
} from "../repositories/product.repository.js";
import { AppError } from "../utils/AppError.js";
import HttpStatusCode from "../utils/httpStatusCode.js";
import type { ProductStatus } from "../models/product.model.js";

interface ProductInput {
  name: string;
  sku: string;
  description: string;
  price: number;
  salePrice: number | null;
  stock: number;
  categoryId: string;
  status: ProductStatus;
}

const normalizeProduct = (input: ProductInput) => ({
  ...input,
  name: input.name.trim(),
  sku: input.sku.trim().toUpperCase(),
  description: input.description.trim(),
  categoryId: new mongoose.Types.ObjectId(input.categoryId),
});

const ensureCategory = async (categoryId: string) => {
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new AppError(HttpStatusCode.BadRequest, "Invalid category id");
  }
  if (!(await categoryRepository.findById(categoryId))) {
    throw new AppError(HttpStatusCode.NotFound, "Category not found");
  }
};

const ensureSkuAvailable = async (sku: string, excludeId?: string) => {
  const existing = await productRepository.findBySku(sku);
  if (existing && existing.id !== excludeId) {
    throw new AppError(HttpStatusCode.Conflict, "SKU is already in use");
  }
};

const createProduct = async (input: ProductInput) => {
  const data = normalizeProduct(input);
  await ensureCategory(input.categoryId);
  await ensureSkuAvailable(data.sku);
  return productRepository.create(data);
};

const updateProduct = async (productId: string, input: ProductInput) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new AppError(HttpStatusCode.BadRequest, "Invalid product id");
  }
  if (!(await productRepository.findById(productId))) {
    throw new AppError(HttpStatusCode.NotFound, "Product not found");
  }

  const data = normalizeProduct(input);
  await ensureCategory(input.categoryId);
  await ensureSkuAvailable(data.sku, productId);
  return productRepository.update(productId, data);
};

const deleteProduct = async (productId: string) => {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new AppError(HttpStatusCode.BadRequest, "Invalid product id");
  }
  if (!(await productRepository.deleteById(productId))) {
    throw new AppError(HttpStatusCode.NotFound, "Product not found");
  }
};

const getDescendantCategoryIds = async (categoryId: string) => {
  if (!(await categoryRepository.findById(categoryId))) {
    throw new AppError(HttpStatusCode.NotFound, "Category not found");
  }

  const categories = await categoryRepository.findAll();
  const included = new Set([categoryId]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const category of categories) {
      const parentId = category.parentId?.toString();
      if (parentId && included.has(parentId) && !included.has(category.id)) {
        included.add(category.id);
        changed = true;
      }
    }
  }
  return [...included];
};

const listProducts = async (filters: {
  categoryId?: string;
  page: number;
  limit: number;
  includeInactive: boolean;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sort: ProductSort;
}) => {
  const categoryIds = filters.categoryId
    ? await getDescendantCategoryIds(filters.categoryId)
    : undefined;
  const { products, total } = await productRepository.findAll({
    categoryIds,
    status: filters.includeInactive ? undefined : "active",
    search: filters.search,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    sort: filters.sort,
    page: filters.page,
    limit: filters.limit,
  });

  return {
    products,
    pagination: {
      page: filters.page,
      limit: filters.limit,
      total,
      totalPages: Math.ceil(total / filters.limit),
    },
  };
};

export const productService = {
  createProduct,
  updateProduct,
  deleteProduct,
  listProducts,
};
