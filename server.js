const express = require("express");
const { json, static } = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

// Environment variables
const PORT = process.env.PORT || 9080;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/Recipes";

// CORS Configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || "http://localhost:5178",
  optionsSuccessStatus: 200,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Content-Type,Authorization",
};

const app = express();

// Middlewares
app.use(json());
app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(static(path.join(__dirname, "client", "build")));

// MongoDB Connection
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Error connecting to MongoDB: ", err));

// Routes
const authRouter = require("./routes/authRouter.js");
const mealsRouter = require("./routes/mealsRouter.js");
const commentsRouter = require("./routes/commentsRouter.js");
const recipeRouter = require("./routes/recipeRouter.js");

app.use("/auth", authRouter);
app.use("/api/meals", mealsRouter);
app.use("/api/recipe", recipeRouter);
app.use("/api/comment", commentsRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  const statusCode = err.status || 500;
  res.status(statusCode).send({ errMsg: err.message });
});

app.use(static(path.join(__dirname, "client", "dist")));

// Right before your app.listen(), add this:
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
