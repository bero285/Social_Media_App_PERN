import express from "express";
import {} from "../controllers/posts.js";
import { getPosts } from "../controllers/posts.js";
const router = express.Router();

router.get("/", getPosts);

export default router;
