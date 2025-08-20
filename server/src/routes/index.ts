import { Express } from "express";
// import authRoutes from "./authRoutes";
// import courseRoutes from "./courseRoutes";
// import enrollmentRoutes from "./enrollmentRoutes";

export const registerRoutes = (app: Express): void => {
//   app.use("/api/auth", authRoutes);
//   app.use("/api/courses", courseRoutes);
//   app.use("/api/enrollments", enrollmentRoutes);

  // Test root
  app.get("/", (_, res) => {
    res.send("E-learning API is running...");
  });
};