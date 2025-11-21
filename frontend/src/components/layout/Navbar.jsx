import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <span className="brand">Fitness & Meal Tracker</span>
        <nav>
          <NavLink to="/" end>
            Dashboard
          </NavLink>
          <NavLink to="/workouts">Workouts</NavLink>
          <NavLink to="/meals">Meals</NavLink>
          <NavLink to="/exercises">Exercises</NavLink>
          <NavLink to="/suggestions">Meal Suggestions</NavLink>
        </nav>
      </div>
      <div className="header-right">
        {user && (
          <>
            <span className="user-chip">{user.name}</span>
            <button type="button" onClick={handleLogout} className="btn btn-ghost">
              Logout
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;

