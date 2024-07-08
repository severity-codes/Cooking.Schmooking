
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const MealDetails = () => {
  const { mealId } = useParams();
  const [mealDetails, setMealDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMealDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/meals/details/${mealId}`);
        const mealData = response.data.meals[0];
        setMealDetails(mealData);
      } catch (error) {
        console.error("Error fetching meal details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (mealId) {
      fetchMealDetails();
    }
  }, [mealId]);

  const getIngredients = () => {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = mealDetails[`strIngredient${i}`];
      const measure = mealDetails[`strMeasure${i}`];
      if (ingredient && ingredient !== "") {
        ingredients.push(`${measure} ${ingredient}`);
      }
    }
    return ingredients;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!mealDetails) {
    return <div>No meal details found</div>;
  }

  const ingredientsList = getIngredients();

  return (
    <div>
      <h2>{mealDetails.strMeal}</h2>
      <img src={mealDetails.strMealThumb} alt={mealDetails.strMeal} />
      <h3>Ingredients:</h3>
      <ul>
        {ingredientsList.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>
      <h3>Instructions:</h3>
      <p>{mealDetails.strInstructions}</p>

      <h4>Category</h4>

      <p>{mealDetails.strArea}</p>
      <h3>You Tube Video:</h3>
      {mealDetails.strYoutube && (
        <iframe
          width="560"
          height="315"
          src={`https://www.youtube.com/embed/${mealDetails.strYoutube.split("=")[1]}`}
          title={mealDetails.strMeal}
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      )}



    </div>
  );
};

export default MealDetails;
