import mongoose, { Schema } from "mongoose";

interface UserAttrs {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
}

interface UserDoc extends UserAttrs {
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDoc>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,

    toJSON: {
      transform(_doc, ret) {
        const result = ret as unknown as Record<string, unknown>;

        result.id = String(result._id);

        delete result._id;
        delete result.__v;
        delete result.password;

        return result;
      },
    },
  },
);

const UserModel = mongoose.model<UserDoc>("User", userSchema);

export { UserModel };