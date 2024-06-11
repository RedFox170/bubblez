import express from "express";
import uploadMiddleware from "./uploadMiddleware.js";
import { uploadImage } from "./imageController.js";

const imageRouter = express.Router();

imageRouter.post("/upload", uploadMiddleware, uploadImage);

export default imageRouter;
