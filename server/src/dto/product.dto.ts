import { z } from "zod";

const objectId = z
  .string({ error: "Category id is required" })
  .regex(/^[a-f\d]{24}$/i, "Invalid id");

export const productInputDto = z
  .object({
    name: z.string({ error: "Product name is required" }).trim().min(1).max(150),
    sku: z
      .string({ error: "SKU is required" })
      .trim()
      .min(1)
      .max(50)
      .regex(/^[a-zA-Z0-9-]+$/, "SKU may contain only letters, numbers, and hyphens"),
    description: z.string({ error: "Description is required" }).trim().min(1).max(5000),
    price: z.number({ error: "Price is required" }).finite().nonnegative(),
    salePrice: z.number().finite().nonnegative().nullable(),
    stock: z.number({ error: "Stock is required" }).int().nonnegative(),
    categoryId: objectId,
    status: z.enum(["active", "inactive"]),
  })
  .strict()
  .refine(
    (data) => data.salePrice === null || data.salePrice <= data.price,
    { path: ["salePrice"], message: "Sale price cannot exceed price" },
  );

export const productParamsDto = z.object({
  productId: objectId,
});

export const productListQueryDto = z.object({
  categoryId: objectId.optional(),
  search: z.string().trim().max(100).optional(),
  minPrice: z.coerce.number().finite().nonnegative().optional(),
  maxPrice: z.coerce.number().finite().nonnegative().optional(),
  sort: z
    .enum(["newest", "priceAsc", "priceDesc", "nameAsc", "nameDesc"])
    .default("newest"),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(12),
}).refine(
  (data) =>
    data.minPrice === undefined ||
    data.maxPrice === undefined ||
    data.minPrice <= data.maxPrice,
  { path: ["maxPrice"], message: "Maximum price must be greater than minimum price" },
);
