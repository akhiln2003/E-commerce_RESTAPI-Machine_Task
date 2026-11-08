import mongoose from "mongoose";
import { CategoryModel } from "../models/category.model.js";

const create = async (name: string, parentId: mongoose.Types.ObjectId | null) =>
  CategoryModel.create({ name, parentId });

const findAll = async () =>
  CategoryModel.find().sort({ name: 1 }).exec();

const findById = async (categoryId: string) =>
  CategoryModel.findById(categoryId).exec();

const findByNameAndParent = async (
  name: string,
  parentId: mongoose.Types.ObjectId | null,
  excludeId?: string,
) => {
  const query: {
    name: string;
    parentId: mongoose.Types.ObjectId | null;
    _id?: { $ne: string };
  } = { name, parentId };

  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  return CategoryModel.findOne(query).exec();
};

const update = async (
  categoryId: string,
  data: { name: string; parentId: mongoose.Types.ObjectId | null },
) =>
  CategoryModel.findByIdAndUpdate(
    categoryId,
    { $set: data },
    { new: true, runValidators: true },
  ).exec();

const deleteById = async (categoryId: string) =>
  CategoryModel.findByIdAndDelete(categoryId).exec();

const hasChildren = async (categoryId: string) =>
  CategoryModel.exists({ parentId: categoryId });

export const categoryRepository = {
  create,
  findAll,
  findById,
  findByNameAndParent,
  update,
  deleteById,
  hasChildren,
};
