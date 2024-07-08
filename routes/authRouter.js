const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const authRouter = express.Router();
const SECRET = process.env.SECRET || "default_secret"; // Fallback secret

// Helper function to generate JWT token
const generateToken = (user) => jwt.sign(user.withoutPassword(), SECRET);

// Helper function to handle errors
const handleError = (res, error, statusCode = 500) => {
  console.error(error);
  res.status(statusCode).send({ error: error.message });
};

// Signup route
authRouter.post("/signup", async (req, res, next) => {
  try {
    const existingUser = await User.findOne({
      username: req.body.username.toLowerCase(),
    });
    if (existingUser) {
      return handleError(res, new Error("That username is already taken"), 403);
    }
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    const token = generateToken(savedUser);
    return res.status(201).send({ token, user: savedUser.withoutPassword() });
  } catch (err) {
    return handleError(res, err);
  }
});

// Login route
authRouter.post("/login", async (req, res, next) => {
  try {
    const user = await User.findOne({
      username: req.body.username.toLowerCase(),
    });
    if (!user) {
      return handleError(
        res,
        new Error("Username or Password are incorrect"),
        403
      );
    }
    user.checkPassword(req.body.password, (err, isMatch) => {
      if (err || !isMatch) {
        return handleError(
          res,
          new Error("Username or Password are incorrect"),
          403
        );
      }
      const token = generateToken(user);
      return res.status(200).send({ token, user: user.withoutPassword() });
    });
  } catch (err) {
    return handleError(res, err);
  }
});

// Update user information
authRouter.put("/user/:id", async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) {
      return handleError(res, new Error("User not found"), 404);
    }
    const token = generateToken(user);
    return res.status(200).send({ token, user: user.withoutPassword() });
  } catch (err) {
    return handleError(res, err);
  }
});

// Get user information by ID
authRouter.get("/users/:id", async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return handleError(res, new Error("User not found"), 404);
    }
    const token = generateToken(user);
    return res.status(200).send({ token, user: user.withoutPassword() });
  } catch (err) {
    return handleError(res, err);
  }
});

module.exports = authRouter;
