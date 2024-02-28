import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from './routes/user.route.js';
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

//allocated the local port to the server
app.listen(3001, () => {
  console.log("server is running on port 3001!");
});

app.use("/api/user", userRouter);
