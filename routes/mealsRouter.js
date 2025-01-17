const express = require("express");
const axios = require("axios");
require("dotenv").config();
const mealsRouter = express.Router();
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
mealsRouter.get("/details/:mealId", async (req, res) => {
  const { mealId } = req.params;
  const options = {
    method: "GET",
    url: "www.themealdb.com/api/json/v1/1/search.php?s=Arrabiata",
    params: { i: mealId }, // Use the mealId from the route parameter
    headers: {
      "X-RapidAPI-Key": RAPIDAPI_KEY,
      "X-RapidAPI-Host": "themealdb.com",
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
      "www.themealdb.com/api/json/v1/1/search.php?s=Arrabiata",
      {
        params: { s: query }, // Pass the search query to the external API
        headers: {
          "X-RapidAPI-Key": RAPIDAPI_KEY,
          "X-RapidAPI-Host": "themeal",
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