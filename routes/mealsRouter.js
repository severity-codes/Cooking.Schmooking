const express = require("express");
const axios = require("axios");
require("dotenv").config();
const mealsRouter = express.Router();
const API_KEY = process.env.RAPIDAPI_KEY || "1"; // Default to '1' if no env variable
// Route to fetch meal details by ID
mealsRouter.get("/details/:mealId", async (req, res) => {
  const { mealId } = req.params;
  try {
    const response = await axios.get(
      `https://www.themealdb.com/api/json/v1/${API_KEY}/lookup.php`,
      { params: { i: mealId } } // Pass the mealId as query parameter
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching meal details:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// Route to search for meals by name
mealsRouter.get("/search", async (req, res) => {
  const { s: query } = req.query; // Extract the search query from the request query parameters
  try {
    const response = await axios.get(
      `https://www.themealdb.com/api/json/v1/${API_KEY}/search.php`,
      { params: { s: query } } // Pass the search query to the external API
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error searching recipes:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
module.exports = mealsRouter;