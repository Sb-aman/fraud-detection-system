import { NavLink, Link, useNavigate } from "react-router-dom";
import { ShieldCheck, LogOut } from "lucide-react";
import toast from "react-hot-toast";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    toast.success("Logged out");
    navigate("/login");
  };

  const linkClass = ({ isActive }) => (isActive ? "nav-link active" : "nav-link");

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="nav-brand">
        <ShieldCheck size={22} />
        FraudGuard
      </Link>

      <div className="nav-links">
        <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
        <NavLink to="/send-money" className={linkClass}>Send Money</NavLink>
        <NavLink to="/transactions" className={linkClass}>Transactions</NavLink>

        <button onClick={handleLogout} className="logout-btn">
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
