import createHttpError from "http-errors";
import { User } from "../models/user.js";
import bcrypt from "bcrypt";

export const registerUser = async (req, res) => {
  const createdUser = await User.findOne({email: req.body.email});
  if (createdUser) {
    throw createHttpError(400, "User with this email alredy created");
}

  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  const user = await User.create({
    email: req.body.email,
    password: hashedPassword,
  });

  res.status(201).json({user});
};

export const loginUser = async (req, res) => {

  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    throw createHttpError(401, "Invalid credentials");
  }
  const isValidPassword = await bcrypt.compare(req.body.password, user.password);
  console.log(req.body.password, user.password);

  if (!isValidPassword) {
    throw createHttpError(401, "Invalid credentials");
  }

  res.status(201).json({user});
};
