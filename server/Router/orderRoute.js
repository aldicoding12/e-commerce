import express from "express";
const Route = express.Router(); // Perbaikan express.Router()

import {
  protectedMiddleware,
  ownerMiddleware,
} from "../middlewares/authMiddleware.js";
import * as order from "../controllers/orderControllers.js";

Route.post("/orders", protectedMiddleware, order.createOrder); // Menambahkan produk

Route.get("/orders", protectedMiddleware, ownerMiddleware, order.AllOrder); // Menambahkan produk

Route.get(
  "/orders/:id",
  protectedMiddleware,
  ownerMiddleware,
  order.DetailsOrder
); // Menambahkan produk

Route.get("/curent/user/order", protectedMiddleware, order.CurrentUserOrder); // Menambahkan produk

export default Route;
