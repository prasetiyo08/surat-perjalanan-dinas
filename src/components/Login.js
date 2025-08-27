// src/components/Login.js
import React, { useState } from "react";
import "../styles/Login.css";
import { auth } from "../config/firebase";
import { signInWithEmailAndPassword } from 'firebase/auth';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    // Trim whitespace dari input
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    console.log("Attempting login with email:", trimmedEmail);

    // Validasi input
    if (!trimmedEmail) {
      setError("Email wajib diisi");
      setLoading(false);
      return;
    }

    if (!trimmedPassword) {
      setError("Password wajib diisi");
      setLoading(false);
      return;
    }

    try {
      const result = await signInWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
      console.log("Login berhasil:", result.user);
      
      // Firebase auth state akan otomatis update di App.js
      // Tidak perlu manual call onLogin, tapi tetap dipanggil untuk kompatibilitas
      onLogin({
        email: result.user.email,
        uid: result.user.uid,
        displayName: result.user.displayName || result.user.email
      });
    } catch (err) {
      console.error("Login error:", err);
      
      // Handle berbagai jenis error Firebase
      let errorMessage = "Email atau password salah";
      
      switch (err.code) {
        case 'auth/user-not-found':
          errorMessage = "Email tidak terdaftar";
          break;
        case 'auth/wrong-password':
          errorMessage = "Password salah";
          break;
        case 'auth/invalid-email':
          errorMessage = "Format email tidak valid";
          break;
        case 'auth/user-disabled':
          errorMessage = "Akun telah dinonaktifkan";
          break;
        case 'auth/too-many-requests':
          errorMessage = "Terlalu banyak percobaan login. Coba lagi nanti.";
          break;
        case 'auth/network-request-failed':
          errorMessage = "Masalah koneksi. Periksa internet Anda.";
          break;
        case 'auth/invalid-credential':
          errorMessage = "Email atau password salah";
          break;
        default:
          errorMessage = `Error: ${err.message}`;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="login-container">
      <div className="login-background"></div>
      <div className="login-form-container">
        <div className="login-logo">
          <h1 className="login-logo-text">SPDD</h1>
          <p className="login-logo-subtext">Surat Perjalanan Dinas Digital</p>
        </div>

        <div className="login-form">
          <h2 className="login-title">Masuk ke Sistem</h2>

          {error && <div className="login-error">{error}</div>}

          <div className="login-input-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              className="login-input"
              required
              autoComplete="email"
            />
          </div>

          <div className="login-input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="login-input"
              required
              autoComplete="current-password"
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className={`login-button ${loading ? "loading" : ""}`}
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>

          <p className="login-demo-text">
            Gunakan akun yang sudah terdaftar di Firebase Authentication
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;