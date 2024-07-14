import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './home.css'
const Home = () => {
  const [latestRecipes, setLatestRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchLatestRecipes = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/meals/search", {
          params: { f: searchQuery },
        });
        const data = response.data;
        setLatestRecipes(data.meals || []);
        setError("");
      } catch (error) {
        console.error("Error fetching latest recipes:", error);
        setLatestRecipes([]);
        setError("Failed to fetch recipes. Please try again later.");
      }

      setLoading(false);
    };

    fetchLatestRecipes();
  }, [searchQuery, navigate]); // Include 'navigate' in dependency array

  const navigateToMealDetails = (mealId) => {
    navigate(`/meal/${mealId}`);
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
        <ul>
          {latestRecipes.map((recipe) => (
            <li key={recipe.idMeal}>
              <span>{recipe.strMeal}</span>
              <img src={recipe.strMealThumb} alt={recipe.strMeal} />
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
