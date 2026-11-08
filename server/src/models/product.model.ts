import mongoose, { Schema } from "mongoose";

export type ProductStatus = "active" | "inactive";

interface ProductAttrs {
  name: string;
  sku: string;
  description: string;
  price: number;
  salePrice: number | null;
  stock: number;
  categoryId: mongoose.Types.ObjectId;
  status: ProductStatus;
}

interface ProductDoc extends ProductAttrs {
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<ProductDoc>(
  {
    name: { type: String, required: true, trim: true, maxlength: 150 },
    sku: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: { type: String, required: true, trim: true, maxlength: 5000 },
    price: { type: Number, required: true, min: 0 },
    salePrice: { type: Number, default: null, min: 0 },
    stock: { type: Number, required: true, min: 0 },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      required: true,
    },
  },
  { timestamps: true },
);

productSchema.index({ categoryId: 1, status: 1 });
productSchema.index({ name: "text", description: "text", sku: "text" });

productSchema.set("toJSON", {
  transform(_doc, ret) {
    const result = ret as unknown as Record<string, unknown>;
    result.id = String(result._id);
    result.categoryId = String(result.categoryId);
    delete result._id;
    delete result.__v;
    return result;
  },
});

export const ProductModel = mongoose.model<ProductDoc>("Product", productSchema);
