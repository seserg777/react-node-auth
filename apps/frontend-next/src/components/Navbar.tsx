// Navigation bar component (Next.js)
'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import MiniCart from './MiniCart';

export default function Navbar() {
  const { user, isAuthenticated, handleLogout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" href="/">
          Next.js + Node Auth
        </Link>
        
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto align-items-center">
            <li className="nav-item">
              <Link className="nav-link d-flex align-items-center" href="/">
                Home
              </Link>
            </li>
          </ul>
          
          <ul className="navbar-nav align-items-center">
            <li className="nav-item">
              <Link className="nav-link d-flex align-items-center" href="/productlist">
                Product List
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link d-flex align-items-center" href="/cart">
                Cart
              </Link>
            </li>

            {isAuthenticated && user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link d-flex align-items-center" href="/profile">
                    Profile
                  </Link>
                </li>
                <li className="nav-item">
                  <span className="navbar-text me-3 d-flex align-items-center">
                    Welcome, {user.name || user.email}
                  </span>
                </li>
                <li className="nav-item">
                  <button 
                    className="btn btn-outline-light btn-sm d-flex align-items-center"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link d-flex align-items-center" href="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link d-flex align-items-center" href="/register">
                    Register
                  </Link>
                </li>
              </>
            )}

            <li className="nav-item ms-2">
              <MiniCart />
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

