import express from "express";
import { getFeedPosts, getUserPosts, likePost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getFeedPosts); /* give user all posts (feed) on home screen */
router.get("/:userId/posts", verifyToken, getUserPosts); /* give all posts from a single user */ 

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);

export default router;