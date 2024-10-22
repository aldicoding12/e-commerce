import express from "express";
import * as product from "../controllers/productControllers.js";
import {
  protectedMiddleware,
  ownerMiddleware,
} from "../middlewares/authMiddleware.js";
import { upload } from "../utils/uploadFileHandler.js";

const Route = express.Router(); // Perbaikan express.Router()

Route.post(
  "/products",
  protectedMiddleware,
  ownerMiddleware,
  product.createProduct
); // Menambahkan produk

Route.get("/products", product.getAllProducts); // Mendapatkan semua produk

Route.get("/products/:id", product.getDetailProductId); // Mendapatkan produk berdasarkan ID

Route.put(
  "/products/:id",
  protectedMiddleware,
  ownerMiddleware,
  product.updateProductId
); // Mengupdate produk berdasarkan ID

Route.delete(
  "/products/:id",
  protectedMiddleware,
  ownerMiddleware,
  product.deleteProductId
); // Menghapus produk berdasarkan ID

Route.post(
  "/products/file-uploads",
  protectedMiddleware,
  ownerMiddleware,
  upload.single("image"),
  product.fileProduct
); // Route terpisah untuk mendapatkan file produk

export default Route;
