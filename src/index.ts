import express, { Request, Response } from "express";
import dotenv from "dotenv";
import logger from "./utils/logger";
import morgan from "morgan";
import ApiResponse from "./utils/ApiResponse";
import { CONSTANTS } from "./utils/constants";
import authRoutes from "./routes/auth.route";
import productRoutes from "./routes/product.route";
import cookieParser from "cookie-parser";
import ratingRoutes from "./routes/rating.route";
import addressRoutes from "./routes/address.route";
import authMiddleware from "./middlewares/auth.middleware";
import orderRoutes from "./routes/order.route";
import cors from "cors";

const app = express();

// middlewares
dotenv.config({ path: "../.env" });
app.use(
  cors({
    origin: process.env.CORS_ORIGIN_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);
// logger
const morganFormat = ":method :url :status :response-time ms";

// middlewares
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message: String) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  }),
);

app.use(express.json());
app.use(cookieParser());

// constants
const PORT: String | Number = process.env.PORT || 8080;

// routes
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json(new ApiResponse("Server is running smoothly"));
});
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/product", authMiddleware, productRoutes);
app.use("/api/v1/rating", authMiddleware, ratingRoutes);
app.use("/api/v1/address", authMiddleware, addressRoutes);
app.use("/api/v1/order", authMiddleware, orderRoutes);
app.use("*", (req: Request, res: Response) => {
  res.status(404).json(new ApiResponse(CONSTANTS.MESSAGES.ROUTE_NOT_FOUND));
});

// start listening
app.listen(PORT, () => console.log(`server running on port: ${PORT}`));
