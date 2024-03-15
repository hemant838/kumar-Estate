import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";

dotenv.config();

// connecting the mongodb database with the backend service
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("connected");
  })
  .catch((err) => {
    console.log(err);
  });

// initialise the the backend express server
const app = express();

app.use(express.json());
app.use(cookieParser());
//allocated the local port to the server
app.listen(3000, () => {
  console.log("server is running on port 3000!");
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal sever error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
