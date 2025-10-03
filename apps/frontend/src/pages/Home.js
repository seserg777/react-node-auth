// Home page component
import React from 'react';
import { useSelector } from 'react-redux';

const Home = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);

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
                <h4 className="alert-heading">You are logged in!</h4>
                <p>Email: {user.email}</p>
                {user.name && <p>Name: {user.name}</p>}
                <p>User ID: {user.id}</p>
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
