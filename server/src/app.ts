import cors from "cors";
import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import { env } from "./config/env.js";
import { errorHandler } from "./middleware/error-handler.js";
import { authRouter } from "./routes/auth.routes.js";
import { categoryRouter } from "./routes/category.routes.js";
import { adminProductRouter } from "./routes/product.routes.js";
import { ListProductsController } from "./controllers/product.controller.js";
import { validate } from "./middleware/validate.js";
import { productListQueryDto } from "./dto/product.dto.js";
import { asyncHandler } from "./utils/async-handler.js";
import { orderRouter } from "./routes/order.routes.js";
import { publicCategoryRouter } from "./routes/public-category.routes.js";
import HttpStatusCode from "./utils/httpStatusCode.js";

export const app = express();

app.use(helmet());

app.use(
  cors({
    origin: env.CLIENT_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRouter);
app.use("/api/admin/categories", categoryRouter);
app.use("/api/categories", publicCategoryRouter);
app.use("/api/admin/products", adminProductRouter);
app.get(
  "/api/products",
  validate(productListQueryDto, { target: "query" }),
  asyncHandler(ListProductsController),
);
app.use("/api/orders", orderRouter);

// 404 handler
app.use((_req, res) => {
  res.status(HttpStatusCode.NotFound).json({
    success: false,
    message: "Route not found",
  });
});

// Global error handler
app.use(errorHandler);