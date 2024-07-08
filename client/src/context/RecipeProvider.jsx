/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useEffect, useCallback } from "react";
import { createContext } from "react";
import axios from "axios";

export const RecipesContext = createContext();

const userAxios = axios.create();

userAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default function RecipeProvider(props) {
  const initState = {
    recipes: [],
  };

  const [recipeState, setRecipeState] = useState(initState);

  function addRecipe(newRecipe) {
    userAxios
      .post("/api/recipe", newRecipe)
      .then((res) => {
        console.log("Recipe added", res.data);
        setRecipeState((prevState) => ({
          ...prevState,
          recipes: [...prevState.recipes, res.data],
        }));
      })
      .catch((err) => console.log(err));
  }

  const getUserRecipes = async (userId) => {
    try {
      const response = await userAxios.get(`/api/recipe/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setRecipeState((prevState) => ({
        ...prevState,
        recipes: response.data,
      }));
    } catch (err) {
      console.log(err);
    }
  };

  // Delete user recipe
  function deleteRecipe(recipeId) {
    userAxios
      .delete(`/api/recipe/${recipeId}`)
      .then((res) => {
        setRecipeState((prevState) => ({
          ...prevState,
          recipes: prevState.recipes.filter(
            (recipe) => recipe._id !== recipeId
          ),
        }));
      })
      .catch((err) => console.log(err));
  }

  [];

  // Edit user recipe
  function editRecipe(recipeId, updatedRecipe) {
    userAxios
      .put(`/api/recipe/${recipeId}`, updatedRecipe)
      .then((res) => {
        setRecipeState((prevState) => ({
          ...prevState,
          recipes: prevState.recipes.map((recipe) =>
            recipe._id === recipeId ? res.data : recipe
          ),
        }));
      })
      .catch((err) => console.log(err));
  }

  function likeRecipe(recipeId) {
    userAxios
      .put(`/api/recipe/like/${recipeId}`)
      .then((res) => {
        // find the index of the recipe to update
        const recipeIndex = recipeState.recipes.findIndex(
          (recipe) => recipe._id === recipeId
        );

        // create a new copy of the recipes array with the updated recipe
        const updatedRecipes = [
          ...recipeState.recipes.slice(0, recipeIndex),
          {
            ...recipeState.recipes[recipeIndex],
            likes: res.data,
          },
          ...recipeState.recipes.slice(recipeIndex + 1),
        ];

        // update the state of recipeState with the new array of recipes
        setRecipeState((prevState) => ({
          ...prevState,
          recipes: updatedRecipes,
        }));

        // fetch updated public recipes and update the state
        getPublicRecipes();
      })
      .catch((err) => console.log(err));
  }

  // dislike Recipe
  function dislikeRecipe(recipeId) {
    userAxios
      .put(`/api/recipe/unlike/${recipeId}`)
      .then((res) => {
        console.log("recipe disliked", res.data);
        setRecipeState((prevState) => ({
          ...prevState,
          recipes: prevState.recipes.map((recipe) => {
            if (recipe._id === recipeId) {
              return {
                ...recipe,
                likes: res.data,
              };
            }

            return recipe;
          }),
        }));

        // fetch updated public recipes and update the state
        // getPublicRecipes();
      })
      .catch((err) => console.log(err));
  }

  // Call getUserRecipes and getPublicRecipes on mount
  // useEffect(() => {
  //   getPublicRecipes();
  // }, []);

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
