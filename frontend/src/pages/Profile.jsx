import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/api";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaSave,
  FaCheck,
  FaTrashAlt,
  FaExclamationTriangle,
} from "react-icons/fa";

const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    avatarUrl: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        avatarUrl: user.avatarUrl || "",
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await authAPI.updateProfile(profile);
      updateUser(response.data.data);
      setMessage("Profile updated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordMessage("");
    setPasswordLoading(true);

    try {
      await authAPI.changePassword(passwordData);
      setPasswordMessage("Password changed successfully!");
      setPasswordData({ currentPassword: "", newPassword: "" });
    } catch (err) {
      setPasswordError(
        err.response?.data?.message || "Failed to change password.",
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteError("");
    setDeleteLoading(true);

    try {
      await authAPI.deleteAccount();
      // Clear local storage and logout
      logout();
      // Redirect to landing page
      navigate("/");
    } catch (err) {
      setDeleteError(
        err.response?.data?.message || "Failed to delete account.",
      );
      setDeleteLoading(false);
    }
  };

  return (
    <div>
      <h4 className="fw-bold mb-4">My Profile</h4>

      <div className="row g-4">
        <div className="col-lg-6">
          <div className="dashboard-card">
            <h5 className="fw-bold mb-4">Profile Information</h5>

            {message && (
              <div className="alert alert-success">
                <FaCheck /> {message}
              </div>
            )}
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleProfileUpdate}>
              <div className="mb-3">
                <label className="form-label">
                  <FaUser /> Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  className="form-control"
                  value={profile.fullName}
                  onChange={handleProfileChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">
                  <FaEnvelope /> Email
                </label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={profile.email}
                  onChange={handleProfileChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">
                  <FaPhone /> Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  className="form-control"
                  value={profile.phone}
                  onChange={handleProfileChange}
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary-custom"
                disabled={loading}
              >
                {loading ? (
                  <span className="spinner-border spinner-border-sm" />
                ) : (
                  <>
                    <FaSave /> Save Changes
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="dashboard-card">
            <h5 className="fw-bold mb-4">Change Password</h5>

            {passwordMessage && (
              <div className="alert alert-success">
                <FaCheck /> {passwordMessage}
              </div>
            )}
            {passwordError && (
              <div className="alert alert-danger">{passwordError}</div>
            )}

            <form onSubmit={handlePasswordUpdate}>
              <div className="mb-3">
                <label className="form-label">
                  <FaLock /> Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  className="form-control"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">
                  <FaLock /> New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  className="form-control"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength={6}
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary-custom"
                disabled={passwordLoading}
              >
                {passwordLoading ? (
                  <span className="spinner-border spinner-border-sm" />
                ) : (
                  <>
                    <FaLock /> Change Password
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Delete Account Section */}
      <div className="row g-4 mt-2">
        <div className="col-12">
          <div className="dashboard-card border-danger">
            <p className="text-muted mb-3">
              Once you delete your account, there is no going back. All your
              data including portfolio, transactions, and watchlist will be
              permanently removed.
            </p>

            {!showDeleteConfirm ? (
              <button
                className="btn btn-outline-danger"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <FaTrashAlt /> Delete My Account
              </button>
            ) : (
              <div className="alert alert-danger">
                <p className="fw-bold mb-2">
                  Are you sure? This action cannot be undone.
                </p>
                {deleteError && (
                  <p className="text-danger mb-2">{deleteError}</p>
                )}
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-danger"
                    onClick={handleDeleteAccount}
                    disabled={deleteLoading}
                  >
                    {deleteLoading ? (
                      <span className="spinner-border spinner-border-sm" />
                    ) : (
                      <>
                        <FaTrashAlt /> Yes, Delete Permanently
                      </>
                    )}
                  </button>
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setDeleteError("");
                    }}
                    disabled={deleteLoading}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
