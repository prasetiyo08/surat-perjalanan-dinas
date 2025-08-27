// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import InputForm from './InputForm';
import '../styles/Dashboard.css';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';
import { firestore } from '../config/firebase';

const Dashboard = ({ user, onLogout }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load data dari Firestore saat component mount
  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      const data = await firestore.getDocuments('surat-perjalanan');
      
      // Sort by createdAt descending (terbaru dulu)
      const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setSubmissions(sortedData);
    } catch (error) {
      console.error('Error loading submissions:', error);
      alert('Gagal memuat data. Periksa koneksi internet.');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      // Tambah data ke Firestore
      const docRef = await firestore.addDocument('surat-perjalanan', {
        ...formData,
        userId: user.uid, // Tambah user ID untuk filter data
        userEmail: user.email
      });
      
      // Update local state dengan data baru
      const newSubmission = {
        id: docRef.id,
        ...formData,
        userId: user.uid,
        userEmail: user.email
      };
      
      setSubmissions([newSubmission, ...submissions]);
      alert('Data berhasil disimpan ke database!');
    } catch (error) {
      console.error('Error saving submission:', error);
      alert('Gagal menyimpan data. Coba lagi.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      try {
        await firestore.deleteDocument('surat-perjalanan', id);
        setSubmissions(submissions.filter(item => item.id !== id));
        alert('Data berhasil dihapus!');
      } catch (error) {
        console.error('Error deleting submission:', error);
        alert('Gagal menghapus data. Coba lagi.');
      }
    }
  };

  const handleEdit = (id) => {
    // Fungsi edit bisa ditambahkan nanti
    alert('Fitur edit akan segera hadir!');
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('User logged out successfully');
      if (onLogout) {
        onLogout();
      }
    } catch (error) {
      console.error('Logout error:', error);
      alert('Gagal logout. Coba lagi.');
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
              <p className="header-subtitle">Sistem Manajemen Surat Perjalanan Dinas</p>
            </div>
          </div>
          <div className="header-right">
            <div className="user-info">
              <div className="user-avatar">
                {(user.displayName || user.email).charAt(0).toUpperCase()}
              </div>
              <div className="user-details">
                <span className="user-name">
                  {user.displayName || 'Selamat datang!'}
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
                {loading ? 'Loading...' : `${submissions.length} Data`}
              </div>
            </div>
            
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p className="loading-text">Memuat data...</p>
              </div>
            ) : submissions.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <h3 className="empty-title">Belum Ada Data</h3>
                <p className="empty-description">
                  Silakan isi form di atas untuk menambah data perjalanan dinas
                </p>
              </div>
            ) : (
              <div className="submissions-list">
                {submissions.map((item) => (
                  <div key={item.id} className="submission-item">
                    <div className="submission-header">
                      <div className="submission-info">
                        <h3 className="submission-name">{item.nama}</h3>
                        <span className="submission-position">{item.jabatan}</span>
                      </div>
                      <div className="submission-actions">
                        <button 
                          onClick={() => handleEdit(item.id)}
                          className="action-btn edit-btn"
                          title="Edit data"
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="action-btn delete-btn"
                          title="Hapus data"
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
                          {new Date(item.tanggalMulai).toLocaleDateString('id-ID')} - {' '}
                          {new Date(item.tanggalSelesai).toLocaleDateString('id-ID')}
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
                          <span className="detail-value">
                            {item.pengikut.join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="submission-footer">
                      <span className="submission-date">
                        Dibuat: {item.createdAt ? new Date(item.createdAt.toDate()).toLocaleDateString('id-ID') : item.tanggalDibuat}
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