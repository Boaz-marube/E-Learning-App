import { Express } from "express";
import authRoutes from "./authRoutes";
import landingRoutes from "./landingRoutes";
import searchRoutes from "./searchRoutes";
import notificationRoutes from "./notificationRoutes";
import uploadRoutes from "./uploadRoutes";
import contentRoutes from "./contentRoutes";
import studentRoutes from "./studentRoutes";
// import courseRoutes from "./courseRoutes";
// import enrollmentRoutes from "./enrollmentRoutes";

export const registerRoutes = (app: Express): void => {
  app.use("/api/auth", authRoutes);
  app.use("/api", landingRoutes);
  app.use("/api/search", searchRoutes);
  app.use("/api/notifications", notificationRoutes);
  app.use("/api/upload", uploadRoutes);
  app.use("/api/content", contentRoutes);
  app.use("/api/student", studentRoutes);
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
