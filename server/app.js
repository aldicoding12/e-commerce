import express, { urlencoded } from "express"; // Use quotes for the module import
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import helmet from "helmet";
import ekspressMongooseSanotize from "express-mongo-sanitize";
import { v2 as cloudinary } from "cloudinary";
import * as middle from "./middlewares/errorMiddleware.js";
const app = express();
const port = 3000;

import authRouter from "./Router/authRouter.js";
import productRouter from "./Router/productRoute.js";
import orderProduct from "./Router/orderRoute.js";

dotenv.config();

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET, // Click 'View API Keys' above to copy your API secret
});

// middelawre json
app.use(express.json());
app.use(helmet());
app.use(ekspressMongooseSanotize());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public"));

app.use("/data/users", authRouter);
app.use("/data", productRouter);
app.use("/data", orderProduct);

// middlewares
app.use(middle.notFound);
app.use(middle.errorHandler);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// koneksi ke databse
mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log("Connected!"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));
