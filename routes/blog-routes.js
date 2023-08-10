import express from "express";
import {
  getAllBlog,
  getBlog,
  addBlog,
  updateBlog,
  deleteBlog,
  blogsByUserId,
} from "../controller/blog-controller.js";

const blogRouter = express.Router();

blogRouter.get("/", getAllBlog);
blogRouter.get("/:id", getBlog);
blogRouter.post("/add", addBlog);
blogRouter.put("/update/:id", updateBlog);
blogRouter.delete("/delete/:id", deleteBlog);
blogRouter.get("/user/:id", blogsByUserId);

export default blogRouter;
