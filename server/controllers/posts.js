import Post from "../models/Post.js";
import User from "../models/User.js";

/* CREATE */
export const createPost = async (req, res) => {
    try {
        const { userId, description, picturePath } = req.body;
        const user = await User.findById(userId);
        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicturePath: user.picturePath,
            picturePath,
            likes: {},
            comments: []
        })
        await newPost.save();

        const post = await Post.find(); /* update the posts in frontend */

        res.status(201).json(post);
    } catch (err) {
        res.status(409).json({ message: err.message })
    }
}

/* READ */
export const getFeedPosts = async (req, res) => {
    try {
        const post = await Post.find(); /* grab all posts */ 
        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;
        const post = await Post.find({ userId }); /* grab all posts associated with the userId */ 
        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({ message: err.message })
    }
}

/* UPDATE  */
export const likePost = async (req, res) => {
    try {
        const { id } = req.params; /* user who made the post */ 
        const { userId } = req.body; /* user who is liking */
        const post = await Post.findById(id);
        const isLiked = post.likes.get(userId);

        if (isLiked) {
            post.likes.delete(userId);
        } else {
            post.likes.set(userId, true);
        }

        const updatedPost = await Post.findByIdAndUpdate( /* update post by passing in the new likes map */
            id, 
            { likes: post.likes },
            { new: true }
        );

        res.status(200).json(updatedPost);
    } catch (err) {
        res.status(404).json({ message: err.message })
    } 
}