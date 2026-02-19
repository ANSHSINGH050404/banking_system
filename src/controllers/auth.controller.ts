import type { Response, Request } from "express";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model";

export const registerController = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const user = await userModel.findOne({ email });
  if (user) {
    return res.status(400).json({ message: "User already exists" });
  }

  const newUser = await userModel.create({
    name,
    email,
    password,
  });

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: "12h",
  });

  return res
    .status(201)
    .json({ 
      message: "User created successfully", 
      user:{
           _id: newUser._id,
            email: newUser.email,
            name: newUser.name
      },
      token

     });
};

export const LoginController = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const user = await userModel.findOne({ email }).select("+password");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid password" });
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "12h",
  });

  const userObj = user.toObject();
  delete userObj.password;

  return res
    .status(200)
    .json({ message: "User logged in successfully", user: userObj, token });
};
