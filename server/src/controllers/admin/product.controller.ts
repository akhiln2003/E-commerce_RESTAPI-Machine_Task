import type { RequestHandler } from "express";
import { productService } from "../../services/product.service.js";
import HttpStatusCode from "../../utils/httpStatusCode.js";

export const CreateProductController: RequestHandler = async (req, res) => {
  const product = await productService.createProduct(req.body);
  res.status(HttpStatusCode.Created).json({
    success: true,
    message: "Product created successfully",
    product,
  });
};

export const ListAdminProductsController: RequestHandler = async (req, res) => {
  const result = await productService.listProducts({
    categoryId: req.query.categoryId as string | undefined,
    page: Number(req.query.page),
    limit: Number(req.query.limit),
    includeInactive: true,
    search: req.query.search as string | undefined,
    minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
    maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
    sort: req.query.sort as "newest" | "priceAsc" | "priceDesc" | "nameAsc" | "nameDesc",
  });
  res.status(HttpStatusCode.OK).json({ success: true, ...result });
};

export const UpdateProductController: RequestHandler = async (req, res) => {
  const productId = Array.isArray(req.params.productId)
    ? req.params.productId[0]
    : req.params.productId;
  const product = await productService.updateProduct(
    productId,
    req.body,
  );
  res.status(HttpStatusCode.OK).json({
    success: true,
    message: "Product updated successfully",
    product,
  });
};

export const DeleteProductController: RequestHandler = async (req, res) => {
  const productId = Array.isArray(req.params.productId)
    ? req.params.productId[0]
    : req.params.productId;
  await productService.deleteProduct(productId);
  res.status(HttpStatusCode.OK).json({
    success: true,
    message: "Product deleted successfully",
  });
};
