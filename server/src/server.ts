import express, { Express } from "express";
import mongoose from "mongoose";
import cors from "cors";
import { config } from "./config/config";
import { registerRoutes } from "./routes";
import { ErrorMiddleware } from "./middleware/errorMiddleware";

const PORT = process.env.PORT || config.server.port;
const app: Express = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.com'] 
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

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
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server listening on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error("❌ Could not connect to the database", error);
    process.exit(1);
  }
})();
