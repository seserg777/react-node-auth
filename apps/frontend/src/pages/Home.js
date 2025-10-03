// Home page component
import React from 'react';
import { useAuth } from '../hooks/useAuth';

const Home = () => {
  const { user, isAuthenticated, handleLogout } = useAuth();

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="card">
          <div className="card-body text-center">
            <h1 className="card-title display-4">Hello World!</h1>
            <p className="card-text lead">
              Welcome to React Node Auth Application
            </p>
            
            {isAuthenticated && user ? (
              <div className="alert alert-success" role="alert">
                <h4 className="alert-heading">Hello, {user.name || user.email}!</h4>
                <button 
                    className="btn btn-outline-light btn-sm d-flex align-items-center"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
              </div>
            ) : (
              <div className="alert alert-info" role="alert">
                <h4 className="alert-heading">Welcome Guest!</h4>
                <p>
                  Please <a href="/login" className="alert-link">login</a> or{' '}
                  <a href="/register" className="alert-link">register</a> to access 
                  protected features.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
