import React, { useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { CommentContext } from "../context/CommentProvider";
import CommentForm from "./CommentsForm"; // Fixed typo
import Comment from "./Comment";
import "./commentlist.css";
const CommentsList = ({ recipeId }) => {
  const { comments, getComments, deleteComment, editComment } =
    useContext(CommentContext);
  useEffect(() => {
    if (recipeId) {
      getComments(recipeId);
    }
  }, [recipeId, getComments]); // Ensure getComments is stable (e.g., using useCallback)
  if (!comments) {
    return <div className="loading-comments">Loading comments...</div>;
  }
  return (
    <div className="comments-container">
      {comments.length > 0 ? (
        comments.map((comment) => (
          <Comment
            key={comment._id}
            {...comment}
            recipeId={recipeId}
            onDelete={() => deleteComment(comment._id)}
            onEdit={(updatedComment) =>
              editComment(comment._id, updatedComment)
            }
          />
        ))
      ) : (
        <div className="no-comments">No comments yet.</div>
      )}
    </div>
  );
};
CommentsList.propTypes = {
  recipeId: PropTypes.string.isRequired,
};
export default CommentsList;