import dotenv from "dotenv";
import e from "express";
import { z } from "zod";

dotenv.config();

// Define a schema for all environment variables
const envSchema = z.object({
  MONGO_USERNAME: z.string().min(1, "MONGO_USERNAME is required"),
  MONGO_PASSWORD: z.string().min(1, "MONGO_PASSWORD is required"),
  SERVER_PORT: z.string().default("8090").transform(Number), // coercion to number
  SERVER_ROUNDS: z.string().default("10").transform(Number),
  JWT_SECRET: z.string().min(1, "JWT_SECRET is required"),
  JWT_EXPIRES_IN: z.string().default('7d'),
});

const env = envSchema.parse(process.env);

const MONGO_URL = `mongodb+srv://${env.MONGO_USERNAME}:${env.MONGO_PASSWORD}@cluster0.i6679dv.mongodb.net/elearningdb?retryWrites=true&w=majority&appName=Cluster0`;

export const config = {
  mongo: {
    url: MONGO_URL,
  },
  server: {
    port: env.SERVER_PORT,
    rounds: env.SERVER_ROUNDS,
  },
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN,
   },
};
