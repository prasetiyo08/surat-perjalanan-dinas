// src/components/PDFgenerator.js
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// DISABLED FOR DEBUGGING: The logo processing seems to cause the crash on Vercel.
// const logoBase<div><hr></div>
export const generateSuratPerjalananPDF = (data) => {
  try {
    const doc = new jsPDF('p', 'mm', 'a4');
    doc.setFont('helvetica');

    const margin = 15;
    const pageWidth = doc.internal.pageSize.width;

    // --- PAGE 1 ---
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('SURAT PERJALANAN DINAS', pageWidth / 2, margin + 10, { align: 'center' });
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Nomor: ${data.nomorSurat || 'SPPD.XX/DH/XX/XXXX-B'}`, pageWidth / 2, margin + 18, { align: 'center' });

    let y = margin + 30;
    const labelX = margin;
    const separatorX = labelX + 40;
    const valueX = separatorX + 5;
    const lineHeight = 7;

    doc.setFontSize(10);
    doc.text('Diberikan kepada:', labelX, y);
    y += lineHeight + 3;

    const drawRow = (label, value) => {
        doc.setFont('helvetica', 'bold');
        doc.text(label, labelX, y);
        doc.setFont('helvetica', 'normal');
        doc.text(':', separatorX, y);
        doc.text(value || '-', valueX, y, { maxWidth: pageWidth - valueX - margin });
        y += lineHeight;
    };
    
    drawRow('Nama', data.nama);
    drawRow('Jabatan', data.jabatan);
    drawRow('Tujuan', data.tujuan);
    drawRow('Keperluan', data.keperluan);
    y += 3;
    drawRow('Mulai Tanggal', formatSimpleDate(data.tanggalMulai));
    drawRow('Sampai dengan', formatSimpleDate(data.tanggalSelesai));
    drawRow('Dasar pelaksanaan', '');

    y += 5;
    doc.text('Keterangan lain-lain:', labelX, y);
    y += lineHeight;
    
    drawRow('Biaya Perjalanan dinas', data.biayaPerjalanan);
    drawRow('Fasilitas Transport', data.fasilitasTransport);
    drawRow('Fasilitas Penginapan', data.fasilitasPenginapan);
    
    const pengikutText = data.pengikut && data.pengikut.length > 0 && data.pengikut[0] !== ''
      ? data.pengikut.join('\n')
      : '-';
    drawRow('Pengikut', pengikutText);


    y += 10;
    doc.setFont('helvetica', 'normal');
    doc.text(
      'Demikian surat tugas ini dikeluarkan untuk dapat dilaksanakan dengan sebaik-baiknya dan penuh tanggung jawab.',
      margin,
      y,
      { maxWidth: pageWidth - margin * 2 }
    );

    const issueDate = data.createdAt?.toDate ? data.createdAt.toDate() : new Date();
    const signatureX = pageWidth - 80;
    let signatureY = y + 20;

    autoTable(doc, {
        startY: signatureY,
        theme: 'plain',
        tableWidth: 'wrap',
        margin: { left: signatureX },
        styles: { fontSize: 10, cellPadding: 0, halign: 'left' },
        body: [
            [{content: 'Dikeluarkan', styles: {cellWidth: 25}}, ':', 'Batam'],
            ['Pada tanggal', ':', formatDate(issueDate)],
            [{ content: '\nPT Bandara Internasional Batam', colSpan: 3, styles: { minCellHeight: 10 } }],
            [{ content: 'a.n Direktur Hukum & SDM', colSpan: 3 }],
            [{ content: 'u.b VP Human Capital & GA', colSpan: 3 }],
            [{ content: '\n\n\nI Wayan Widana', colSpan: 3, styles: { fontStyle: 'bold', minCellHeight: 30 } }]
        ],
        columnStyles: { 1: { cellWidth: 5 } }
    });

    // --- PAGE 2 ---
    doc.addPage();
    let finalY;

    const tableBody = [
        ['I.', 'Berangkat dari:', 'Batam', 'a.n. DIREKSI'],
        ['', '(tempat kedudukan)'],
        ['', 'Pada tanggal', ': ____________________', 'DIREKTUR HUKUM DAN SUMBER DAYA MANUSIA'],
        ['', 'Ke', ': ____________________', 'u.b.'],
        ['', '', '', 'VP HUMAN CAPITAL & GENERAL AFFAIR'],
        ['', '', ''],
        ['', '', '', { content: '\n\n\nI WAYAN WIDANA', styles: { fontStyle: 'bold', minCellHeight: 30 } }]
    ];
    autoTable(doc, { startY: margin, theme: 'plain', styles: { fontSize: 10, cellPadding: 1, valign: 'top' }, body: tableBody, columnStyles: { 0: { cellWidth: 10 }, 1: { cellWidth: 30 }, 2: { cellWidth: 60 }, 3: { halign: 'center' } } });
    // FIXED: Removed TypeScript specific syntax '(doc as any)'
    finalY = doc.lastAutoTable.finalY + 5;

    const arrivalBody = [
        ['II.', 'Tiba di', ': ____________________', 'Berangkat dari', ': ____________________'],
        ['', 'Pada tanggal', ': ____________________', 'Ke', ': ____________________'],
        ['', '', '', 'Pada tanggal', ': ____________________'],
    ];
    autoTable(doc, { startY: finalY, theme: 'plain', styles: { fontSize: 10, cellPadding: 1 }, body: arrivalBody, columnStyles: { 0: { cellWidth: 10 }, 1: { cellWidth: 30 }, 2: { cellWidth: 60 }, 3: { cellWidth: 30 }, 4: { cellWidth: 'auto'}, } });
    // FIXED: Removed TypeScript specific syntax '(doc as any)'
    finalY = doc.lastAutoTable.finalY + 5;
    
    const returnBody = [
        ['III.', 'Tiba kembali di', ': ____________________', 'a.n. DIREKSI'],
        ['', '(tempat kedudukan)'],
        ['', 'Pada tanggal', ': ____________________', 'DIREKTUR HUKUM DAN SUMBER DAYA MANUSIA'],
        ['', '', '', 'u.b.'],
        ['', '', '', 'VP HUMAN CAPITAL & GENERAL AFFAIR'],
        ['', '', ''],
        ['', '', '', { content: '\n\n\nI WAYAN WIDANA', styles: { fontStyle: 'bold', minCellHeight: 30 } }]
    ];
    autoTable(doc, { startY: finalY, theme: 'plain', styles: { fontSize: 10, cellPadding: 1, valign: 'top' }, body: returnBody, columnStyles: { 0: { cellWidth: 10 }, 1: { cellWidth: 30 }, 2: { cellWidth: 60 }, 3: { halign: 'center' } } });
    // FIXED: Removed TypeScript specific syntax '(doc as any)'
    finalY = doc.lastAutoTable.finalY + 5;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('IV. Catatan lain-lain:', margin, finalY);
    doc.text(
      'Telah diperiksa, dengan keterangan bahwa perjalanan tersebut benar dilakukan atas perintah dan semata-mata untuk kepentingan jabatan dalam waktu yang sesingkat-singkatnya.',
      margin,
      finalY + 10,
      { maxWidth: pageWidth / 2 - margin }
    );

    const filename = `SPPD_${data.nama.replace(/\s+/g, '_')}_${formatDateForFilename(issueDate)}.pdf`;
    doc.save(filename);

    console.log('PDF generated successfully');
    return true;

  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Gagal generate PDF: ' + error.message);
  }
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};

const formatSimpleDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'short', day: '2-digit' };
  return date.toLocaleDateString('en-GB', options).replace(/ /g, '-');
};

const formatDateForFilename = (date) => {
  if (!date) return '';
  return date.toISOString().split('T')[0];
};

export default { generateSuratPerjalananPDF };

