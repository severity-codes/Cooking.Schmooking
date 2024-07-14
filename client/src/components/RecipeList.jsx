import React, { useState, useContext, useEffect } from "react";
import PropTypes from "prop-types";
import Recipe from "./Recipe";
import Comment from "./CommentsList";
import CommentsForm from "./CommentsForm";
import { CommentContext } from "../context/CommentProvider";
import { RecipesContext } from "../context/RecipeProvider";
import { UserContext } from "../context/UserProvider";
import "./recipelist.css";
const RecipeList = ({ userId }) => {
  const { comments, getComments } = useContext(CommentContext); // Make sure to use getComments
  const { getUserRecipes, recipes, likeRecipe, dislikeRecipe, deleteRecipe } =
    useContext(RecipesContext);
  const {
    user: { username, _id },
    token,
  } = useContext(UserContext);

  const [currentRecipeId, setCurrentRecipeId] = useState(null);
  const [showComment, setShowComment] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await getUserRecipes(userId);
      if (currentRecipeId) {
        await getComments(currentRecipeId); // Make sure getComments is used here
        setShowComment(true);
      } else {
        setShowComment(false);
      }
    };
    fetchData();
  }, [userId, currentRecipeId, getUserRecipes, getComments]);

  const handleDeleteRecipe = async (recipeId) => {
    await deleteRecipe(recipeId);
    await getUserRecipes(userId); // Fetch updated list of recipes
  };

  const handleLikeRecipe = async (recipeId) => {
    await likeRecipe(recipeId);
    await getUserRecipes(userId); // Fetch updated list of recipes
  };

  const handleDislikeRecipe = async (recipeId) => {
    await dislikeRecipe(recipeId);
    await getUserRecipes(userId); // Fetch updated list of recipes
  };

  return (
    <div className="recipe-list">
      {recipes?.map((recipe) => (
        <div className="comment-section" key={recipe._id}>
          <Recipe
            title={recipe.title}
            description={recipe.description}
            imageUrl={recipe.imageUrl || "default-image-url.jpg"} // Provide default for missing imageUrl
            _id={recipe._id}
            createdAt={recipe.createdAt}
          />
          <span className="likes-counter">
            {recipe.likes.length > 0 && (
              <>
                <i className="fa-solid fa-thumbs-up"></i>
                {(() => {
                  const userLike = recipe.likes.some(
                    (like) => like.user === userId
                  );
                  const otherLikesCount =
                    recipe.likes.length - (userLike ? 1 : 0);
                  if (userLike && otherLikesCount > 0) {
                    return `You and ${otherLikesCount} others`;
                  } else if (userLike) {
                    return `You`;
                  } else {
                    return `${otherLikesCount}`;
                  }
                })()}
              </>
            )}
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
};

RecipeList.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default RecipeList;
