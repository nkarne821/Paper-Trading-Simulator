import { useState, useEffect } from "react";
import { notificationAPI } from "../services/api";
import {
  FaBell,
  FaCheck,
  FaShoppingCart,
  FaSellcast,
  FaChartLine,
  FaInfoCircle,
} from "react-icons/fa";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await notificationAPI.getAll();
      setNotifications(response.data.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationAPI.markAllRead();
      const updated = notifications.map((n) => ({ ...n, isRead: true }));
      setNotifications(updated);
    } catch (error) {
      console.error("Error marking all read:", error);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await notificationAPI.markRead(id);
      const updated = notifications.map((n) => {
        if (n.id === id) {
          return { ...n, isRead: true };
        }
        return n;
      });
      setNotifications(updated);
    } catch (error) {
      console.error("Error marking read:", error);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "BUY":
        return <FaShoppingCart className="text-success" />;
      case "SELL":
        return <FaSellcast className="text-danger" />;
      case "PORTFOLIO":
        return <FaChartLine className="text-primary" />;
      case "MARKET":
        return <FaBell className="text-warning" />;
      default:
        return <FaInfoCircle className="text-info" />;
    }
  };

  const formatDate = (dateString) => {
    // Handle null/undefined
    if (!dateString) {
      return "N/A";
    }

    // Java LocalDateTime format: 2026-06-01T11:55:00
    // JavaScript needs ISO format with Z
    let dateStr = dateString;

    // If it contains 'T' but no timezone info, append Z to treat as UTC
    if (
      dateStr.includes("T") &&
      !dateStr.includes("Z") &&
      !dateStr.includes("+")
    ) {
      dateStr = dateStr + "Z";
    }

    const date = new Date(dateStr);

    // Check if valid date
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }

    // Format to local Indian time
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">Notifications</h4>
        <button
          className="btn btn-outline-primary btn-sm"
          onClick={handleMarkAllRead}
        >
          <FaCheck /> Mark All Read
        </button>
      </div>

      <div className="dashboard-card">
        {notifications.length === 0 ? (
          <div className="text-center text-muted py-5">
            <FaBell size={48} className="mb-3 text-muted" />
            <h5>No notifications yet</h5>
            <p>Your notifications will appear here</p>
          </div>
        ) : (
          <div className="list-group list-group-flush">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`list-group-item d-flex align-items-start gap-3 py-3 ${!notification.isRead ? "bg-light" : ""}`}
                style={{
                  cursor: "pointer",
                  borderLeft: !notification.isRead
                    ? "3px solid #667eea"
                    : "3px solid transparent",
                }}
                onClick={() => handleMarkRead(notification.id)}
              >
                <div className="mt-1">{getIcon(notification.type)}</div>
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-start">
                    <h6
                      className={`mb-1 ${!notification.isRead ? "fw-bold" : ""}`}
                    >
                      {notification.title}
                    </h6>
                    <small className="text-muted">
                      {formatDate(notification.createdAt)}
                    </small>
                  </div>
                  <p className="mb-0 text-muted">{notification.message}</p>
                </div>
                {!notification.isRead && (
                  <span className="badge bg-primary rounded-pill">New</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
