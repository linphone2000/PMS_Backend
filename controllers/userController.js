import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

// Register
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, employeeID } = req.body;

  // Determine the role based on the employeeID prefix
  let role;
  if (employeeID.length == 6) {
    if (employeeID.startsWith("HA")) {
      role = "headAdmin";
    } else if (employeeID.startsWith("MA")) {
      role = "managerAdmin";
    } else if (employeeID.startsWith("CA")) {
      role = "cashierAdmin";
    } else if (employeeID.startsWith("PA")) {
      role = "pharmacistAdmin";
    } else {
      return res.status(400).json({ message: "Invalid employeeID prefix" });
    }
  } else {
    return res.status(400).json({ message: "Invalid employeeID prefix" });
  }

  // Check for existing user with email
  const existedUser = await User.findOne({ email });
  if (existedUser) {
    return res.status(400).json({ message: "Email already exists" });
  }

  // Check for existing user with employeeID
  const existedUserWithEmployeeID = await User.findOne({ employeeID });
  if (existedUserWithEmployeeID) {
    return res.status(400).json({ message: "Employee ID already exists" });
  }

  const image = req.file ? req.file.filename : null;

  const user = await User.create({
    name,
    email,
    password,
    employeeID,
    role,
    image,
  });

  if (user) {
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      employeeID: user.employeeID,
      image: user.image,
    };
    res.status(200).json({
      message: "Registration success!",
      user: userData,
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
      const userData = {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        employeeID: user.employeeID,
        image: user.image,
      };
      res.status(200).json({ message: "Logged in!", user: userData });
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
  if (users) {
    res.status(200).json({ users });
  } else {
    res.status(404).json({ message: "No users found" });
  }
});

// Get user by id
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      employeeID: user.employeeID,
      image: user.image,
    };
    res.status(200).json({ user: userData });
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
    user.employeeID = req.body.employeeID || user.employeeID;

    // Determine the role based on the employeeID prefix
    let role;
    if (user.employeeID.length == 6) {
      if (user.employeeID.startsWith("HA")) {
        role = "headAdmin";
      } else if (user.employeeID.startsWith("MA")) {
        role = "managerAdmin";
      } else if (user.employeeID.startsWith("CA")) {
        role = "cashierAdmin";
      } else if (user.employeeID.startsWith("PA")) {
        role = "pharmacistAdmin";
      } else {
        return res.status(400).json({ message: "Invalid employeeID prefix" });
      }
    } else {
      return res.status(400).json({ message: "Invalid employeeID prefix" });
    }

    user.role = role || user.role;

    if (req.body.password) {
      user.password = req.body.password;
    }
    if (req.file) {
      user.image = req.file.filename;
    }
    const updateUser = await user.save();
    const userData = {
      _id: updateUser._id,
      name: updateUser.name,
      email: updateUser.email,
      role: updateUser.role,
      image: updateUser.image,
    };

    res.status(200).json({ message: "User updated", user: userData });
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
