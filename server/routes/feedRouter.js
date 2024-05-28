// routes/feed.js
import express from "express";
import { getFeed } from "../controller/feedController.js";
import { authorizeUser } from "../controller/authController.js";

const router = express.Router();

router.get("/feed", authorizeUser, getFeed);

export default router;
