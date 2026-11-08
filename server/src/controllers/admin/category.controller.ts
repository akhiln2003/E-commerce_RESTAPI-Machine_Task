import type { RequestHandler } from "express";
import { categoryService } from "../../services/category.service.js";
import HttpStatusCode from "../../utils/httpStatusCode.js";
import { AppError } from "../../utils/AppError.js";

export const CreateCategoryController: RequestHandler = async (req, res) => {
  const category = await categoryService.createCategory(req.body);
  res.status(HttpStatusCode.Created).json({
    success: true,
    message: "Category created successfully",
    category,
  });
};

export const ListCategoriesController: RequestHandler = async (_req, res) => {
  const categories = await categoryService.listCategories();
  res.status(HttpStatusCode.OK).json({ success: true, categories });
};

export const CategoryTreeController: RequestHandler = async (_req, res) => {
  const categories = await categoryService.getCategoryTree();
  res.status(HttpStatusCode.OK).json({ success: true, categories });
};

export const UpdateCategoryController: RequestHandler = async (req, res) => {
  const categoryId = Array.isArray(req.params.categoryId)
    ? req.params.categoryId[0]
    : req.params.categoryId;
  if (!categoryId) {
    throw new AppError(HttpStatusCode.BadRequest, "Category id is required");
  }

  const category = await categoryService.updateCategory(
    categoryId,
    req.body,
  );
  res.status(HttpStatusCode.OK).json({
    success: true,
    message: "Category updated successfully",
    category,
  });
};

export const DeleteCategoryController: RequestHandler = async (req, res) => {
  const categoryId = Array.isArray(req.params.categoryId)
    ? req.params.categoryId[0]
    : req.params.categoryId;
  if (!categoryId) {
    throw new AppError(HttpStatusCode.BadRequest, "Category id is required");
  }

  await categoryService.deleteCategory(categoryId);
  res.status(HttpStatusCode.OK).json({
    success: true,
    message: "Category deleted successfully",
  });
};
