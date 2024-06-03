import express from "express";
import {
  addComment,
  createPost,
  getPosts,
  likePost,
} from "../controller/postController.js";
import { authorizeUser } from "../controller/authController.js";

const postRouter = express.Router();

postRouter.get("/feed", getPosts);
postRouter.post("/create", authorizeUser, createPost);
postRouter.post("/addComment/:postId", addComment);
postRouter.put("/likePost/:postId", likePost);

export default postRouter;
