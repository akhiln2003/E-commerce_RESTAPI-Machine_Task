import { Router } from "express";
import { requireAdmin, requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/async-handler.js";
import { validate } from "../middleware/validate.js";
import { categoryInputDto, categoryParamsDto } from "../dto/category.dto.js";
import {
  CategoryTreeController,
  CreateCategoryController,
  DeleteCategoryController,
  ListCategoriesController,
  UpdateCategoryController,
} from "../controllers/admin/category.controller.js";

export const categoryRouter = Router();

categoryRouter.use(requireAuth, requireAdmin);
categoryRouter.post(
  "/",
  validate(categoryInputDto),
  asyncHandler(CreateCategoryController),
);
categoryRouter.get("/", asyncHandler(ListCategoriesController));
categoryRouter.get("/tree", asyncHandler(CategoryTreeController));
categoryRouter.patch(
  "/:categoryId",
  validate(categoryParamsDto, { target: "params" }),
  validate(categoryInputDto),
  asyncHandler(UpdateCategoryController),
);
categoryRouter.delete(
  "/:categoryId",
  validate(categoryParamsDto, { target: "params" }),
  asyncHandler(DeleteCategoryController),
);
