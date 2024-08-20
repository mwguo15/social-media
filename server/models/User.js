import mongoose from "mongoose";

/* defining the attributes of a user object */
const UserSchema = new mongoose.Schema(
    {
      firstName: {
        type: String,
        required: true,
        min: 2,
        max: 50,
      },
      lastName: {
        type: String,
        required: true,
        min: 2,
        max: 50,
      },
      email: {
        type: String,
        required: true,
        max: 50,
        unique: true,
      },
      password: {
        type: String,
        required: true,
        min: 5,
      },
      picturePath: {
        type: String,
        default: "",
      },
      friends: {
        type: Array,
        default: [],
      },
      location: String,
      occupation: String,
      viewedProfile: Number,
      impressions: Number,
    },
    { timestamps: true } /* automatically gives dates for when user is created/updated, etc */
  );
  
  const User = mongoose.model("User", UserSchema); /* creating user */
  export default User;