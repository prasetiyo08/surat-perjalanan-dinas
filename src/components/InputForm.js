// src/components/InputForm.js
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

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nama.trim()) newErrors.nama = 'Nama wajib diisi';
    if (!formData.jabatan.trim()) newErrors.jabatan = 'Jabatan wajib diisi';
    if (!formData.tujuan.trim()) newErrors.tujuan = 'Tujuan wajib diisi';
    if (!formData.keperluan.trim()) newErrors.keperluan = 'Keperluan wajib diisi';
    if (!formData.tanggalMulai) newErrors.tanggalMulai = 'Tanggal mulai wajib diisi';
    if (!formData.tanggalSelesai) newErrors.tanggalSelesai = 'Tanggal selesai wajib diisi';
    if (!formData.fasilitasTransport) newErrors.fasilitasTransport = 'Fasilitas transport wajib dipilih';
    if (!formData.fasilitasPenginapan) newErrors.fasilitasPenginapan = 'Fasilitas penginapan wajib dipilih';
    
    // Validate date range
    if (formData.tanggalMulai && formData.tanggalSelesai) {
      if (new Date(formData.tanggalSelesai) < new Date(formData.tanggalMulai)) {
        newErrors.tanggalSelesai = 'Tanggal selesai tidak boleh lebih awal dari tanggal mulai';
      }
    }
    
    // Validate past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (formData.tanggalMulai) {
      const startDate = new Date(formData.tanggalMulai);
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

  const handleSubmit = async () => {
    // Set loading state
    setLoading(true);
    
    try {
      const validationErrors = validateForm();
      
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        setLoading(false);
        return;
      }

      const submissionData = {
        ...formData,
        nomorSurat: generateNomorSurat(),
        pengikut: formData.pengikut.filter(p => p.trim() !== ''), // Remove empty pengikut
        tanggalDibuat: new Date().toLocaleDateString('id-ID') // Will be overridden by Firestore createdAt
      };
      
      // Call onSubmit (async function from Dashboard)
      await onSubmit(submissionData);
      
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
      
    } catch (error) {
      console.error('Error submitting form:', error);
      // Error handling akan ditangani di Dashboard component
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
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

        {/* Submit Button */}
        <button 
          onClick={handleSubmit}
          disabled={loading}
          className={`submit-btn ${loading ? 'loading' : ''}`}
        >
          <span className="submit-btn-text">
            {loading ? 'Menyimpan Data...' : 'Simpan Data Perjalanan'}
          </span>
        </button>
        
        {/* Hint */}
        <div className="form-hint">
          <p>
            <strong>Tips:</strong> Gunakan Ctrl+Enter untuk submit form dengan cepat
          </p>
        </div>
      </div>
    </div>
  );
};

export default InputForm;