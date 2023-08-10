import User from "../model/User.js";
import bcrypt from "bcrypt";

export const getAllUser = async (req, res, next) => {
  let users;
  try {
    users = await User.find();
  } catch (err) {
    console.log(err);
  }

  if (!users) {
    return res.status(404).json({ message: "No user found" });
  }
  return res.status(200).json({ users });
};

export const signup = async (req, res, next) => {
  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }

  if (existingUser) {
    return res
      .status(409)
      .json({ message: " This email address is already in use. " });
  }

  const hashedPassword = bcrypt.hashSync(password, 1);

  const user = new User({
    name,
    email,
    password: hashedPassword,
    blogs: [],
  });

  try {
    await user.save();
    return res.status(201).json({ user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
  if (!existingUser) {
    return res.status(404).json({ message: " No matching User found" });
  }

  const isPasswordCorrect = bcrypt.compare(password, existingUser.password);

  if (!isPasswordCorrect)
    return res.status(400).json({ message: "Incorrect Password" });

  return res.status(200).json({ message: "Login Successful" });
};
