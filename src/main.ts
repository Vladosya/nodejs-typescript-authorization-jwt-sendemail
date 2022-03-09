import express, { Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./router/index";

import "dotenv/config";

const app: Express = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL ? process.env.CLIENT_URL : "http://localhost:3000",
  }),
);
app.use("/api-v1", router);

const PORT: string | number = process.env.PORT ? process.env.PORT : 5000;

const start = (): void => {
  try {
    app.listen(PORT, () => {
      console.log(`Server started on PORT ${PORT}`);
    });
  } catch (error) {
    console.log("Error in start func src/main.ts --------------> ", error);
  }
};

start();
