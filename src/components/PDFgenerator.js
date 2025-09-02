// src/components/PDFGenerator.js
import jsPDF from 'jspdf';

// Set font untuk support bahasa Indonesia
import 'jspdf/dist/polyfills.es.js';

export const generateSuratPerjalananPDF = (data) => {
  try {
    // Create new jsPDF instance
    const doc = new jsPDF('p', 'mm', 'a4');
    
    // Set font (default font untuk support karakter Indonesia)
    doc.setFont('helvetica');
    
    // Margin
    const margin = 20;
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    
    // Header perusahaan
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('PT BANDARA INTERNASIONAL BATAM', pageWidth / 2, margin, { align: 'center' });
    
    // Title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('SURAT PERJALANAN DINAS', pageWidth / 2, margin + 15, { align: 'center' });
    
    // Nomor Surat
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Nomor : ${data.nomorSurat}`, pageWidth / 2, margin + 25, { align: 'center' });
    
    // Line separator
    doc.line(margin, margin + 35, pageWidth - margin, margin + 35);
    
    let yPosition = margin + 50;
    
    // Content section
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    
    // Diberikan kepada
    doc.text('Diberikan kepada :', margin, yPosition);
    yPosition += 10;
    
    // Data fields
    const fields = [
      { label: 'Nama', value: data.nama },
      { label: 'Jabatan', value: data.jabatan },
      { label: 'Tujuan', value: data.tujuan },
      { label: 'Keperluan', value: data.keperluan }
    ];
    
    fields.forEach(field => {
      doc.setFont('helvetica', 'bold');
      doc.text(`${field.label} :`, margin, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.text(field.value, margin + 35, yPosition);
      yPosition += 8;
    });
    
    yPosition += 5;
    
    // Tanggal
    doc.setFont('helvetica', 'bold');
    doc.text('Mulai Tanggal :', margin, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(formatDate(data.tanggalMulai), margin + 40, yPosition);
    yPosition += 8;
    
    doc.setFont('helvetica', 'bold');
    doc.text('Sampai dengan :', margin, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(formatDate(data.tanggalSelesai), margin + 40, yPosition);
    yPosition += 15;
    
    // Keterangan lain-lain
    doc.setFont('helvetica', 'bold');
    doc.text('Keterangan lain-lain :', margin, yPosition);
    yPosition += 8;
    
    const keterangan = [
      `- Biaya Perjalanan dinas : ${data.biayaPerjalanan}`,
      `- Fasilitas Transport : ${data.fasilitasTransport}`,
      `- Fasilitas Penginapan : ${data.fasilitasPenginapan}`
    ];
    
    doc.setFont('helvetica', 'normal');
    keterangan.forEach(item => {
      doc.text(item, margin, yPosition);
      yPosition += 6;
    });
    
    // Pengikut (jika ada)
    if (data.pengikut && data.pengikut.length > 0 && data.pengikut[0] !== '') {
      doc.text('- Pengikut :', margin, yPosition);
      yPosition += 6;
      data.pengikut.forEach(pengikut => {
        doc.text(`  ${pengikut}`, margin + 10, yPosition);
        yPosition += 6;
      });
    }
    
    yPosition += 15;
    
    // Penutup
    const penutup = [
      'Demikian surat tugas ini dikeluarkan untuk dapat dilaksanakan dengan sebaik-baiknya',
      'dan penuh tanggung jawab.'
    ];
    
    penutup.forEach(line => {
      doc.text(line, margin, yPosition);
      yPosition += 6;
    });
    
    yPosition += 15;
    
    // Footer - Tanggal dan tempat
    doc.text('Dikeluarkan : Batam', margin, yPosition);
    yPosition += 6;
    doc.text(`Pada tanggal : ${formatDate(new Date())}`, margin, yPosition);
    
    // Tanda tangan section
    yPosition += 20;
    const ttdX = pageWidth - 80;
    
    doc.text('PT Bandara Internasional Batam', ttdX, yPosition);
    yPosition += 6;
    doc.text('a.n Direktur Hukum & SDM', ttdX, yPosition);
    yPosition += 6;
    doc.text('u.b VP Human Capital & GA', ttdX, yPosition);
    yPosition += 25;
    doc.setFont('helvetica', 'bold');
    doc.text('I Wayan Widana', ttdX, yPosition);
    
    // Second page - Form perjalanan
    doc.addPage();
    
    // Reset position
    yPosition = margin;
    
    // Header page 2
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('SURAT PERJALANAN DINAS', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 8;
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Nomor : ${data.nomorSurat}`, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 20;
    
    // Table structure for travel details
    const sections = [
      { 
        title: 'I. Berangkat dari : Batam',
        fields: [
          'Pada tanggal : _______________',
          'Ke : ______________________'
        ]
      },
      { 
        title: 'II. Tiba di : ________________',
        fields: [
          'Pada tanggal : _______________',
          'Berangkat dari : ______________',
          'Ke : ______________________',
          'Pada tanggal : _______________'
        ]
      },
      { 
        title: 'III. Tiba kembali di : __________',
        fields: [
          'Pada tanggal : _______________'
        ]
      }
    ];
    
    sections.forEach(section => {
      doc.setFont('helvetica', 'bold');
      doc.text(section.title, margin, yPosition);
      yPosition += 10;
      
      doc.setFont('helvetica', 'normal');
      section.fields.forEach(field => {
        doc.text(field, margin + 10, yPosition);
        yPosition += 8;
      });
      yPosition += 10;
    });
    
    // Signature sections for page 2
    yPosition += 10;
    doc.text('a.n. DIREKSI', ttdX, yPosition);
    yPosition += 6;
    doc.text('DIREKTUR HUKUM DAN SUMBER DAYA MANUSIA', ttdX, yPosition);
    yPosition += 6;
    doc.text('u.b.', ttdX, yPosition);
    yPosition += 6;
    doc.text('VP HUMAN CAPITAL & GENERAL AFFAIR', ttdX, yPosition);
    yPosition += 20;
    doc.setFont('helvetica', 'bold');
    doc.text('I WAYAN WIDANA', ttdX, yPosition);
    
    // Final section
    yPosition += 30;
    doc.setFont('helvetica', 'bold');
    doc.text('IV. Catatan lain-lain:', margin, yPosition);
    yPosition += 15;
    
    doc.setFont('helvetica', 'normal');
    const catatanText = [
      'Telah diperiksa, dengan keterangan bahwa perjalanan tersebut',
      'benar dilakukan atas perintah dan semata-mata untuk kepentingan',
      'jabatan dalam waktu yang sesingkat-singkatnya.'
    ];
    
    catatanText.forEach(line => {
      doc.text(line, margin, yPosition);
      yPosition += 6;
    });
    
    // Generate filename
    const filename = `SPPD_${data.nama.replace(/\s+/g, '_')}_${formatDateForFilename(new Date())}.pdf`;
    
    // Save the PDF
    doc.save(filename);
    
    console.log('PDF generated successfully');
    return true;
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Gagal generate PDF: ' + error.message);
  }
};

// Helper functions
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};

const formatDateForFilename = (date) => {
  return date.toISOString().split('T')[0];
};

// Export default
export default { generateSuratPerjalananPDF };