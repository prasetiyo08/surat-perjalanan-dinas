// src/App.js - FIXED VERSION
import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { auth } from './config/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import './styles/Global.css';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [forceLogout, setForceLogout] = useState(false);

  useEffect(() => {
    // Check if user wants to force logout (from URL parameter or localStorage)
    const urlParams = new URLSearchParams(window.location.search);
    const forceLogoutParam = urlParams.get('logout');
    const savedForceLogout = localStorage.getItem('forceLogout');
    
    if (forceLogoutParam === 'true' || savedForceLogout === 'true') {
      setForceLogout(true);
      localStorage.removeItem('forceLogout');
      // Clear URL parameter
      if (forceLogoutParam) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }

    // Firebase auth state listener
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user);
      
      // If force logout is requested, sign out the user
      if (forceLogout && user) {
        try {
          await signOut(auth);
          setUser(null);
          setForceLogout(false);
        } catch (error) {
          console.error('Force logout error:', error);
        }
      } else {
        setUser(user);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, [forceLogout]);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      // Clear any stored session data
      localStorage.clear();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleForceLogout = () => {
    setForceLogout(true);
    localStorage.setItem('forceLogout', 'true');
    if (user) {
      handleLogout();
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Memuat aplikasi...</p>
      </div>
    );
  }

  // Show logout option if user is automatically logged in
  const showAutoLoginAlert = user && !forceLogout && window.location.search !== '?manual=true';

  return (
    <div className="app">
      {showAutoLoginAlert && (
        <div className="auto-login-alert">
          <div className="alert-content">
            <p>Anda sudah login sebelumnya. Apakah ingin tetap login atau logout?</p>
            <div className="alert-buttons">
              <button 
                onClick={() => window.history.replaceState({}, document.title, window.location.pathname + '?manual=true')}
                className="btn-stay"
              >
                Tetap Login
              </button>
              <button 
                onClick={handleForceLogout}
                className="btn-logout"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
      
      {user && !forceLogout ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;