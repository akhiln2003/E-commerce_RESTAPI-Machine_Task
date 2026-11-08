import mongoose from "mongoose";
import { AppError } from "../utils/AppError.js";
import HttpStatusCode from "../utils/httpStatusCode.js";
import { categoryRepository } from "../repositories/category.repository.js";

interface CategoryInput {
  name: string;
  parentId: string | null;
}

export interface CategoryTreeNode {
  id: string;
  name: string;
  parentId: string | null;
  children: CategoryTreeNode[];
}

const normalizeName = (name: string) => name.trim().replace(/\s+/g, " ");

const parseParentId = (parentId: string | null) => {
  if (parentId === null || parentId === "") {
    return null;
  }

  if (!mongoose.Types.ObjectId.isValid(parentId)) {
    throw new AppError(HttpStatusCode.BadRequest, "Invalid parent category id");
  }

  return new mongoose.Types.ObjectId(parentId);
};

const validateInput = (input: CategoryInput) => {
  const name = normalizeName(input.name);

  if (!name) {
    throw new AppError(HttpStatusCode.BadRequest, "Category name is required");
  }

  if (name.length > 100) {
    throw new AppError(
      HttpStatusCode.BadRequest,
      "Category name must not exceed 100 characters",
    );
  }

  return { name, parentId: parseParentId(input.parentId) };
};

const ensureParentExists = async (parentId: mongoose.Types.ObjectId | null) => {
  if (parentId && !(await categoryRepository.findById(parentId.toString()))) {
    throw new AppError(HttpStatusCode.NotFound, "Parent category not found");
  }
};

const ensureUniqueName = async (
  name: string,
  parentId: mongoose.Types.ObjectId | null,
  excludeId?: string,
) => {
  if (await categoryRepository.findByNameAndParent(name, parentId, excludeId)) {
    throw new AppError(
      HttpStatusCode.Conflict,
      "A category with this name already exists under the selected parent",
    );
  }
};

const createCategory = async (input: CategoryInput) => {
  const data = validateInput(input);
  await ensureParentExists(data.parentId);
  await ensureUniqueName(data.name, data.parentId);
  return categoryRepository.create(data.name, data.parentId);
};

const updateCategory = async (categoryId: string, input: CategoryInput) => {
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new AppError(HttpStatusCode.BadRequest, "Invalid category id");
  }

  const current = await categoryRepository.findById(categoryId);
  if (!current) {
    throw new AppError(HttpStatusCode.NotFound, "Category not found");
  }

  const data = validateInput(input);
  await ensureParentExists(data.parentId);

  if (data.parentId?.toString() === categoryId) {
    throw new AppError(
      HttpStatusCode.BadRequest,
      "A category cannot be its own parent",
    );
  }

  await ensureUniqueName(data.name, data.parentId, categoryId);

  let ancestorId = data.parentId?.toString();
  while (ancestorId) {
    if (ancestorId === categoryId) {
      throw new AppError(
        HttpStatusCode.BadRequest,
        "A category cannot be moved below one of its descendants",
      );
    }

    const ancestor = await categoryRepository.findById(ancestorId);
    ancestorId = ancestor?.parentId?.toString();
  }

  return categoryRepository.update(categoryId, data);
};

const deleteCategory = async (categoryId: string) => {
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new AppError(HttpStatusCode.BadRequest, "Invalid category id");
  }

  const category = await categoryRepository.findById(categoryId);
  if (!category) {
    throw new AppError(HttpStatusCode.NotFound, "Category not found");
  }

  if (await categoryRepository.hasChildren(categoryId)) {
    throw new AppError(
      HttpStatusCode.Conflict,
      "Cannot delete a category that has child categories",
    );
  }

  await categoryRepository.deleteById(categoryId);
};

const listCategories = async () => categoryRepository.findAll();

const getCategoryTree = async () => {
  const categories = await categoryRepository.findAll();
  const nodes: CategoryTreeNode[] = categories.map((category) => ({
    id: category.id,
    name: category.name,
    parentId: category.parentId ? category.parentId.toString() : null,
    children: [],
  }));
  const byId = new Map(nodes.map((node) => [node.id, node]));
  const roots: typeof nodes = [];

  for (const node of nodes) {
    const parent = node.parentId ? byId.get(node.parentId) : undefined;
    if (parent) {
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
};

export const categoryService = {
  createCategory,
  updateCategory,
  deleteCategory,
  listCategories,
  getCategoryTree,
};
