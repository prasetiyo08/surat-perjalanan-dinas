// src/components/InputForm.js - FIXED VERSION
import React, { useState } from 'react';
import '../styles/InputForm.css';

const InputForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    nama: '',
    jabatan: '',
    tujuan: '',
    keperluan: '',
    tanggalMulai: '',
    tanggalSelesai: '',
    biayaPerjalanan: 'Perusahaan',
    fasilitasTransport: '',
    fasilitasPenginapan: '',
    pengikut: ['']
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitProgress, setSubmitProgress] = useState(0);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handlePengikutChange = (index, value) => {
    const newPengikut = [...formData.pengikut];
    newPengikut[index] = value;
    setFormData(prev => ({
      ...prev,
      pengikut: newPengikut
    }));
  };

  const addPengikut = () => {
    setFormData(prev => ({
      ...prev,
      pengikut: [...prev.pengikut, '']
    }));
  };

  const removePengikut = (index) => {
    const newPengikut = formData.pengikut.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      pengikut: newPengikut.length > 0 ? newPengikut : ['']
    }));
  };

  // OPTIMIZED: Validasi form yang lebih efisien
  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      { field: 'nama', message: 'Nama wajib diisi' },
      { field: 'jabatan', message: 'Jabatan wajib diisi' },
      { field: 'tujuan', message: 'Tujuan wajib diisi' },
      { field: 'keperluan', message: 'Keperluan wajib diisi' },
      { field: 'tanggalMulai', message: 'Tanggal mulai wajib diisi' },
      { field: 'tanggalSelesai', message: 'Tanggal selesai wajib diisi' },
      { field: 'fasilitasTransport', message: 'Fasilitas transport wajib dipilih' },
      { field: 'fasilitasPenginapan', message: 'Fasilitas penginapan wajib dipilih' }
    ];

    // Check required fields efficiently
    requiredFields.forEach(({ field, message }) => {
      const value = formData[field];
      if (!value || (typeof value === 'string' && !value.trim())) {
        newErrors[field] = message;
      }
    });
    
    // Validate date range only if both dates exist
    if (formData.tanggalMulai && formData.tanggalSelesai) {
      const startDate = new Date(formData.tanggalMulai);
      const endDate = new Date(formData.tanggalSelesai);
      
      if (endDate < startDate) {
        newErrors.tanggalSelesai = 'Tanggal selesai tidak boleh lebih awal dari tanggal mulai';
      }
      
      // Check if start date is in the past
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (startDate < today) {
        newErrors.tanggalMulai = 'Tanggal mulai tidak boleh di masa lalu';
      }
    }
    
    return newErrors;
  };

  const generateNomorSurat = () => {
    const currentDate = new Date();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const year = currentDate.getFullYear();
    const randomNumber = Math.floor(Math.random() * 999) + 1;
    
    return `SPPD.${randomNumber.toString().padStart(3, '0')}/DH/${month}/${year}-B`;
  };

  // FIXED: Submit dengan error handling yang lebih baik
  const handleSubmit = async () => {
    if (loading) return; // Prevent double submission
    
    setLoading(true);
    setSubmitProgress(0);
    
    try {
      // Step 1: Validate form (20%)
      setSubmitProgress(20);
      const validationErrors = validateForm();
      
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        setLoading(false);
        setSubmitProgress(0);
        return;
      }

      // Step 2: Prepare data (40%)
      setSubmitProgress(40);
      const submissionData = {
        ...formData,
        nomorSurat: generateNomorSurat(),
        pengikut: formData.pengikut.filter(p => p.trim() !== ''),
        tanggalDibuat: new Date().toLocaleDateString('id-ID')
      };
      
      // Step 3: Submit to Firebase (70%)
      setSubmitProgress(70);
      
      // Call parent submit function with proper timeout
      await Promise.race([
        onSubmit(submissionData),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout: Koneksi terlalu lambat')), 15000)
        )
      ]);
      
      // Step 4: Success cleanup (100%)
      setSubmitProgress(100);
      
      // Reset form after successful submission
      setFormData({
        nama: '',
        jabatan: '',
        tujuan: '',
        keperluan: '',
        tanggalMulai: '',
        tanggalSelesai: '',
        biayaPerjalanan: 'Perusahaan',
        fasilitasTransport: '',
        fasilitasPenginapan: '',
        pengikut: ['']
      });
      setErrors({});
      
      // Clear progress after short delay
      setTimeout(() => {
        setSubmitProgress(0);
      }, 1000);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      
      let errorMessage = 'Gagal menyimpan data. ';
      
      if (error.message.includes('Timeout') || error.message.includes('timeout')) {
        errorMessage += 'Koneksi terlalu lambat. Coba lagi.';
      } else if (error.message.includes('network') || error.message.includes('offline')) {
        errorMessage += 'Periksa koneksi internet Anda.';
      } else if (error.message.includes('permission')) {
        errorMessage += 'Tidak memiliki izin akses.';
      } else {
        errorMessage += 'Terjadi kesalahan sistem.';
      }
      
      alert(errorMessage);
      
    } finally {
      setLoading(false);
      setSubmitProgress(0);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey && !loading) {
      handleSubmit();
    }
  };

  return (
    <div className="input-form-card">
      <h2 className="input-form-title">Input Surat Perjalanan Dinas</h2>
      
      <div className="input-form">
        {/* Row 1: Nama dan Jabatan */}
        <div className="input-form-row">
          <div className="input-form-group">
            <label className="input-form-label">Nama Lengkap *</label>
            <input
              type="text"
              value={formData.nama}
              onChange={(e) => handleInputChange('nama', e.target.value)}
              onKeyPress={handleKeyPress}
              className={`input-form-input ${errors.nama ? 'error' : ''}`}
              placeholder="Masukkan nama lengkap"
              disabled={loading}
              maxLength={100}
            />
            {errors.nama && <span className="input-form-error">{errors.nama}</span>}
          </div>
          
          <div className="input-form-group">
            <label className="input-form-label">Jabatan *</label>
            <input
              type="text"
              value={formData.jabatan}
              onChange={(e) => handleInputChange('jabatan', e.target.value)}
              onKeyPress={handleKeyPress}
              className={`input-form-input ${errors.jabatan ? 'error' : ''}`}
              placeholder="Contoh: VP ACCOUNTING"
              disabled={loading}
              maxLength={50}
            />
            {errors.jabatan && <span className="input-form-error">{errors.jabatan}</span>}
          </div>
        </div>

        {/* Row 2: Tujuan dan Keperluan */}
        <div className="input-form-row">
          <div className="input-form-group">
            <label className="input-form-label">Tujuan Perjalanan *</label>
            <input
              type="text"
              value={formData.tujuan}
              onChange={(e) => handleInputChange('tujuan', e.target.value)}
              onKeyPress={handleKeyPress}
              className={`input-form-input ${errors.tujuan ? 'error' : ''}`}
              placeholder="Contoh: YOGYAKARTA"
              disabled={loading}
              maxLength={100}
            />
            {errors.tujuan && <span className="input-form-error">{errors.tujuan}</span>}
          </div>
          
          <div className="input-form-group">
            <label className="input-form-label">Keperluan Perjalanan *</label>
            <input
              type="text"
              value={formData.keperluan}
              onChange={(e) => handleInputChange('keperluan', e.target.value)}
              onKeyPress={handleKeyPress}
              className={`input-form-input ${errors.keperluan ? 'error' : ''}`}
              placeholder="Contoh: PELATIHAN CASHFLOW"
              disabled={loading}
              maxLength={200}
            />
            {errors.keperluan && <span className="input-form-error">{errors.keperluan}</span>}
          </div>
        </div>

        {/* Row 3: Tanggal */}
        <div className="input-form-row">
          <div className="input-form-group">
            <label className="input-form-label">Tanggal Mulai *</label>
            <input
              type="date"
              value={formData.tanggalMulai}
              onChange={(e) => handleInputChange('tanggalMulai', e.target.value)}
              className={`input-form-input ${errors.tanggalMulai ? 'error' : ''}`}
              disabled={loading}
              min={new Date().toISOString().split('T')[0]}
            />
            {errors.tanggalMulai && <span className="input-form-error">{errors.tanggalMulai}</span>}
          </div>
          
          <div className="input-form-group">
            <label className="input-form-label">Tanggal Selesai *</label>
            <input
              type="date"
              value={formData.tanggalSelesai}
              onChange={(e) => handleInputChange('tanggalSelesai', e.target.value)}
              className={`input-form-input ${errors.tanggalSelesai ? 'error' : ''}`}
              disabled={loading}
              min={formData.tanggalMulai || new Date().toISOString().split('T')[0]}
            />
            {errors.tanggalSelesai && <span className="input-form-error">{errors.tanggalSelesai}</span>}
          </div>
        </div>

        {/* Row 4: Fasilitas */}
        <div className="input-form-row">
          <div className="input-form-group">
            <label className="input-form-label">Fasilitas Transport *</label>
            <select
              value={formData.fasilitasTransport}
              onChange={(e) => handleInputChange('fasilitasTransport', e.target.value)}
              className={`input-form-input ${errors.fasilitasTransport ? 'error' : ''}`}
              disabled={loading}
            >
              <option value="">Pilih Fasilitas Transport</option>
              <option value="Pesawat Udara">Pesawat Udara</option>
              <option value="Mobil Dinas">Mobil Dinas</option>
              <option value="Bus">Bus</option>
              <option value="Kereta Api">Kereta Api</option>
              <option value="Kapal">Kapal</option>
              <option value="Motor">Motor</option>
              <option value="Lainnya">Lainnya</option>
            </select>
            {errors.fasilitasTransport && <span className="input-form-error">{errors.fasilitasTransport}</span>}
          </div>
          
          <div className="input-form-group">
            <label className="input-form-label">Fasilitas Penginapan *</label>
            <select
              value={formData.fasilitasPenginapan}
              onChange={(e) => handleInputChange('fasilitasPenginapan', e.target.value)}
              className={`input-form-input ${errors.fasilitasPenginapan ? 'error' : ''}`}
              disabled={loading}
            >
              <option value="">Pilih Fasilitas Penginapan</option>
              <option value="Hotel Bintang 5">Hotel Bintang 5</option>
              <option value="Hotel Bintang 4">Hotel Bintang 4</option>
              <option value="Hotel Bintang 3">Hotel Bintang 3</option>
              <option value="Guest House">Guest House</option>
              <option value="Wisma">Wisma</option>
              <option value="Tidak Ada">Tidak Ada</option>
            </select>
            {errors.fasilitasPenginapan && <span className="input-form-error">{errors.fasilitasPenginapan}</span>}
          </div>
        </div>

        {/* Biaya Perjalanan */}
        <div className="input-form-group">
          <label className="input-form-label">Biaya Perjalanan</label>
          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="biayaPerjalanan"
                value="Perusahaan"
                checked={formData.biayaPerjalanan === 'Perusahaan'}
                onChange={(e) => handleInputChange('biayaPerjalanan', e.target.value)}
                disabled={loading}
              />
              <span className="radio-custom"></span>
              Biaya Perusahaan
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="biayaPerjalanan"
                value="Pribadi"
                checked={formData.biayaPerjalanan === 'Pribadi'}
                onChange={(e) => handleInputChange('biayaPerjalanan', e.target.value)}
                disabled={loading}
              />
              <span className="radio-custom"></span>
              Biaya Pribadi
            </label>
          </div>
        </div>

        {/* Pengikut */}
        <div className="input-form-group">
          <label className="input-form-label">Pengikut Perjalanan (Opsional)</label>
          <div className="pengikut-container">
            {formData.pengikut.map((pengikut, index) => (
              <div key={index} className="pengikut-row">
                <input
                  type="text"
                  placeholder={`Nama pengikut ${index + 1}`}
                  value={pengikut}
                  onChange={(e) => handlePengikutChange(index, e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pengikut-input"
                  disabled={loading}
                  maxLength={100}
                />
                {formData.pengikut.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePengikut(index)}
                    className="remove-pengikut-btn"
                    title="Hapus pengikut"
                    disabled={loading}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            {formData.pengikut.length < 10 && (
              <button
                type="button"
                onClick={addPengikut}
                className="add-pengikut-btn"
                disabled={loading}
              >
                + Tambah Pengikut
              </button>
            )}
          </div>
        </div>

        {/* FIXED Submit Button */}
        <button 
          onClick={handleSubmit}
          disabled={loading}
          className={`submit-btn ${loading ? 'loading' : ''}`}
        >
          <span className="submit-btn-text">
            {loading 
              ? `Menyimpan... ${submitProgress}%` 
              : 'Simpan Data Perjalanan'
            }
          </span>
        </button>
        
        {/* FIXED Hint - only show loading message when actually loading */}
        <div className="form-hint">
          {loading ? (
            <p>
              <strong>Mohon tunggu...</strong> Proses penyimpanan sedang berlangsung
            </p>
          ) : (
            <p>
              <strong>Tips:</strong> Gunakan Ctrl+Enter untuk submit form dengan cepat
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InputForm;