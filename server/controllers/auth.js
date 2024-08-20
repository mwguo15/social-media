import bcrypt from "bcrypt"; /* encrypt passwords */
import jwt from "jsonwebtoken"; /* sending user webtoken to be used for auth */
import User from "../models/User.js";

/* REGISTER USER */

/* encrypt pw and then save it with a new user object */
export const register = async (req, res) => { /* async due to database call */
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation
        } = req.body; /* req is info from user (arguments) */ 

        const salt = await bcrypt.genSalt(); /* salt used to encrypt password */
        const passwordHash = await bcrypt.hash(password, salt); 

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 10000),
            impressions: Math.floor(Math.random() * 10000)
        });
        const savedUser = await newUser.save()
        res.status(201).json(savedUser); /* if no errors, send back 201 (something was created) and new user to frontend */
    } catch (err) {
        res.status(500).json({ error: err.message }) /* otherwise, send back error code and mongo error message */
    }
}

/* LOGGING IN */

/* when user tries to login, they provide pw, we encrypt 
   and verify it's correct. then, we send json webtoken */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email }); /* try to find user based on email */
        if (!user) return res.status(400).json({ msg: "User does not exist." });

        const isMatch = await bcrypt.compare(password, user.password); /* verify password */
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials." });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        user.password = undefined; /* don't want to send password back to frontend */
        res.status(200).json({ token, user });
    } catch (err) {
        res.status(500).json({ error: err.message }); 
    }
}