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

const findPaginated = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;
  const [users, total] = await Promise.all([
    UserModel.find({ role: "user" })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec(),
    UserModel.countDocuments({ role: "user" }).exec(),
  ]);

  return { users, total };
};

const updateBlockedStatus = async (userId: string, isBlocked: boolean) => {
  return UserModel.findOneAndUpdate(
    { _id: userId, role: "user" },
    { $set: { isBlocked } },
    { new: true, runValidators: true },
  ).exec();
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
  findPaginated,
  updateBlockedStatus,
  updateById,
  deleteById,
};