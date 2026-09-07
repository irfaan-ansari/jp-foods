import { cors } from "hono/cors";

const origins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3002",
];

export const corsMiddleware = cors({
  origin: (origin) => {
    if (!origin) return "";

    return origins.includes(origin) ? origin : "";
  },
  credentials: true,
  allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization"],
});