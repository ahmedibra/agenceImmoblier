// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, isAuthenticated, logout, isHost, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 992);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 992);
      if (window.innerWidth > 992) {
        setMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const handleAddProperty = () => {
    if (!isAuthenticated) {
      toast.error('Veuillez vous connecter pour ajouter une annonce');
      navigate('/login');
      setMobileMenuOpen(false);
      return;
    }
    navigate('/host/properties/create');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Overlay pour mobile */}
      {mobileMenuOpen && <div className="mobile-icon-menu h3" onClick={() => setMobileMenuOpen(false)}></div>}

      {/* ========== MENU MOBILE ========== */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu-header">
          <Link to="/" className="mobile-logo" onClick={() => setMobileMenuOpen(false)}>
          <span className="logo-icon">
            <i className="bi bi-umbrella-beach fs-2"></i>
          </span>
            <span className="logo-text">CAP Booking<span className="text-danger">.</span></span>
          </Link>
          <button className="mobile-close" onClick={() => setMobileMenuOpen(false)}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
        
        <div className="mobile-menu-body">
          {/* Navigation principale mobile */}
          <div className="mobile-nav-section">
            <div className="mobile-nav-title">Navigation</div>
            <ul className="mobile-nav-list">
              <li className={isActive('/') ? 'active' : ''}>
                <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                  <i className="bi bi-house-door"></i> Accueil
                </Link>
              </li>
              
              <li className={isActive('/about') ? 'active' : ''}>
                <Link to="/about" onClick={() => setMobileMenuOpen(false)}>
                  <i className="bi bi-info-circle"></i> À propos
                </Link>
              </li>
              <li className={isActive('/contact') ? 'active' : ''}>
                <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>
                  <i className="bi bi-envelope"></i> Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Bouton Ajouter annonce mobile */}
          <div className="mobile-add-section">
            <button onClick={handleAddProperty} className="mobile-add-btn">
              <i className="bi bi-plus-circle-fill"></i>
              Publier une annonce
              {!isAuthenticated && <span className="required-badge">Connexion requise</span>}
            </button>
          </div>

          {/* Section Auth mobile */}
          <div className="mobile-auth-section">
            <div className="mobile-nav-title">
              {isAuthenticated ? 'Mon compte' : 'Compte'}
            </div>
            {isAuthenticated ? (
              <ul className="mobile-nav-list">
                <li><Link to="/host/properties/create" onClick={() => setMobileMenuOpen(false)}>
                  <i className="bi bi-heart"></i> Ajouter Annonce
                </Link></li>
                <li><Link to="/my-properties" onClick={() => setMobileMenuOpen(false)}>
                  <i className="bi bi-calendar-check"></i> Liste des annonces
                </Link></li>
                {(isHost || isAdmin) && (
                  <li><Link to="admin/properties" onClick={() => setMobileMenuOpen(false)}>
                    <i className="bi bi-speedometer2"></i> Dashboard
                  </Link></li>
                )}
                <li><Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                  <i className="bi bi-person-circle"></i> Mon profil
                </Link></li>
                <li><button onClick={handleLogout} className="mobile-logout-btn">
                  <i className="bi bi-box-arrow-right"></i> Déconnexion
                </button></li>
              </ul>
            ) : (
              <ul className="mobile-nav-list">
                <li><Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <i className="bi bi-box-arrow-in-right"></i> Connexion
                </Link></li>
                <li><Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <i className="bi bi-person-plus"></i> Inscription
                </Link></li>
              </ul>
            )}
          </div>
        </div>
        
        <div className="mobile-menu-footer">
          <p>&copy; </p>
        </div>
      </div>

      {/* ========== NAVBAR DESKTOP ========== */}
      <nav className={`navbar-desktop ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          {/* Logo */}
          <Link to="/" className="nav-logo">
           <span className="bi bi-umbrella-beach fs-2"></span>
            <span className="logo-text">CAP Booking<span className="text-danger">.</span></span>
          </Link>

          {/* Menu Desktop - Centre */}
          <ul className="nav-menu">
            <li className={isActive('/') ? 'active' : ''}>
              <Link to="/">Accueil</Link>
            </li>
            
            <li className={isActive('/about') ? 'active' : ''}>
              <Link to="/about">À propos</Link>
            </li>
            <li className={isActive('/contact') ? 'active' : ''}>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>

          {/* Actions Droite */}
          <div className="nav-actions">
            {/* Bouton Ajouter annonce - visible desktop */}
            <button onClick={handleAddProperty} className="btn-add-property">
              <i className="bi bi-plus-circle-fill"></i>
              <span>Ajouter une annonce</span>
            </button>

            {isAuthenticated ? (
              <div className="user-menu">
                <button className="user-menu-btn">
                  <div className="user-avatar">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="user-name">{user?.name?.split(' ')[0]}</span>
                  <i className="bi bi-chevron-down"></i>
                </button>
                <div className="user-dropdown">
                <Link to="/host/properties/create"><i className="bi bi-calendar-check"></i> Ajouter annonce</Link>
                  <Link to="/my-properties"><i className="bi bi-calendar-check"></i> Liste des annonces</Link>
                  {(isHost || isAdmin) && (
                    <Link to="admin/properties"><i className="bi bi-speedometer2"></i> Dashboard</Link>
                  )}
                  <Link to="/profile"><i className="bi bi-person-circle"></i> Mon profil</Link>
                  <div className="dropdown-divider"></div>
                  <button onClick={handleLogout} className="dropdown-logout">
                    <i className="bi bi-box-arrow-right"></i> Déconnexion
                  </button>
                </div>
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn-login">Connexion</Link>
                <Link to="/register" className="btn-register">Inscription</Link>
              </div>
            )}
          </div>

          {/* Bouton menu mobile */}
          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(true)}>
            <i className="bi bi-list"></i>
          </button>
        </div>
      </nav>
    </>
  );
};

export default Navbar;