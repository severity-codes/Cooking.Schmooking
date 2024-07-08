/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useContext, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import Modal from "react-bootstrap/Modal";

// Contexts
import { UserContext } from "../context/UserProvider";
import { RecipesContext } from "../context/RecipeProvider";

export default function Recipe(props) {
  const { title, description, imageUrl, _id, createdAt } = props;

  const {
    token,
    user: { username },
  } = useContext(UserContext);

  const { editRecipe, deleteRecipe } = useContext(RecipesContext);

  const [recipe, setRecipe] = useState({
    title,
    description,
    imageUrl,
  });

  const [isEditing, setIsEditing] = useState(false);

  const [show, setShow] = useState(false);
  const [isliked, setIsliked] = useState(false);
  const handleShow = () => setShow(true);

  const handleClose = () => {
    setShow(false);
    setIsEditing(!isEditing);
  };

  function handleEdit() {
    setIsEditing(!isEditing);
    handleShow();
  }

  function handleDelete() {
    deleteRecipe(_id);
  }

  function handleSave() {
    editRecipe(_id, recipe);
    setIsEditing(false);
    handleClose();
  }

  function handleLike() {
    likeRecipe(_id);
    setIsliked(true);
    setIsliked(!isliked);
    handleClose();
  }

  // Capitalize first letter
  const firstLetter = token && username ? username.charAt(0).toUpperCase() : "";
  const usernameCased = username
    ? username.charAt(0).toUpperCase() + username.slice(1).toLowerCase()
    : "";

  // Calculate the time elapsed since the recipe was posted
  const ONE_MINUTE = 60;
  const ONE_HOUR = 60 * ONE_MINUTE;
  const ONE_DAY = 24 * ONE_HOUR;
  let timeElapsedStr = "";
  const timeElapsed = Math.floor((Date.now() - new Date(createdAt)) / 1000); // in seconds

  if (timeElapsed < ONE_MINUTE) {
    timeElapsedStr = `${timeElapsed} seconds ago`;
  } else if (timeElapsed < ONE_HOUR) {
    const minutes = Math.floor(timeElapsed / ONE_MINUTE);
    timeElapsedStr = `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else if (timeElapsed < ONE_DAY) {
    const hours = Math.floor(timeElapsed / ONE_HOUR);
    timeElapsedStr = `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else {
    const days = Math.floor(timeElapsed / ONE_DAY);
    timeElapsedStr = `${days} day${days > 1 ? "s" : ""} ago`;
  }

  return (
    <div className="recipe-container">
      <div>
        <div className="user-info">
          <div className="profile-pic">{firstLetter}</div>
          <div className="name-time">
            <div>
              <h3>{usernameCased}</h3>
              <p>{timeElapsedStr}</p>
            </div>
            <div className="dropdown">
              <Dropdown drop="start">
                <Dropdown.Toggle
                  className="text-dark bg-transparent border-0"
                  variant="success"
                  id="dropdown-basic"
                  size="lg"
                >
                  Options
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={handleEdit}>Edit</Dropdown.Item>
                  <Dropdown.Item onClick={handleDelete}>Delete</Dropdown.Item>
                  <Dropdown.Item onClick={handleSave}>Save</Dropdown.Item>

                  <Dropdown.Item onClick={handleLike}>Like</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </div>
        <div className="recipe-wrapper">
          <div className="recipe-div">
            <h3 className="recipe-title">{recipe.title}</h3>
            <p className="recipe-des">{description}</p>
            <img
              className="recipe-img"
              src={imageUrl}
              alt={title}
              width={300}
            />
          </div>
        </div>
      </div>
      <>
        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit Recipe</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input
              className="popup-input"
              value={recipe.title}
              onChange={(e) => setRecipe({ ...recipe, title: e.target.value })}
              placeholder="Title"
            />
            <input
              className="popup-input"
              value={recipe.imageUrl}
              onChange={(e) =>
                setRecipe({ ...recipe, imageUrl: e.target.value })
              }

              placeholder="Image URL"
            />
            <textarea
              className="popup-textarea"
              value={recipe.description}
              rows="6"
              onChange={(e) =>
                setRecipe({ ...recipe, description: e.target.value })
              }

              placeholder="Description"
            />
          </Modal.Body>
          <Modal.Footer>
            <button onClick={handleClose}>Close</button>
            <button onClick={handleSave}>Save</button>
          </Modal.Footer>
        </Modal>
      </>
    </div>
  );
}
