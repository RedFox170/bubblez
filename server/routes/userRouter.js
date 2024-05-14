import express from "express";
import {
  deleteUser,
  editUser,
  loginController,
  logoutController,
  registerController,
  getUserById,
} from "../controller/userController.js";
import {
  authenticateUser,
  authorizeUser,
} from "../controller/authController.js";

const userRouter = express.Router();

//! Wichtig: /delete/:id ist für news
//!          /:id ist für user
userRouter.post("/register", registerController);
userRouter.post("/login", authenticateUser, loginController);
userRouter.post("/logout", logoutController);
userRouter.get("/users/:id", getUserById);
userRouter.patch("/edit/:id", editUser);
userRouter.delete("/:id", authorizeUser, deleteUser);

export default userRouter;
