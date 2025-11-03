// Profile page (Next.js)
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { updateProfile, deleteProfile, clearError, setSystemMessage } from '@/lib/features/authSlice';
import { useAuth } from '@/hooks/useAuth';
import type { AppDispatch } from '@/lib/store';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ProfilePage() {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [validationError, setValidationError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const { user, loading, error, isAuthenticated } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !loading) {
      dispatch(setSystemMessage('Please log in to access your profile'));
      router.push('/login');
    }
  }, [isAuthenticated, loading, router, dispatch]);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
      router.push('/');
    });
  };

  // Show loading or redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="d-flex flex-column min-vh-100">
        <Navbar />
        <main className="container mt-4 flex-grow-1">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="alert alert-info" role="alert">
                Redirecting to login...
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="container mt-4 flex-grow-1">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title mb-0">Profile</h3>
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
                    />
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
                  >
                    Delete Profile
                  </button>
                  <p className="text-muted mt-2 small">
                    Warning: This action cannot be undone
                  </p>
                </div>
              </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
              <div className="modal show d-block" tabIndex={-1}>
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Confirm Deletion</h5>
                      <button 
                        type="button" 
                        className="btn-close" 
                        onClick={() => setShowDeleteModal(false)}
                      ></button>
                    </div>
                    <div className="modal-body">
                      <p>Are you sure you want to delete your profile?</p>
                      <p className="text-danger">This action cannot be undone!</p>
                    </div>
                    <div className="modal-footer">
                      <button 
                        type="button" 
                        className="btn btn-secondary" 
                        onClick={() => setShowDeleteModal(false)}
                      >
                        Cancel
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-danger" 
                        onClick={handleDeleteProfile}
                      >
                        Delete Profile
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {showDeleteModal && <div className="modal-backdrop show"></div>}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

