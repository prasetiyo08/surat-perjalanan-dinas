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
    
    return newErrors;
  };

  const handleSubmit = () => {
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const submissionData = {
      ...formData,
      id: Date.now(),
      tanggalDibuat: new Date().toLocaleDateString('id-ID'),
      nomorSurat: `SPPD.${Math.floor(Math.random() * 100)}/DH/${new Date().getMonth() + 1}/${new Date().getFullYear()}-B`,
      pengikut: formData.pengikut.filter(p => p.trim() !== '') // Remove empty pengikut
    };
    
    onSubmit(submissionData);
    
    // Reset form
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
  };

  return (
    <div className="input-form-card">
      <h2 className="input-form-title">Input Surat Perjalanan Dinas</h2>
      
      <div className="input-form">
        {/* Row 1: Nama dan Jabatan */}
        <div className="input-form-row">
          <div className="input-form-group">
            <label className="input-form-label">Nama *</label>
            <input
              type="text"
              value={formData.nama}
              onChange={(e) => handleInputChange('nama', e.target.value)}
              className={`input-form-input ${errors.nama ? 'error' : ''}`}
              placeholder="Masukkan nama lengkap"
            />
            {errors.nama && <span className="input-form-error">{errors.nama}</span>}
          </div>
          
          <div className="input-form-group">
            <label className="input-form-label">Jabatan *</label>
            <input
              type="text"
              value={formData.jabatan}
              onChange={(e) => handleInputChange('jabatan', e.target.value)}
              className={`input-form-input ${errors.jabatan ? 'error' : ''}`}
              placeholder="Contoh: VP ACCOUNTING"
            />
            {errors.jabatan && <span className="input-form-error">{errors.jabatan}</span>}
          </div>
        </div>

        {/* Row 2: Tujuan dan Keperluan */}
        <div className="input-form-row">
          <div className="input-form-group">
            <label className="input-form-label">Tujuan *</label>
            <input
              type="text"
              value={formData.tujuan}
              onChange={(e) => handleInputChange('tujuan', e.target.value)}
              className={`input-form-input ${errors.tujuan ? 'error' : ''}`}
              placeholder="Contoh: YOGYAKARTA"
            />
            {errors.tujuan && <span className="input-form-error">{errors.tujuan}</span>}
          </div>
          
          <div className="input-form-group">
            <label className="input-form-label">Keperluan *</label>
            <input
              type="text"
              value={formData.keperluan}
              onChange={(e) => handleInputChange('keperluan', e.target.value)}
              className={`input-form-input ${errors.keperluan ? 'error' : ''}`}
              placeholder="Contoh: PELATIHAN CASHFLOW"
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
            >
              <option value="">Pilih Transport</option>
              <option value="Pesawat Udara">Pesawat Udara</option>
              <option value="Mobil Dinas">Mobil Dinas</option>
              <option value="Bus">Bus</option>
              <option value="Kereta Api">Kereta Api</option>
              <option value="Kapal">Kapal</option>
            </select>
            {errors.fasilitasTransport && <span className="input-form-error">{errors.fasilitasTransport}</span>}
          </div>
          
          <div className="input-form-group">
            <label className="input-form-label">Fasilitas Penginapan *</label>
            <select
              value={formData.fasilitasPenginapan}
              onChange={(e) => handleInputChange('fasilitasPenginapan', e.target.value)}
              className={`input-form-input ${errors.fasilitasPenginapan ? 'error' : ''}`}
            >
              <option value="">Pilih Penginapan</option>
              <option value="Hotel">Hotel</option>
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
              />
              <span className="radio-custom"></span>
              Perusahaan
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="biayaPerjalanan"
                value="Pribadi"
                checked={formData.biayaPerjalanan === 'Pribadi'}
                onChange={(e) => handleInputChange('biayaPerjalanan', e.target.value)}
              />
              <span className="radio-custom"></span>
              Pribadi
            </label>
          </div>
        </div>

        {/* Pengikut */}
        <div className="input-form-group">
          <label className="input-form-label">Pengikut (Opsional)</label>
          <div className="pengikut-container">
            {formData.pengikut.map((pengikut, index) => (
              <div key={index} className="pengikut-row">
                <input
                  type="text"
                  placeholder={`Nama pengikut ${index + 1}`}
                  value={pengikut}
                  onChange={(e) => handlePengikutChange(index, e.target.value)}
                  className="pengikut-input"
                />
                {formData.pengikut.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePengikut(index)}
                    className="remove-pengikut-btn"
                    title="Hapus pengikut"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addPengikut}
              className="add-pengikut-btn"
            >
              + Tambah Pengikut
            </button>
          </div>
        </div>

        <button 
          onClick={handleSubmit}
          className="submit-btn"
        >
          <span className="submit-btn-text">Simpan Data Perjalanan</span>
        </button>
      </div>
    </div>
  );
};

export default InputForm;