import express from "express";
import {
  deleteUser,
  editUser,
  loginController,
  logoutController,
  registerController,
  getUserById,
  getUserData,
  addFriend,
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
userRouter.post("/addFriend/:id", authorizeUser, addFriend);
userRouter.post("/logout", logoutController);
userRouter.get("/users/:id", authorizeUser, getUserById);
userRouter.patch("/edit/:id", authorizeUser, editUser);
userRouter.delete("/:id", authorizeUser, deleteUser);
userRouter.get("/getUserData", authorizeUser, getUserData);

export default userRouter;
