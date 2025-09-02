// src/components/Dashboard.js - UPDATED WITH PDF DOWNLOAD
import React, { useState, useEffect } from "react";
import InputForm from "./InputForm";
import "../components/PDFgenerator";
import "../styles/Dashboard.css";
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";
import { firestore } from "../config/firebase";

const Dashboard = ({ user, onLogout }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // FIXED: Optimized loading with proper timeout and error handling
  useEffect(() => {
    let isMounted = true;
    let loadingTimeout;
    
    const loadSubmissions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log("Loading submissions...");
        
        // Set a shorter timeout for better UX
        loadingTimeout = setTimeout(() => {
          if (isMounted && loading) {
            console.log("Loading timeout - trying cache");
            loadFromCache();
          }
        }, 3000); // Reduced from 8000ms to 3000ms
        
        // Try to load data with a race condition for timeout
        const dataPromise = firestore.getDocuments("surat-perjalanan", false); // Don't use cache first
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Network timeout')), 5000)
        );
        
        const data = await Promise.race([dataPromise, timeoutPromise]);
        
        clearTimeout(loadingTimeout);
        
        if (!isMounted) return;
        
        // Sort by createdAt descending
        const sortedData = data.sort((a, b) => {
          const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt) || new Date(a.tanggalDibuat);
          const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt) || new Date(b.tanggalDibuat);
          return dateB - dateA;
        });

        setSubmissions(sortedData);
        setError(null);
        console.log(`Loaded ${sortedData.length} submissions successfully`);
        
      } catch (error) {
        console.error("Error loading submissions:", error);
        clearTimeout(loadingTimeout);
        
        if (isMounted) {
          // Try loading from cache as fallback
          await loadFromCache();
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    
    // Fallback function to load from cache
    const loadFromCache = async () => {
      try {
        console.log("Attempting to load from cache...");
        const cachedData = await firestore.getDocuments("surat-perjalanan", true);
        
        if (isMounted) {
          if (cachedData.length > 0) {
            const sortedData = cachedData.sort((a, b) => {
              const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt) || new Date(a.tanggalDibuat);
              const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt) || new Date(b.tanggalDibuat);
              return dateB - dateA;
            });
            setSubmissions(sortedData);
            setError("Data dimuat dari cache. Refresh untuk data terbaru.");
            console.log(`Loaded ${sortedData.length} submissions from cache`);
          } else {
            setError("Tidak dapat memuat data. Pastikan koneksi internet stabil.");
          }
        }
      } catch (cacheError) {
        console.error("Cache loading failed:", cacheError);
        if (isMounted) {
          setError("Gagal memuat data. Periksa koneksi internet dan refresh halaman.");
        }
      }
    };

    // Start loading immediately
    loadSubmissions();
    
    // Cleanup function
    return () => {
      isMounted = false;
      if (loadingTimeout) {
        clearTimeout(loadingTimeout);
      }
    };
  }, []); // Only run once

  const handleFormSubmit = async (formData) => {
    try {
      console.log("Submitting form data...");
      
      // Optimistic update
      const tempId = `temp_${Date.now()}`;
      const newSubmission = {
        id: tempId,
        ...formData,
        userId: user.uid,
        userEmail: user.email,
        createdAt: new Date(),
        isTemporary: true
      };
      
      setSubmissions(prev => [newSubmission, ...prev]);
      
      // Save to Firestore with timeout
      const submitPromise = firestore.addDocument("surat-perjalanan", {
        ...formData,
        userId: user.uid,
        userEmail: user.email,
      });
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Submit timeout')), 10000)
      );
      
      const docRef = await Promise.race([submitPromise, timeoutPromise]);

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
      
      let errorMessage = "Gagal menyimpan: ";
      if (error.message.includes('timeout')) {
        errorMessage += "Koneksi terlalu lambat. Coba lagi.";
      } else if (error.message.includes('network')) {
        errorMessage += "Masalah koneksi internet";
      } else if (error.message.includes('permission')) {
        errorMessage += "Tidak memiliki izin";
      } else {
        errorMessage += error.message;
      }
      
      alert(errorMessage);
    }
  };

  // NEW: Handle PDF download
  const handleDownloadPDF = async (item) => {
    try {
      console.log("Generating PDF for:", item.nama);
      await generateSuratPerjalananPDF(item);
      
      // Optional: Show success message
      // alert("PDF berhasil diunduh!");
      
    } catch (error) {
      console.error("PDF generation error:", error);
      alert("Gagal membuat PDF: " + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini?")) {
      try {
        const itemToDelete = submissions.find(item => item.id === id);
        setSubmissions(prev => prev.filter(item => item.id !== id));
        
        const deletePromise = firestore.deleteDocument("surat-perjalanan", id);
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Delete timeout')), 8000)
        );
        
        await Promise.race([deletePromise, timeoutPromise]);
        console.log("Data deleted successfully");
        
      } catch (error) {
        console.error("Delete error:", error);
        
        // Restore item on error
        const itemToDelete = submissions.find(item => item.id === id);
        if (itemToDelete) {
          setSubmissions(prev => [itemToDelete, ...prev].sort((a, b) => {
            const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt) || new Date(a.tanggalDibuat);
            const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt) || new Date(b.tanggalDibuat);
            return dateB - dateA;
          }));
        }
        
        alert(`Gagal menghapus: ${error.message.includes('timeout') ? 'Koneksi lambat' : error.message}`);
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
    // Force reload
    window.location.reload();
  };

  const handleRefresh = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await firestore.getDocuments("surat-perjalanan", false);
      const sortedData = data.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt) || new Date(a.tanggalDibuat);
        const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt) || new Date(b.tanggalDibuat);
        return dateB - dateA;
      });
      setSubmissions(sortedData);
    } catch (error) {
      setError("Gagal refresh data: " + error.message);
    } finally {
      setLoading(false);
    }
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
              <div className="card-header-actions">
                <button 
                  onClick={handleRefresh} 
                  className="refresh-btn"
                  disabled={loading}
                  title="Refresh data"
                >
                  🔄
                </button>
                <div className="card-badge">
                  {loading ? "Loading..." : `${submissions.length} Data`}
                </div>
              </div>
            </div>

            {/* Error State */}
            {error && (
              <div className="error-state">
                <div className="error-icon">⚠️</div>
                <h3 className="error-title">Terjadi Masalah</h3>
                <p className="error-description">{error}</p>
                <div className="error-actions">
                  <button onClick={handleRetry} className="retry-btn">
                    Reload Halaman
                  </button>
                  <button onClick={handleRefresh} className="refresh-btn-alt">
                    Coba Refresh Data
                  </button>
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading && !error && (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p className="loading-text">Memuat data...</p>
                <p className="loading-subtext">
                  {loading ? "Menghubungkan ke server..." : ""}
                </p>
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
            {!loading && submissions.length > 0 && (
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
                        {/* NEW: Download PDF Button */}
                        <button
                          onClick={() => handleDownloadPDF(item)}
                          className="action-btn download-btn"
                          title="Unduh PDF"
                          disabled={item.isTemporary}
                        >
                          📄
                        </button>
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