import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

// Register
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  const existedUser = await User.findOne({ email });

  if (existedUser) {
    res.status(400);
    throw new Error("User already exists");
  }

  const image = req.file ? req.file.filename : null;

  const user = await User.create({
    name,
    email,
    password,
    role,
    image,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.image,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// Login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    if (user && (await user.matchPassword(password))) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
      });
    } else {
      res.status(401).json({ message: "Invalid credential" });
    }
  } else {
    res.status(401).json({ message: "User not found" });
  }
});

// Get all users
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Get user by id
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    res.status(201).json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// Update user by id
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role;
    if (req.body.password) {
      user.password = req.body.password;
    }
    if (req.file) {
      user.image = req.file.filename;
    }
    const updateUser = await user.save();

    res.status(200).json({
      _id: updateUser._id,
      name: updateUser.name,
      email: updateUser.email,
      role: updateUser.role,
      image: updateUser.image,
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// Delete user by id
const deleteUser = asyncHandler(async (req, res) => {
  const result = await User.findByIdAndDelete(req.params.id);

  if (result) {
    res.status(200).json({ message: "User removed" });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

export { registerUser, loginUser, getUsers, getUser, updateUser, deleteUser };
