import express, { Express } from "express";
import mongoose from "mongoose";
import cors from "cors";
import { config } from "./config/config";
import { registerRoutes } from "./routes";
import { ErrorMiddleware } from "./middleware/errorMiddleware";

const PORT = config.server.port;
const app: Express = express();

// Middleware
app.use(express.json());
app.use(cors());

(async function startUp() {
  try {
    // Connect MongoDB
    await mongoose.connect(config.mongo.url, {
      w: "majority",
      retryWrites: true,
      authMechanism: "DEFAULT",
    } as any);

    console.log("✅ Connection to MongoDB successful");

    // Register all routes
    registerRoutes(app);

    app.use(ErrorMiddleware);


    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Could not connect to the database", error);
    process.exit(1);
  }
})();
