import { UserModel } from "../models/user.model.js";

interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin"
}

const create = async (data: CreateUserData) => {
  return UserModel.create(data);
};

const findByEmail = async (email: string) => {
  return UserModel.findOne({ email }).exec();
};

const findByEmailWithPassword = async (email: string) => {
  return UserModel.findOne({ email })
    .select("+password")
    .exec();
};

const findById = async (userId: string) => {
  return UserModel.findById(userId).exec();
};

const findAll = async () => {
  return UserModel.find().exec();
};

const updateById = async (
  userId: string,
  data: Partial<CreateUserData>,
) => {
  return UserModel.findByIdAndUpdate(
    userId,
    { $set: data },
    {
      new: true,
      runValidators: true,
    },
  ).exec();
};

const deleteById = async (userId: string) => {
  return UserModel.findByIdAndDelete(userId).exec();
};

export const userRepository = {
  create,
  findByEmail,
  findByEmailWithPassword,
  findById,
  findAll,
  updateById,
  deleteById,
};