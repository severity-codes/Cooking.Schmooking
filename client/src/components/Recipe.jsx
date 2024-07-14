import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import Dropdown from "react-bootstrap/Dropdown";
import Modal from "react-bootstrap/Modal";

// Contexts
import { UserContext } from "../context/UserProvider";
import { RecipesContext } from "../context/RecipeProvider";

export default function Recipe({
  title,
  description,
  imageUrl = "default-image-url.jpg", // Default image URL
  _id,
  createdAt,
}) {
  if (!title || !description || !_id || !createdAt) {
    console.error("Required props missing:", { title, description, _id, createdAt });
    return null; // or handle the error case as needed
  }

  const {
    token,
    user: { username },
  } = useContext(UserContext);

  const { editRecipe, deleteRecipe, likeRecipe } = useContext(RecipesContext);

  const [recipe, setRecipe] = useState({
    title,
    description,
    imageUrl,
  });

  // Log initial props
  console.log('Initial Props:', { title, description, imageUrl, _id, createdAt });
  // Log state updates 
  console.log('Recipe State:', recipe);

  const [isEditing, setIsEditing] = useState(false);
  const [show, setShow] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const handleShow = () => setShow(true);
  const handleClose = () => {
    setShow(false);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
    handleShow();
  };

  const handleDelete = () => {
    deleteRecipe(_id);
  };

  const handleSave = () => {
    editRecipe(_id, recipe);
    handleClose();
  };

  const handleLike = () => {
    likeRecipe(_id);
    setIsLiked(!isLiked);
  };

  // Capitalize first letter
  const firstLetter = token && username ? username.charAt(0).toUpperCase() : "";
  const usernameCased = username
    ? username.charAt(0).toUpperCase() + username.slice(1).toLowerCase()
    : "";

  // Calculate the time elapsed since the recipe was posted
  const timeElapsedInSeconds = (Date.now() - new Date(createdAt)) / 1000; // in seconds
  const timeElapsedStr = new Intl.RelativeTimeFormat("en", {
    numeric: "auto",
  }).format(
    -Math.floor(timeElapsedInSeconds / 60),
    timeElapsedInSeconds < 3600 ? "minute" : "hour"
  );

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
            <p className="recipe-des">{recipe.description}</p>
            <img
              className="recipe-img"
              src={recipe.imageUrl}
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

Recipe.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  imageUrl: PropTypes.string,
  _id: PropTypes.string.isRequired,
  createdAt: PropTypes.string.isRequired,
};
