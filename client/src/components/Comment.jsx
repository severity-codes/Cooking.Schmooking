import React, { useContext } from "react";
import PropTypes from "prop-types";
import Dropdown from "react-bootstrap/Dropdown";
import { CommentContext } from "../context/CommentProvider";
import { UserContext } from "../context/UserProvider";
import moment from "moment";

function Comment(props) {
  const { comment, _id, recipeId, user = {}, createdAt } = props;

  // Handle first letter and cased username
  const firstLetter = user.username?.charAt(0).toUpperCase() || "";
  const usernameCased = user.username
    ? `${user.username.charAt(0).toUpperCase()}${user.username.slice(1).toLowerCase()}`
    : "";

  const { deleteComment } = useContext(CommentContext);

  function handleDelete() {
    deleteComment(recipeId, _id);
  }

  // Check if createdAt is valid date
  const formattedTime = moment(createdAt).isValid() ? moment(createdAt).fromNow() : "Unknown time";

  const { token, user: currentUser } = useContext(UserContext);

  // Only show the dropdown if the user is logged in and the user made the comment
  const showDropdown = !!currentUser && !!token && currentUser._id === user._id;

  return (
    <div className="comment-container">
      <div className="profile-pic">{firstLetter}</div>
      <div className="comment-layout">
        <div className="comment">
          <div className="comment-content">
            <h3>{usernameCased}</h3>
            <p>{comment}</p>
          </div>
          {showDropdown && (
            <Dropdown drop="start">
              <Dropdown.Toggle
                variant="success"
                id="dropdown-basic"
                className="text-dark bg-transparent border-0"
              ></Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={handleDelete}>Delete</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>
        <div className="comment-btns">
          <p>{formattedTime}</p>
        </div>
      </div>
    </div>
  );
}

// Adding PropTypes
Comment.propTypes = {
  comment: PropTypes.string.isRequired,
  _id: PropTypes.string.isRequired,
  recipeId: PropTypes.string.isRequired,
  user: PropTypes.shape({
    _id: PropTypes.string,
    username: PropTypes.string
  }),
  createdAt: PropTypes.string.isRequired
};

export default Comment;
