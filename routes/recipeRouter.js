const express = require("express");
const recipeRouter = express.Router();


const User = require("../models/User");
// Import the Recipe model
const Recipe = require("../models/Recipe");
const { expressjwt: expressJwt } = require("express-jwt");

expressJwt({ secret: process.env.SECRET, algorithms: ["HS256"] }),




// Get All Recipes from MongoDB
recipeRouter.get("/", async (req, res, next) => {
  try {
    const recipes = await Recipe.find()
      .sort({ createdAt: -1 })
      .populate("user", "username profileImage");
    res.status(200).send(recipes);
  } catch (err) {
    res.status(500);
    return next(err);
  }
});

recipeRouter.get(
  "/user/:id",
  expressJwt({ secret: process.env.SECRET, algorithms: ["HS256"] }),
  async (req, res, next) => {
    try {
      const recipes = await Recipe.find({ user: req.auth._id })
        .sort({ createdAt: -1 })
        .populate("user", "username profileImage");
      res.status(200).send(recipes);
    } catch (err) {
      res.status(500);
      return next(err);
    }
  }
);

// Add new Recipe to MongoDB

recipeRouter.post(
  "/",
  expressJwt({ secret: process.env.SECRET, algorithms: ["HS256"] }),
  async (req, res, next) => {
    try {
      req.body.user = req.auth._id;
      const newRecipe = new Recipe(req.body);
      const savedRecipe = await newRecipe.save();
      const populatedRecipe = await savedRecipe.populate(
        "user",
        "username profileImage"
      );
      res.status(201).send(populatedRecipe);
    } catch (err) {
      res.status(500);
      return next(err);
    }
  }
);

// Delete Recipe from MongoDB
recipeRouter.delete(
  "/:recipeId",
  expressJwt({ secret: process.env.SECRET, algorithms: ["HS256"] }),
  async (req, res, next) => {
    try {
      const deletedRecipe = await Recipe.findOneAndDelete({
        _id: req.params.recipeId,
        user: req.auth._id,
      }).populate("user", "username profileImage");
      res.status(200).send(`Successfully delete recipe: ${deletedRecipe.title}`);
    } catch (err) {
      res.status(500);
      return next(err);
    }
  }
);
recipeRouter.put(
  "/:recipeId",
 expressJwt({ secret: process.env.SECRET, algorithms: ["HS256"] }),
  async (req, res, next) => {
    try {
      const updatedRecipe = await Recipe.findOneAndUpdate(
        { _id: req.params.recipeId, user: req.auth._id },
        req.body,
        { new: true }
      ).populate("user", "username profileImage");
      res.status(201).send(updatedRecipe);
    } catch (err) {
      res.status(500);
      return next(err);
    }
  }
);


recipeRouter.put(
  "/like/:id",
  expressJwt({ secret: process.env.SECRET, algorithms: ["HS256"] }),
  async (req, res) => {
    try {
      const recipe = await Recipe.findById(req.params.id);
      const userId = req.auth._id;
      const username = req.auth.username;
      console.log(username);

      if (!recipe) {
        return res.status(404).json({ msg: "recipe not found" });
      }

      if (recipe.likes.some((like) => like.user.toString() === userId)) {
        return res.status(400).json({ msg: "recipe already liked" });
      }

      recipe.likes.push({ user: userId, username: username });
      await recipe.save();

      res.json(recipe.likes);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   PUT api/issues/unlike/:id
// @des     Unlike an issue
// @access  Private
recipeRouter.put(
  "/unlike/:id",
expressJwt({ secret: process.env.SECRET, algorithms: ["HS256"] }),
  async (req, res) => {
    try {
      const recipe = await Recipe.findById(req.params.id);
      const userId = req.auth._id;

      // Check if the issue has already been liked
      if (
        recipe.likes.filter((like) => like.user.toString() === userId).length ===
        0
      ) {
        return res.status(400).json({ msg: "Recipe has not yet been liked" });
      }

      // Get remove index
      const removeIndex = recipe.likes
        .map((like) => like.user.toString())
        .indexOf(userId);

      recipe.likes.splice(removeIndex, 1);

      await recipe.save();

      res.json(recipe.likes);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = recipeRouter;
