import { Hono } from "hono";
import authController from "../controllers/auth.controller";

const authRoute = new Hono();

authRoute.post("/login", authController.login)
authRoute.get("/me", authController.getME)

export default authRoute