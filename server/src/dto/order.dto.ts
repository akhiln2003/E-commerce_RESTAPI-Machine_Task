import { z } from "zod";

const objectId = z.string().regex(/^[a-f\d]{24}$/i, "Invalid id");

export const createOrderDto = z
  .object({
    items: z
      .array(
        z.object({
          productId: objectId,
          quantity: z.number().int().positive().max(1000),
        }),
      )
      .min(1)
      .max(100),
  })
  .strict();

export const orderParamsDto = z.object({
  orderId: objectId,
});

export const orderStatusDto = z
  .object({
    status: z.enum([
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ]),
  })
  .strict();

export const orderListQueryDto = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
});
