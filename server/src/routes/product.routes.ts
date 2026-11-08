import { Router } from "express";
import { validate } from "../middleware/validate.js";
import { asyncHandler } from "../utils/async-handler.js";
import {
  productInputDto,
  productListQueryDto,
  productParamsDto,
} from "../dto/product.dto.js";
import {
  CreateProductController,
  DeleteProductController,
  ListAdminProductsController,
  UpdateProductController,
} from "../controllers/admin/product.controller.js";
import { requireAdmin, requireAuth } from "../middleware/auth.js";

export const adminProductRouter = Router();

adminProductRouter.use(requireAuth, requireAdmin);
adminProductRouter.post(
  "/",
  validate(productInputDto),
  asyncHandler(CreateProductController),
);
adminProductRouter.get(
  "/",
  validate(productListQueryDto, { target: "query" }),
  asyncHandler(ListAdminProductsController),
);
adminProductRouter.patch(
  "/:productId",
  validate(productParamsDto, { target: "params" }),
  validate(productInputDto),
  asyncHandler(UpdateProductController),
);
adminProductRouter.delete(
  "/:productId",
  validate(productParamsDto, { target: "params" }),
  asyncHandler(DeleteProductController),
);
