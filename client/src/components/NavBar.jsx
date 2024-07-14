import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import logo from "../assets/cookingschm.png";
import "./nav.css"
function NavBar({ logout }) {
  return (
    <nav className="navbar">
      <header>
        <img src={logo} alt="Cooking Schmooking Logo" />
        <h1>Cooking Schmooking</h1>
      </header>
      <div role="navigation" aria-label="Main Navigation">
        <Link to="/">Home</Link>
        <Link to="/profile">Profile</Link>
      </div>

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
