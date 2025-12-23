import express from "express";
import cookieParser from "cookie-parser";
import corsMiddleware from "./config/cors.js";
import routes from "./routes/index.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { notFoundMiddleware } from "./middleware/notFound.middleware.js";
import { apiRateLimiter } from "./middleware/rateLimiter.middleware.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(corsMiddleware);
app.use(apiRateLimiter);

// API routes
app.use("/api", routes);

// 404 handler - must be after all routes
app.use(notFoundMiddleware);

// Error handler - must be last
app.use(errorMiddleware);

export default app;
