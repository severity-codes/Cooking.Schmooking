const express = require("express");
const axios = require("axios");
require("dotenv").config();

const mealsRouter = express.Router();
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
mealsRouter.get("/details/:mealId", async (req, res) => {
  const { mealId } = req.params;
  const options = {
    method: "GET",
    url: "https://themealdb.p.rapidapi.com/lookup.php",
    params: { i: mealId }, // Use the mealId from the route parameter
    headers: {
      "X-RapidAPI-Key": RAPIDAPI_KEY,
      "X-RapidAPI-Host": "themealdb.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching meal details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to search for meals
mealsRouter.get("/search", async (req, res) => {
  const { f: query } = req.query; // Extract the search query from the request query parameters
  try {
    const response = await axios.get(
      "https://themealdb.p.rapidapi.com/search.php",
      {
        params: { s: query }, // Pass the search query to the external API
        headers: {
          "X-RapidAPI-Key": RAPIDAPI_KEY,
          "X-RapidAPI-Host": "themealdb.p.rapidapi.com",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error searching recipes:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = mealsRouter;
