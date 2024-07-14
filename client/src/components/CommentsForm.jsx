import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import { CommentContext } from "../context/CommentProvider";
import { UserContext } from "../context/UserProvider";
import "./commentform.css";
import Comment from './Comment.jsx'
const CommentForm = ({ recipeId }) => {
  // Initialize input state
  const initInputs = { comment: "" };
  const [inputs, setInputs] = useState(initInputs);
  
  // Retrieve context values

  const { addComment, getComments, editComment, deleteComment } = useContext(CommentContext);
  const { user, token } = useContext(UserContext);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!user?._id) throw new Error("User ID not found");

      const firstLetter = user?.username?.charAt(0).toUpperCase() || "";
      const payload = { user: user._id, comment: `${firstLetter}: ${inputs.comment}` };
      await addComment(recipeId, payload);
      setInputs(initInputs); // Reset input
    } catch (error) {
      console.error("Failed to add comment", error);
    }
  };

  // Render component conditionally based on token presence
  if (!token) {
    return null;
  }

  const { comment } = inputs;
  const firstLetter = user?.username?.charAt(0).toUpperCase() || "";

  return (
    <div className="comment-form-wrapper">
      <div className="profile-pic">{firstLetter}</div>
      <form className="comment-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="comment"
          value={comment}
          onChange={handleChange}
          placeholder="Write a comment..."
        />
        <button type="submit" className="comment-submit-btn">
          <i className="fa-regular fa-paper-plane"></i> Post Comment
        </button>
      </form>
    </div>
  );
};

CommentForm.propTypes = {
  recipeId: PropTypes.string.isRequired,
};

export default CommentForm;
