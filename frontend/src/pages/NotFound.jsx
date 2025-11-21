import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="page-center">
    <h1>Page not found</h1>
    <Link to="/" className="btn">
      Go home
    </Link>
  </div>
);

export default NotFound;

