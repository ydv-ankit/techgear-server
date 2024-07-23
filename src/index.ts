import express from "express";
import dotenv from "dotenv";
import logger from "./utils/logger";
import morgan from "morgan";
import ApiResponse from "./utils/ApiResponse";
import { CONSTANTS } from "./utils/constants";

const app = express();

// middlewares
dotenv.config({ path: "../.env" });

// logger
const morganFormat = ":method :url :status :response-time ms";
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
  })
);

// constants
const PORT: String | Number = process.env.PORT || 8888;

// routes
app.get("/health", (req, res) => {
  res.status(200).json(new ApiResponse(CONSTANTS.STATUS.SUCCESS, null, { message: "Server is running smoothly" }));
});

// start listening
app.listen(PORT, () => console.log(`server running on port: ${PORT}`));
