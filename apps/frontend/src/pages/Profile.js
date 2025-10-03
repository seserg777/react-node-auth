// Profile page component
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateProfile, deleteProfile, clearError, setSystemMessage } from '../store/authSlice';
import { useAuth } from '../hooks/useAuth';

const Profile = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [validationError, setValidationError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const { user, loading, error, isAuthenticated } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !loading) {
      dispatch(setSystemMessage('Please log in to access your profile'));
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate, dispatch]);

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

  const handleDeleteProfile = () => {
    dispatch(deleteProfile()).then(() => {
      navigate('/');
    });
  };

  // Show loading or redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="alert alert-info" role="alert">
            Redirecting to login...
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
            
            <hr className="my-4" />
            
            <div className="mt-4">
              <h5>Current Profile Information:</h5>
              <ul className="list-unstyled">
                <li><strong>ID:</strong> {user?.id}</li>
                <li><strong>Email:</strong> {user?.email}</li>
                <li><strong>Name:</strong> {user?.name || 'Not set'}</li>
              </ul>
            </div>

            <div className="text-center">
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => setShowDeleteModal(true)}
                disabled={loading}
              >
                Delete Profile
              </button>
              <p className="text-muted mt-2 small">
                This action cannot be undone. All your data will be permanently deleted.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      <div className={`modal fade ${showDeleteModal ? 'show' : ''}`} 
           style={{ display: showDeleteModal ? 'block' : 'none' }} 
           tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title text-danger">Delete Profile</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowDeleteModal(false)}
              ></button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete your profile?</p>
              <p className="text-danger">
                <strong>This action cannot be undone.</strong> All your data will be permanently deleted.
              </p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowDeleteModal(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDeleteProfile}
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Delete Profile'}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal backdrop */}
      {showDeleteModal && (
        <div className="modal-backdrop fade show"></div>
      )}
    </div>
  );
};

export default Profile;
