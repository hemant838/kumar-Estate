import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjudMkZQvMb8jJsSvqWT3cCURYjG5_bW3X15kcJSUcSwruYWJw7UwGIwOzNR6VR5I4AJU&usqp=CAU",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
