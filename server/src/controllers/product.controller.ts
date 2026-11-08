import type { RequestHandler } from "express";
import { productService } from "../services/product.service.js";
import HttpStatusCode from "../utils/httpStatusCode.js";

export const ListProductsController: RequestHandler = async (req, res) => {
  const result = await productService.listProducts({
    categoryId: req.query.categoryId as string | undefined,
    page: Number(req.query.page),
    limit: Number(req.query.limit),
    includeInactive: false,
    search: req.query.search as string | undefined,
    minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
    maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
    sort: req.query.sort as "newest" | "priceAsc" | "priceDesc" | "nameAsc" | "nameDesc",
  });
  res.status(HttpStatusCode.OK).json({ success: true, ...result });
};
