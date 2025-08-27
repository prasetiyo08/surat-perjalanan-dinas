// src/components/Dashboard.js - OPTIMIZED VERSION
import React, { useState, useEffect } from "react";
import InputForm from "./InputForm";
import "../styles/Dashboard.css";
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";
import { firestore } from "../config/firebase";

const Dashboard = ({ user, onLogout }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load data dengan retry mechanism dan timeout
  useEffect(() => {
    let isMounted = true; // Prevent state updates if component unmounted
    
    const loadSubmissions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log("Loading submissions...");
        
        // Add timeout untuk loading
        const timeoutId = setTimeout(() => {
          if (isMounted) {
            console.log("Loading timeout reached");
            setError("Loading terlalu lama. Mencoba lagi...");
            // Retry setelah timeout
            setTimeout(() => {
              if (isMounted) {
                loadSubmissionsWithCache();
              }
            }, 2000);
          }
        }, 8000); // 8 second timeout
        
        const data = await firestore.getDocuments("surat-perjalanan", true);
        
        // Clear timeout jika berhasil
        clearTimeout(timeoutId);
        
        if (!isMounted) return; // Component unmounted
        
        // Sort by createdAt descending (terbaru dulu)
        const sortedData = data.sort((a, b) => {
          const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt) || new Date(a.tanggalDibuat);
          const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt) || new Date(b.tanggalDibuat);
          return dateB - dateA;
        });

        setSubmissions(sortedData);
        console.log(`Loaded ${sortedData.length} submissions`);
        
      } catch (error) {
        console.error("Error loading submissions:", error);
        if (isMounted) {
          setError(`Gagal memuat data: ${error.message}`);
          // Auto retry after 3 seconds
          setTimeout(() => {
            if (isMounted) {
              loadSubmissionsWithCache();
            }
          }, 3000);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    // Function to load with cache fallback
    const loadSubmissionsWithCache = async () => {
      try {
        setLoading(true);
        // Try cache first, then server
        const data = await firestore.getDocuments("surat-perjalanan", true);
        if (isMounted) {
          const sortedData = data.sort((a, b) => {
            const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt) || new Date(a.tanggalDibuat);
            const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt) || new Date(b.tanggalDibuat);
            return dateB - dateA;
          });
          setSubmissions(sortedData);
          setError(null);
        }
      } catch (error) {
        console.error("Cache loading failed:", error);
        if (isMounted) {
          setError("Tidak dapat memuat data. Periksa koneksi internet.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadSubmissions();
    
    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array - only load once

  const handleFormSubmit = async (formData) => {
    try {
      console.log("Submitting form data...");
      
      // Optimistic update - add to UI immediately
      const tempId = `temp_${Date.now()}`;
      const newSubmission = {
        id: tempId,
        ...formData,
        userId: user.uid,
        userEmail: user.email,
        createdAt: new Date(),
        isTemporary: true // Mark as temporary
      };
      
      // Add to UI immediately
      setSubmissions(prev => [newSubmission, ...prev]);
      
      // Save to Firestore in background
      const docRef = await firestore.addDocument("surat-perjalanan", {
        ...formData,
        userId: user.uid,
        userEmail: user.email,
      });

      // Replace temporary item with real one
      setSubmissions(prev => prev.map(item => 
        item.id === tempId 
          ? { ...item, id: docRef.id, isTemporary: false }
          : item
      ));
      
      console.log("Data saved successfully");
      
    } catch (error) {
      console.error("Submit error:", error);
      
      // Remove temporary item on error
      setSubmissions(prev => prev.filter(item => !item.isTemporary));
      
      // Show specific error message
      if (error.message.includes('network')) {
        alert("Gagal menyimpan: Masalah koneksi internet");
      } else if (error.message.includes('permission')) {
        alert("Gagal menyimpan: Tidak memiliki izin");
      } else {
        alert(`Gagal menyimpan data: ${error.message}`);
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      try {
        // Optimistic delete - remove from UI first
        const itemToDelete = submissions.find(item => item.id === id);
        setSubmissions(prev => prev.filter(item => item.id !== id));
        
        // Delete from Firestore
        await firestore.deleteDocument("surat-perjalanan", id);
        console.log("Data deleted successfully");
        
      } catch (error) {
        console.error("Delete error:", error);
        
        // Restore item on error
        if (itemToDelete) {
          setSubmissions(prev => [itemToDelete, ...prev].sort((a, b) => {
            const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt) || new Date(a.tanggalDibuat);
            const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt) || new Date(b.tanggalDibuat);
            return dateB - dateA;
          }));
        }
        
        alert(`Gagal menghapus data: ${error.message}`);
      }
    }
  };

  const handleEdit = (id) => {
    alert("Fitur edit akan segera hadir!");
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User logged out successfully");
      if (onLogout) {
        onLogout();
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("Gagal logout. Coba lagi.");
    }
  };

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    // Trigger reload
    window.location.reload();
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <div className="header-logo">GA</div>
            <div className="header-text">
              <h1 className="header-title">PT Bandara Internasional Batam</h1>
              <p className="header-subtitle">
                Sistem Manajemen Surat Perjalanan Dinas
              </p>
            </div>
          </div>
          <div className="header-right">
            <div className="user-info">
              <div className="user-avatar">
                {(user.displayName || user.email).charAt(0).toUpperCase()}
              </div>
              <div className="user-details">
                <span className="user-name">
                  {user.displayName || "Selamat datang!"}
                </span>
                <span className="user-email">{user.email}</span>
              </div>
            </div>
            <button onClick={handleLogout} className="logout-btn">
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Form Input Section */}
        <div className="dashboard-form-section">
          <InputForm onSubmit={handleFormSubmit} />
        </div>

        {/* Data List Section */}
        <div className="dashboard-list-section">
          <div className="dashboard-card">
            <div className="card-header">
              <h2 className="card-title">Data Perjalanan Tersimpan</h2>
              <div className="card-badge">
                {loading ? "Loading..." : `${submissions.length} Data`}
              </div>
            </div>

            {/* Error State */}
            {error && (
              <div className="error-state">
                <div className="error-icon">⚠️</div>
                <h3 className="error-title">Terjadi Masalah</h3>
                <p className="error-description">{error}</p>
                <button onClick={handleRetry} className="retry-btn">
                  Coba Lagi
                </button>
              </div>
            )}

            {/* Loading State */}
            {loading && !error && (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p className="loading-text">Memuat data...</p>
                <p className="loading-subtext">Jika loading terlalu lama, periksa koneksi internet</p>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && submissions.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <h3 className="empty-title">Belum Ada Data</h3>
                <p className="empty-description">
                  Silakan isi form di atas untuk menambah data perjalanan dinas
                </p>
              </div>
            )}

            {/* Submissions List */}
            {!loading && !error && submissions.length > 0 && (
              <div className="submissions-list">
                {submissions.map((item) => (
                  <div key={item.id} className={`submission-item ${item.isTemporary ? 'temporary' : ''}`}>
                    <div className="submission-header">
                      <div className="submission-info">
                        <h3 className="submission-name">{item.nama}</h3>
                        <span className="submission-position">
                          {item.jabatan}
                        </span>
                        {item.isTemporary && (
                          <span className="temp-badge">Menyimpan...</span>
                        )}
                      </div>
                      <div className="submission-actions">
                        <button
                          onClick={() => handleEdit(item.id)}
                          className="action-btn edit-btn"
                          title="Edit data"
                          disabled={item.isTemporary}
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="action-btn delete-btn"
                          title="Hapus data"
                          disabled={item.isTemporary}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    <div className="submission-details">
                      <div className="detail-row">
                        <span className="detail-label">Nomor Surat:</span>
                        <span className="detail-value">{item.nomorSurat}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Tujuan:</span>
                        <span className="detail-value">{item.tujuan}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Keperluan:</span>
                        <span className="detail-value">{item.keperluan}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Periode:</span>
                        <span className="detail-value">
                          {new Date(item.tanggalMulai).toLocaleDateString("id-ID")} - {new Date(item.tanggalSelesai).toLocaleDateString("id-ID")}
                        </span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Transport:</span>
                        <span className="detail-value">{item.fasilitasTransport}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Penginapan:</span>
                        <span className="detail-value">{item.fasilitasPenginapan}</span>
                      </div>
                      {item.pengikut && item.pengikut.length > 0 && (
                        <div className="detail-row">
                          <span className="detail-label">Pengikut:</span>
                          <span className="detail-value">{item.pengikut.join(", ")}</span>
                        </div>
                      )}
                    </div>

                    <div className="submission-footer">
                      <span className="submission-date">
                        Dibuat: {
                          item.createdAt?.toDate?.() 
                            ? item.createdAt.toDate().toLocaleDateString("id-ID")
                            : item.tanggalDibuat || new Date().toLocaleDateString("id-ID")
                        }
                      </span>
                      <span className={`status-badge ${item.biayaPerjalanan.toLowerCase()}`}>
                        {item.biayaPerjalanan}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;