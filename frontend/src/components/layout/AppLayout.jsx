import { Outlet } from "react-router-dom";
import Navbar from "./Navbar.jsx";

const AppLayout = () => (
  <div className="app-shell">
    <Navbar />
    <main className="app-main">
      <Outlet />
    </main>
  </div>
);

export default AppLayout;

