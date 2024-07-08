import React, { useState, useContext, useEffect } from "react";
import Recipe from "./Recipe";
import Comments from "./CommentsList";
import CommentForm from "./CommentsForm";
import { CommentContext } from "../context/CommentProvider";
import { RecipesContext } from "../context/RecipeProvider";
import { UserContext } from "../context/UserProvider";

export default function RecipeList({ userId }) {
  const { comments, getComments } = useContext(CommentContext);
  const { getUserRecipes, recipes, likeRecipe, dislikeRecipe, deleteRecipe } =
    useContext(RecipesContext);
  const {
    user: { username, _id },
    token,
  } = useContext(UserContext);
  const [currentRecipeId, setCurrentRecipeId] = useState(null);
  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await getUserRecipes(userId);
      if (currentRecipeId) {
        getComments(currentRecipeId);
        setShowComments(true);
      } else {
        setShowComments(false);
      }
    };
    fetchData();
  }, [userId, currentRecipeId]);

  const handleDeleteRecipe = async (recipeId) => {
    await deleteRecipe(recipeId);
    // After deletion, fetch the updated list of recipes
    await getUserRecipes(userId);
  };

  const handleLikeRecipe = async (recipeId) => {
    await likeRecipe(recipeId);
    // After liking, fetch the updated list of recipes
    await getUserRecipes(userId);
  };

  const handleDislikeRecipe = async (recipeId) => {
    await dislikeRecipe(recipeId);
    // After disliking, fetch the updated list of recipes
    await getUserRecipes(userId);
  };

  return (
    <div className="recipe-list">
      {recipes?.map((recipe) => (
        <div className="comment-section" key={recipe._id}>
          <Recipe {...recipe} />
          <span className="likes-counter">
            {recipe.likes.length === 0 ? (
              ""
            ) : (
              <i className="fa-solid fa-thumbs-up"></i>
            )}
            {(() => {
              const userLike = recipe.likes.filter(
                (like) => like.user === userId
              );
              const otherLikes = recipe.likes.length - userLike.length;
              if (userLike.length > 0 && otherLikes > 2) {
                return `You and ${otherLikes} others`;
              } else if (userLike.length > 0 && otherLikes === 0) {
                return `${username}`;
              } else if (userLike.length === 0 && otherLikes === 0) {
                return "";
              } else if (userLike.length === 0 && otherLikes === 1) {
                return `${recipe.likes?.map((like) => `${like.username}`)}`;
              } else if (userLike.length > 0 && otherLikes === 1) {
                return `${recipe.likes
                  ?.map((like) => `${like.username}`)
                  .join(" and ")}`;
              } else {
                return `${otherLikes}`;
              }
            })()}
          </span>
          <button onClick={() => handleLikeRecipe(recipe._id)}>Like</button>
          <button onClick={() => handleDislikeRecipe(recipe._id)}>
            Dislike
          </button>
          <button onClick={() => handleDeleteRecipe(recipe._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
