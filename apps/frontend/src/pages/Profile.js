// Profile page component
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile, clearError } from '../store/authSlice';

const Profile = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [validationError, setValidationError] = useState('');
  
  const { user, loading, error, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || ''
      });
    }
  }, [user]);

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    dispatch(clearError());

    // Validate name length if provided
    if (formData.name && formData.name.length < 2) {
      setValidationError('Name must be at least 2 characters long');
      return;
    }

    // Check if any changes were made
    if (formData.name === (user?.name || '') && formData.email === user?.email) {
      setValidationError('No changes to save');
      return;
    }

    dispatch(updateProfile({
      name: formData.name || undefined,
      email: formData.email
    }));
  };

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="alert alert-warning" role="alert">
            Please log in to access your profile.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title mb-0">Edit Profile</h3>
          </div>
          <div className="card-body">
            {(error || validationError) && (
              <div className="alert alert-danger" role="alert">
                {error || validationError}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                />
                <div className="form-text">
                  Name is optional and can be left empty
                </div>
              </div>
              
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </form>
            
            <div className="mt-4">
              <h5>Current Profile Information:</h5>
              <ul className="list-unstyled">
                <li><strong>ID:</strong> {user?.id}</li>
                <li><strong>Email:</strong> {user?.email}</li>
                <li><strong>Name:</strong> {user?.name || 'Not set'}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
