import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [latestRecipes, setLatestRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const fetchLatestRecipes = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/meals/search", {
        params: { f: searchQuery },
      });
      const data = response.data;
      setLatestRecipes(data.meals || []);
    } catch (error) {
      console.error("Error fetching latest recipes:", error);
      setLatestRecipes([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLatestRecipes();
  }, [searchQuery]); // Include searchQuery in dependency array

  const navigateToMealDetails = (mealId) => {
    navigate(`/meal/${mealId}`);
  };

  return (
    <div className="home">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchLatestRecipes();
        }}
      >
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for meals..."
        />
        <button type="submit">Search</button>
      </form>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul>
          {latestRecipes.map((recipe) => (
            <li key={recipe.idMeal}>
              <div>{recipe.strMeal}</div>
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