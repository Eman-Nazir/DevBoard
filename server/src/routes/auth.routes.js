import { Router } from "express";
import {
  register,
  login,
  logout,
  refreshAccessToken,
  getMe,
  updateProfile,
  changePassword,
} from "../controllers/auth.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { validateRegister, validateLogin } from "../validators/auth.validator.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

// ── Public 
router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.post("/refresh-token", refreshAccessToken);

// ── Protected 
router.post("/logout", verifyJWT, logout);
router.get("/me", verifyJWT, getMe);
router.patch("/profile", verifyJWT, upload.single("avatar"), updateProfile);
router.patch("/change-password", verifyJWT, changePassword);

export default router;