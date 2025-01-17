import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./home.css";
const Home = () => {
  const [latestRecipes, setLatestRecipes] = useState([]); // Default to an empty array
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // Track user search input
  const [error, setError] = useState(""); // For error messages
  const navigate = useNavigate();
  useEffect(() => {
    const fetchLatestRecipes = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/meals/search", {
          params: { s: searchQuery }, // Use 's' instead of 'f' for search
        });
        const data = response.data;
        // Log the response structure for debugging
        console.log("API Response:", data);
        // Handle null or empty responses gracefully
        if (data && data.meals) {
          setLatestRecipes(data.meals);
          setError(""); // Clear any previous error
        } else {
          setLatestRecipes([]);
          setError("No recipes found for the given search query.");
        }
      } catch (error) {
        console.error("Error fetching latest recipes:", error.message);
        setLatestRecipes([]);
        setError("Failed to fetch recipes. Please try again later.");
      }
      setLoading(false);
    };
    fetchLatestRecipes();
  }, [searchQuery]); // Trigger on search query change
  const navigateToMealDetails = (mealId) => {
    navigate(`/meal/${mealId}`); // Navigate to meal details
  };
  return (
    <div className="home">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search for meals..."
      />
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>{error}</div>
      ) : (
        <ul className="meal-list">
          {latestRecipes.map((recipe) => (
            <li key={recipe.idMeal} className="meal-item">
              <span>{recipe.strMeal}</span>
              <img
                src={recipe.strMealThumb}
                alt={recipe.strMeal}
                className="meal-thumbnail"
              />
              <button onClick={() => navigateToMealDetails(recipe.idMeal)}>
                Show Details
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
export default Home;