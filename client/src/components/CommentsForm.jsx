/* eslint-disable react/prop-types */

import React, { useContext } from "react";
import { CommentContext } from "../context/CommentProvider";
import { UserContext } from "../context/UserProvider";

const CommentForm = ({ recipeId }) => {
  const initInputs = { comment: "" };
  const [inputs, setInputs] = React.useState(initInputs);
  const { addComment } = useContext(CommentContext);
  const { user, token } = useContext(UserContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { user: user._id, comment: inputs.comment };
    addComment(recipeId, payload);
    setInputs(initInputs);
  };

  if (!token) {
    return null; // or render some other component instead
  }

  const { comment } = inputs;
  const firstLetter = user.username
    ? user.username.charAt(0).toUpperCase()
    : "";

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
          <i className="fa-regular fa-paper-plane"></i>
        </button>
      </form>
    </div>
  );
};

export default CommentForm;
