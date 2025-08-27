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
  const [showAutoLoginDialog, setShowAutoLoginDialog] = useState(false);

  useEffect(() => {
    // Firebase auth state listener
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user);
      
      if (user) {
        // Check if this is an automatic login (user was already signed in)
        const isManualLogin = sessionStorage.getItem('manualLogin') === 'true';
        const hasShownDialog = sessionStorage.getItem('autoLoginDialogShown') === 'true';
        
        if (!isManualLogin && !hasShownDialog) {
          // Show dialog for automatic login
          setShowAutoLoginDialog(true);
          sessionStorage.setItem('autoLoginDialogShown', 'true');
        } else {
          // Direct login (manual or user chose to stay)
          setUser(user);
        }
      } else {
        // User is logged out
        setUser(null);
        setShowAutoLoginDialog(false);
        // Clear session flags
        sessionStorage.removeItem('manualLogin');
        sessionStorage.removeItem('autoLoginDialogShown');
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleManualLogin = (userData) => {
    // Mark as manual login
    sessionStorage.setItem('manualLogin', 'true');
    setUser(userData);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setShowAutoLoginDialog(false);
      // Clear session data
      sessionStorage.clear();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleStayLoggedIn = () => {
    setShowAutoLoginDialog(false);
    sessionStorage.setItem('manualLogin', 'true');
    setUser(auth.currentUser);
  };

  const handleForceLogout = async () => {
    setShowAutoLoginDialog(false);
    await handleLogout();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Memuat aplikasi...</p>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Auto Login Dialog */}
      {showAutoLoginDialog && (
        <div className="auto-login-alert">
          <div className="alert-content">
            <p>Anda sudah login sebelumnya. Apakah ingin tetap login atau logout?</p>
            <div className="alert-buttons">
              <button 
                onClick={handleStayLoggedIn}
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
      
      {user && !showAutoLoginDialog ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleManualLogin} />
      )}
    </div>
  );
};

export default App;