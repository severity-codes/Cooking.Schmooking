import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import logo from "../assets/cookingschm.png";
function NavBar({ logout }) {
  return (
    <nav className="navbar">
      <img src={logo} alt="Logo" />
      <h1>Cooking Schmooking</h1>
      <Link to="/">Home</Link>
      <Link to="/profile">Profile</Link>

      <button className="logout" onClick={logout} aria-label="Logout">
        Logout
      </button>
    </nav>
  );
}

NavBar.propTypes = {
  logout: PropTypes.func.isRequired,
};

export default NavBar;
