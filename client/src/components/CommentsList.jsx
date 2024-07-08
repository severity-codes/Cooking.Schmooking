/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useContext, useEffect } from "react";
import Comment from "./Comment";

import CommentContext from "../context/CommentProvider"
function Comments({ recipeId, comments }) {
  const { getComments } = useContext(CommentContext);

  useEffect(() => {
    getComments(recipeId);
  }, [recipeId]);

  // If comments are not available yet, initialize it as an empty array
  const commentsArray = comments || [];

  return (
    <div className="comment-list">
      {commentsArray.map((comment) => (
        <Comment {...comment} key={comment._id} recipeId={recipeId} />
      ))}
    </div>
  );
}

// Set default prop values
Comments.defaultProps = {
  comments: [],
};

export default Comments;
