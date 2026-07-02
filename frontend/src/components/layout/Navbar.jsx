import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FaBell, FaUser, FaSearch } from "react-icons/fa";
import { notificationAPI } from "../../services/api";

const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationAPI.getCount();
      setUnreadCount(response.data.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  return (
    <div className="top-navbar d-flex justify-content-between align-items-center">
      <form
        className="d-flex align-items-center"
        style={{ maxWidth: "400px", width: "100%" }}
      ></form>
      ,
      <div className="d-flex align-items-center gap-3">
        <button
          className="btn btn-link position-relative text-dark"
          onClick={() => navigate("/notifications")}
        >
          <FaBell size={20} />
          {unreadCount > 0 && (
            <span className="notification-badge">{unreadCount}</span>
          )}
        </button>
        <div className="d-flex align-items-center gap-2">
          <div
            className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
            style={{ width: "36px", height: "36px", cursor: "pointer" }}
            onClick={() => navigate("/profile")}
          >
            <FaUser size={14} />
          </div>
          <span className="fw-medium d-none d-md-block">
            {user?.fullName || user?.username}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
