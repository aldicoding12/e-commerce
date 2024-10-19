import express from "express";
import * as Auth from "../controllers/authControllers.js";
import { protectedMiddleware } from "../middlewares/authMiddleware.js";
import * as user from "../controllers/userControllers.js";
const Route = express.Router(); // Menggunakan express.Router()

// Rute untuk '/register'
Route.post("/data/register", Auth.usersRegistration);

// Rute untuk '/login'
Route.post("/data/login", Auth.usersLogin);

Route.post("/logout", protectedMiddleware, Auth.userLogout);

// Mengambil data user
Route.post("/data/users", protectedMiddleware, user.getCurrentUser);
// Ekspor router
export default Route;
