import mongoose from "mongoose";
import Blog from "../model/Blog.js";
import User from "../model/User.js";

export const getAllBlog = async (req, res, next) => {
  let blogs;
  try {
    blogs = await Blog.find();
  } catch (err) {
    return console.error(err);
  }
  if (!blogs) {
    return res.status(404).json({ message: "No Blogs found" });
  }
  res.status(200).json({ blogs });
};

export const getBlog = async (req, res, next) => {
  let id = req.params.id;
  let blog;
  try {
    blog = await Blog.findById(id);
  } catch (err) {
    return console.error(err);
  }
  if (!blog) {
    return res.status(404).json({ message: "No Blog found" });
  }
  res.status(200).json({ blog });
};

export const addBlog = async (req, res, next) => {
  const { title, description, Image, user } = req.body;

  let existingUser;
  try {
    existingUser = await User.findById(user);
  } catch (err) {
    console.log(err);
  }

  if (!existingUser)
    return res.status(404).json({ message: "No userId Found" });

  let blog = new Blog({
    title,
    description,
    Image,
    user,
  });
  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await blog.save({ session });
    existingUser.blogs.push(blog);
    await existingUser.save({ session });
    await session.commitTransaction();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
  return res.status(201).json({ blog });
};

export const updateBlog = async (req, res, next) => {
  const { description, Image } = req.body;

  const blogId = req.params.id;

  let updatedBlog;
  try {
    updatedBlog = await Blog.findByIdAndUpdate(blogId, {
      description,
      Image,
    });

    if (!updatedBlog) {
      return res.status(500).json({ message: "Couldn't update" });
    }
    return res.status(200).json({ updatedBlog });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const deleteBlog = async (req, res, next) => {
  let id = req.params.id;
  let blog;
  try {
    blog = await Blog.findByIdAndRemove(id).populate("user");
    await blog.user.blogs.pull(blog);
    await blog.user.save();
  } catch (err) {
    console.error(err);
  }
  if (!blog) {
    return res.status(404).json({ message: "No Blog found" });
  }
  res.status(200).json({ message: "Blog Deleted" });
};

export const blogsByUserId = async (req, res, next) => {
  const userId = req.params.id;

  let userBlog;
  try {
    userBlog = await User.findById(userId).populate("blogs");
  } catch (err) {
    console.log(err);
  }

  if (!userBlog) {
    return res.status(400).json({ message: "No Blog Found" });
  }
  return res.status(200).json({ blogs: userBlog });
};
