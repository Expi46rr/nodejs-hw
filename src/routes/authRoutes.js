import { Router } from "express";
import { loginUser, registerUser } from "../controllers/authController.js";
import { celebrate } from "celebrate";
import { loginUserSchema, registerUserSchema } from "../validations/authValidation.js";

const router = Router();
router.post("/auth/register",celebrate(registerUserSchema), registerUser);
router.post("/auth/login",celebrate(loginUserSchema), loginUser);

export default router;
