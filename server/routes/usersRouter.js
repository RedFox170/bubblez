import express from "express";

import { authorizeUser } from "../controller/authController.js";
import { getAllUsers } from "../controller/usersController.js";

const usersRouter = express.Router();

usersRouter.get("/users", authorizeUser, getAllUsers);

export default usersRouter;
