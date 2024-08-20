import express from "express";
import { getUser, getUserFriends, addRemoveFriend } from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/:id", verifyToken, getUser); /* grabs specific user based on id sent from frontend */
router.get("/:id/friends", verifyToken, getUserFriends); /* grabs user's friends */

/* UPDATE */
router.patch("/:id/:friendId", verifyToken, addRemoveFriend); /* add/remove a friend */

export default router;
