import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api'; // ✅ centralized axios instance
import '../styles/Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    adminCode: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const res = await API.post('/auth/register', formData);
      if (res.status === 201 || res.status === 200) {
        alert('Account created successfully! You can now login.');
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-background">
        <div className="shape"></div>
        <div className="shape"></div>
      </div>
      <form className="register-box" onSubmit={handleSubmit}>
        <h2 className="register-title">Create Your Account</h2>
        <p className="register-subtitle">Join our community today</p>

        {error && <div className="register-error">{error}</div>}

        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <i className="fas fa-user"></i>
        </div>

        <div className="input-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <i className="fas fa-envelope"></i>
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <i className="fas fa-lock"></i>
        </div>

        <div className="input-group">
          <label htmlFor="adminCode">Admin Code</label>
          <input
            type="text"
            id="adminCode"
            name="adminCode"
            placeholder="Enter an Admin Code (optional)"
            value={formData.adminCode}
            onChange={handleChange}
          />
          <i className="fas fa-key"></i>
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="spinner"></span>
          ) : (
            'Register Now'
          )}
        </button>

        <div className="register-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
