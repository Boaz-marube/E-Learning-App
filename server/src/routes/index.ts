import { Express } from "express";
import authRoutes from "./authRoutes";
import landingRoutes from "./landingRoutes";
// import courseRoutes from "./courseRoutes";
// import enrollmentRoutes from "./enrollmentRoutes";

export const registerRoutes = (app: Express): void => {
  app.use("/api/auth", authRoutes);
  app.use("/api", landingRoutes);
  // app.use("/api/courses", courseRoutes);
  // app.use("/api/enrollments", enrollmentRoutes);

  // Health check
  app.get("/health", (_, res) => {
    res.json({
      success: true,
      message: "E-learning API is running...",
      timestamp: new Date().toISOString()
    });
  });
};
