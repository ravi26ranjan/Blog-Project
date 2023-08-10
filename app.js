import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/user-routes.js";
import blogRouter from "./routes/blog-routes.js";
const app = express();

app.use(express.json());
app.use("/api/user", userRouter);
app.use("/api/blog", blogRouter);

mongoose
  .connect(
    "mongodb+srv://ravi189ranjan:snKFvrB6x942gyc5@cluster0.lnnkcpu.mongodb.net/Blog?retryWrites=true&w=majority"
  )
  .then(() => app.listen(3000))
  .then(() => console.log("App is Connected"))
  .catch((err) => {
    console.log(err);
  });
