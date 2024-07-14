import React, { useState, useEffect, createContext, useCallback } from "react";
import axios from "axios";

export const RecipesContext = createContext();

const userAxios = axios.create();

userAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default function RecipeProvider(props) {
  const initState = {
    recipes: [],
  };

  const [recipeState, setRecipeState] = useState(initState);

  const addRecipe = useCallback(async (newRecipe) => {
    try {
      const res = await userAxios.post("/api/recipe", newRecipe);
      setRecipeState((prevState) => ({
        ...prevState,
        recipes: [...prevState.recipes, res.data],
      }));
    } catch (err) {
      console.error(err);
    }
  }, []);

  const getUserRecipes = useCallback(async (userId) => {
    try {
      const response = await userAxios.get(`/api/recipe/user/${userId}`);
      setRecipeState((prevState) => ({
        ...prevState,
        recipes: response.data,
      }));
    } catch (err) {
      console.error(err);
    }
  }, []);

  const deleteRecipe = useCallback(async (recipeId) => {
    try {
      await userAxios.delete(`/api/recipe/${recipeId}`);
      setRecipeState((prevState) => ({
        ...prevState,
        recipes: prevState.recipes.filter((recipe) => recipe._id !== recipeId),
      }));
    } catch (err) {
      console.error(err);
    }
  }, []);

  const editRecipe = useCallback(async (recipeId, updatedRecipe) => {
    try {
      const res = await userAxios.put(`/api/recipe/${recipeId}`, updatedRecipe);
      setRecipeState((prevState) => ({
        ...prevState,
        recipes: prevState.recipes.map((recipe) =>
          recipe._id === recipeId ? res.data : recipe
        ),
      }));
    } catch (err) {
      console.error(err);
    }
  }, []);

  const likeRecipe = useCallback(async (recipeId) => {
    try {
      const res = await userAxios.put(`/api/recipe/like/${recipeId}`);
      setRecipeState((prevState) => ({
        ...prevState,
        recipes: prevState.recipes.map((recipe) =>
          recipe._id === recipeId ? { ...recipe, likes: res.data } : recipe
        ),
      }));
    } catch (err) {
      console.error(err);
    }
  }, []);

  const dislikeRecipe = useCallback(async (recipeId) => {
    try {
      const res = await userAxios.put(`/api/recipe/unlike/${recipeId}`);
      setRecipeState((prevState) => ({
        ...prevState,
        recipes: prevState.recipes.map((recipe) =>
          recipe._id === recipeId ? { ...recipe, likes: res.data } : recipe
        ),
      }));
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    const someUserId = "someUserId"; // Replace with actual user ID as required
    getUserRecipes(someUserId);
  }, [getUserRecipes]);

  return (
    <RecipesContext.Provider
      value={{
        ...recipeState,
        addRecipe,
        deleteRecipe,
        editRecipe,
        getUserRecipes,
        likeRecipe,
        dislikeRecipe,
      }}
    >
      {props.children}
    </RecipesContext.Provider>
  );
}
