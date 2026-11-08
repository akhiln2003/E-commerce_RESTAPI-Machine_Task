import { Router } from "express";
import { CategoryTreeController } from "../controllers/admin/category.controller.js";
import { asyncHandler } from "../utils/async-handler.js";

export const publicCategoryRouter = Router();

publicCategoryRouter.get("/tree", asyncHandler(CategoryTreeController));
