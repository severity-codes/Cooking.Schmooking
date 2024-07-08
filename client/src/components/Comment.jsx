/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useContext } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { CommentContext } from "../context/CommentProvider";
import { UserContext } from "../context/UserProvider";
function Comment(props) {
  const { comment, _id, recipeId, user, createdAt } = props;

  // const firstLetter = user?.username?.charAt(0).toUpperCase() || "";
  // const usernameCased =
  // user?.username?.charAt(0).toUpperCase() +
  //   user?.username?.slice(1).toLowerCase() || "";

  const { deleteComment } = useContext(CommentContext);

  function handleDelete() {
    deleteComment(recipeId, _id);
  }

  // added moment to show time from now
  const formattedTime = moment(createdAt).fromNow();

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

export default Comment;
