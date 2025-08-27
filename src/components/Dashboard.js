import React, { useState } from 'react';
import InputForm from './InputForm';
import '../styles/Dashboard.css';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';

const Dashboard = ({ user, onLogout }) => {
  const [submissions, setSubmissions] = useState([]);

  const handleFormSubmit = (formData) => {
    setSubmissions([formData, ...submissions]);
    alert('Data berhasil disimpan!');
  };

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      setSubmissions(submissions.filter(item => item.id !== id));
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
      // onLogout akan dipanggil otomatis oleh auth state listener di App.js
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
                {submissions.length} Data
              </div>
            </div>
            
            {submissions.length === 0 ? (
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
                        Dibuat: {item.tanggalDibuat}
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