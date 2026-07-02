import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { FaChartLine, FaUser, FaEnvelope, FaLock, FaPhone, FaIdCard } from 'react-icons/fa';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.register(formData);
      const { token, user } = response.data.data;
      login(token, user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-5" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5 col-lg-4">
            <div className="card border-0 shadow-lg" style={{ borderRadius: '16px' }}>
              <div className="card-body p-4 p-md-5">
                <div className="text-center mb-4">
                  <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3" style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                    <FaChartLine size={28} color="white" />
                  </div>
                  <h3 className="fw-bold mb-1">Create Account</h3>
                  <p className="text-muted">Start your paper trading journey</p>
                </div>

                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-medium">Full Name</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light"><FaIdCard /></span>
                      <input type="text" name="fullName" className="form-control" placeholder="Enter full name" value={formData.fullName} onChange={handleChange} required />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-medium">Username</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light"><FaUser /></span>
                      <input type="text" name="username" className="form-control" placeholder="Choose username" value={formData.username} onChange={handleChange} required />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-medium">Email</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light"><FaEnvelope /></span>
                      <input type="email" name="email" className="form-control" placeholder="Enter email" value={formData.email} onChange={handleChange} required />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-medium">Phone</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light"><FaPhone /></span>
                      <input type="tel" name="phone" className="form-control" placeholder="Enter phone number" value={formData.phone} onChange={handleChange} />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-medium">Password</label>
                    <div className="input-group">
                      <span className="input-group-text bg-light"><FaLock /></span>
                      <input type="password" name="password" className="form-control" placeholder="Create password (min 6 chars)" value={formData.password} onChange={handleChange} required minLength={6} />
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary-custom w-100 mb-3" disabled={loading}>
                    {loading ? <span className="spinner-border spinner-border-sm" role="status" /> : 'Create Account'}
                  </button>
                </form>

                <div className="text-center">
                  <p className="text-muted mb-0">
                    Already have an account?{' '}
                    <Link to="/login" className="text-decoration-none fw-medium" style={{ color: '#667eea' }}>
                      Sign in
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;