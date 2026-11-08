import mongoose, { Schema } from "mongoose";

interface CategoryAttrs {
  name: string;
  parentId: mongoose.Types.ObjectId | null;
}

interface CategoryDoc extends CategoryAttrs {
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<CategoryDoc>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
  },
  { timestamps: true },
);

categorySchema.index({ name: 1, parentId: 1 }, { unique: true });

categorySchema.set("toJSON", {
  transform(_doc, ret) {
    const result = ret as unknown as Record<string, unknown>;
    result.id = String(result._id);
    result.parentId = result.parentId ? String(result.parentId) : null;
    delete result._id;
    delete result.__v;
    return result;
  },
});

export const CategoryModel = mongoose.model<CategoryDoc>(
  "Category",
  categorySchema,
);
