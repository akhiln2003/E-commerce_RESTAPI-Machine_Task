import { app } from "./app.js";
import { connectDB } from "./config/database.js";
import { env } from "./config/env.js";
import { ensureAdminAccount } from "./services/admin-bootstrap.service.js";

const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    await ensureAdminAccount();

    app.listen(env.PORT, () => {
      console.log(`API listening on port ${env.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
