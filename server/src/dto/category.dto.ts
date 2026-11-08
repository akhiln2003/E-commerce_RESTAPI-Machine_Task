import { z } from "zod";

const objectId = z
  .string({ error: "Category id is required" })
  .regex(/^[a-f\d]{24}$/i, "Invalid category id");

export const categoryInputDto = z
  .object({
    name: z
      .string({ error: "Category name is required" })
      .trim()
      .min(1, "Category name is required")
      .max(100, "Category name cannot exceed 100 characters"),
    parentId: objectId.nullable().optional().default(null),
  })
  .strict();

export const categoryParamsDto = z
  .object({
    categoryId: objectId,
  })
  .strict();

export type CategoryInput = z.infer<typeof categoryInputDto>;
