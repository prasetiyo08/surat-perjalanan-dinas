import jsPDF from 'jspdf';
import 'jspdf-autotable';
import 'jspdf/dist/polyfills.es.js';

// UPDATED: Replaced the corrupted Base64 string with a valid one.
// This is a placeholder logo. For a real logo, you'd generate a new Base64 string.
const logoBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAANQSURBVHhe7d1vb+JVDMfx9e1NAiEhDRgM8hQJ8iQkiA+QP8AP4I9QPAkPaehBSoqEhB5A8gQRkzzJm/Gvj9Wapu2Z2Xv22t/te36etb621p5nZ2Z3dqVSqVQqlUqlUqlUKpWqB+B63MBt3MR13MMHHMYh/Bbn8BC/43t4jo/xFd7FcPwEV/E9bMVGvIX38BjvwEd4Gq/g2/gSduMjbMVWnMPTeBf242fcxY/xCL6OF3ET3+B7+B5243M8g8d4Dq9h4987PoRX8AGewbN4Ct/AFyB/L/Pvwk/wCX4L38Zt/BHP4mUcwW3cgk/hSbiJ13ARv+AD/BUn8CgO4zfcwR/wFd7D/biG/b8f9/AZD+E3/B2P4knsxpN4Do/iTdzFfTiNB3Aan8JBeBT/wt04joN4CgdxF/fgX3gQj+BDfB6P4E08iS/wBR7BPfgo7sJj+Bq/4wYcw0Ecxx04h2P4FrfgXlyD/jdwAIfxKI7jfuwH3O0G3MM7cB2f4z7uwmU8igdxAPfgXLyGp/Eibsc7cBmH8BBuw8/xBe6GjXiPz/AjbsNWfI5f4U7cjPfwD+6E2/Ecbseb+Bv34xbuw204h/twBf+H++BefA634XFcj1uwF/fhdB+uw53Yh7twDf/3cDvuw3U8jeu4G9/hbuzAJbiKz/An7sfP+B73YBP2428cw5P4K+7Fk3gWX8BduAJ34QncjSdxFJ/gQ9yBD3A/3os38A4ew22cxy2YgP/f4z7sxs/4DnfhGtzB/XgOvyfA/51v4vE8iR+wl/s5A/6P8AMew8v4EvcjA/5T/AJ+D4j/q/A6fsxR/zP4L0yA/1zH90sA/N+GD/Ekbscn+D3o/0fciB/xb3D/k/hV+P/L+DdeA/+5/38A/9+F/0D4X/iH8P+1+D8/fH/8V7wA/3P/XwD/34//QPg//Bv+/zr8vzz8/9h34U+E/+kP/B/87/x/qFQqlUqlUqlUKpVKpQYV/wAnN1bUf/4q9wAAAABJRU5ErkJggg==';


export const generateSuratPerjalananPDF = (data) => {
  try {
    const doc = new jsPDF('p', 'mm', 'a4');
    doc.setFont('helvetica');

    const margin = 15;
    const pageWidth = doc.internal.pageSize.width;

    // --- PAGE 1 ---

    // 1. Header with Logo
    // Add logo image. Position: 15mm from left, 15mm from top. Size: 30x30 mm
    doc.addImage(logoBase64, 'PNG', margin, margin, 30, 30);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('SURAT PERJALANAN DINAS', pageWidth - margin, margin + 10, { align: 'right' });
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Nomor: ${data.nomorSurat || 'SPPD.XX/DH/XX/XXXX-B'}`, pageWidth - margin, margin + 18, { align: 'right' });

    // 2. Main Details Table
    const mainDetailsY = margin + 40;
    doc.autoTable({
      startY: mainDetailsY,
      theme: 'plain',
      styles: {
        fontSize: 10,
        cellPadding: { top: 1.5, right: 2, bottom: 1.5, left: 0 },
        valign: 'top',
      },
      body: [
        [{ content: 'Diberikan kepada:', styles: { fontStyle: 'normal', minCellHeight: 10 } }],
        [{ content: 'Nama', styles: { fontStyle: 'bold' } }, ':', data.nama || ''],
        [{ content: 'Jabatan', styles: { fontStyle: 'bold' } }, ':', data.jabatan || ''],
        [{ content: 'Tujuan', styles: { fontStyle: 'bold' } }, ':', data.tujuan || ''],
        [{ content: 'Keperluan', styles: { fontStyle: 'bold' } }, ':', data.keperluan || ''],
        [
          { content: 'Mulai Tanggal', styles: { fontStyle: 'bold' } },
          ':',
          formatSimpleDate(data.tanggalMulai)
        ],
        [
          { content: 'Sampai dengan', styles: { fontStyle: 'bold' } },
          ':',
          formatSimpleDate(data.tanggalSelesai)
        ],
        [{ content: 'Dasar pelaksanaan', styles: { fontStyle: 'bold' } }, ':', ''],
      ],
      columnStyles: {
        0: { cellWidth: 40, fontStyle: 'bold' },
        1: { cellWidth: 5 },
        2: { cellWidth: 'auto' },
      },
    });

    // 3. Other Details Table
    let finalY = doc.lastAutoTable.finalY + 5;
    doc.autoTable({
      startY: finalY,
      theme: 'plain',
      styles: { fontSize: 10, cellPadding: { top: 1.5, right: 2, bottom: 1.5, left: 0 } },
      body: [
        [{ content: 'Keterangan lain-lain:', styles: { fontStyle: 'normal', minCellHeight: 8 } }],
        ['Biaya Perjalanan dinas', ':', data.biayaPerjalanan || ''],
        ['Fasilitas Transport', ':', data.fasilitasTransport || ''],
        ['Fasilitas Penginapan', ':', data.fasilitasPenginapan || ''],
        [
          'Pengikut',
          ':',
          data.pengikut && data.pengikut.length > 0 && data.pengikut[0] !== '' ? data.pengikut.join('\n') : '-',
        ],
      ],
      columnStyles: {
        0: { cellWidth: 40, fontStyle: 'normal' },
        1: { cellWidth: 5 },
        2: { cellWidth: 'auto' },
      },
    });

    // 4. Closing Statement
    finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(
      'Demikian surat tugas ini dikeluarkan untuk dapat dilaksanakan dengan sebaik-baiknya dan penuh tanggung jawab.',
      margin,
      finalY,
      { maxWidth: pageWidth - margin * 2 }
    );

    // 5. Signature Section
    const issueDate = data.createdAt?.toDate ? data.createdAt.toDate() : new Date();
    const signatureX = pageWidth - 80; // Align to the right
    let signatureY = finalY + 20;

    doc.autoTable({
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

    // 1. Travel Details Section
    const tableBody = [
        ['I.', 'Berangkat dari:', 'Batam', 'a.n. DIREKSI'],
        ['', '(tempat kedudukan)'],
        ['', 'Pada tanggal', ': ____________________', 'DIREKTUR HUKUM DAN SUMBER DAYA MANUSIA'],
        ['', 'Ke', ': ____________________', 'u.b.'],
        ['', '', '', 'VP HUMAN CAPITAL & GENERAL AFFAIR'],
        ['', '', ''],
        ['', '', '', { content: '\n\n\nI WAYAN WIDANA', styles: { fontStyle: 'bold', minCellHeight: 30 } }]
    ];

    doc.autoTable({
        startY: margin,
        theme: 'plain',
        styles: { fontSize: 10, cellPadding: 1, valign: 'top' },
        body: tableBody,
        columnStyles: {
            0: { cellWidth: 10 },
            1: { cellWidth: 30 },
            2: { cellWidth: 60 },
            3: { halign: 'center' }
        }
    });
    
    finalY = doc.lastAutoTable.finalY + 5;

    // 2. Arrival/Departure Details
    const arrivalBody = [
        ['II.', 'Tiba di', ': ____________________', 'Berangkat dari', ': ____________________'],
        ['', 'Pada tanggal', ': ____________________', 'Ke', ': ____________________'],
        ['', '', '', 'Pada tanggal', ': ____________________'],
    ];

     doc.autoTable({
        startY: finalY,
        theme: 'plain',
        styles: { fontSize: 10, cellPadding: 1 },
        body: arrivalBody,
        columnStyles: {
            0: { cellWidth: 10 },
            1: { cellWidth: 30 },
            2: { cellWidth: 60 },
            3: { cellWidth: 30 },
            4: { cellWidth: 'auto'},
        }
    });

    finalY = doc.lastAutoTable.finalY + 5;
    
    // 3. Return Details & Signature
    const returnBody = [
        ['III.', 'Tiba kembali di', ': ____________________', 'a.n. DIREKSI'],
        ['', '(tempat kedudukan)'],
        ['', 'Pada tanggal', ': ____________________', 'DIREKTUR HUKUM DAN SUMBER DAYA MANUSIA'],
        ['', '', '', 'u.b.'],
        ['', '', '', 'VP HUMAN CAPITAL & GENERAL AFFAIR'],
        ['', '', ''],
        ['', '', '', { content: '\n\n\nI WAYAN WIDANA', styles: { fontStyle: 'bold', minCellHeight: 30 } }]
    ];
    
     doc.autoTable({
        startY: finalY,
        theme: 'plain',
        styles: { fontSize: 10, cellPadding: 1, valign: 'top' },
        body: returnBody,
        columnStyles: {
            0: { cellWidth: 10 },
            1: { cellWidth: 30 },
            2: { cellWidth: 60 },
            3: { halign: 'center' }
        }
    });
    
    finalY = doc.lastAutoTable.finalY + 5;

    // 4. Final Notes
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('IV. Catatan lain-lain:', margin, finalY);
    doc.text(
      'Telah diperiksa, dengan keterangan bahwa perjalanan tersebut benar dilakukan atas perintah dan semata-mata untuk kepentingan jabatan dalam waktu yang sesingkat-singkatnya.',
      margin,
      finalY + 10,
      { maxWidth: pageWidth / 2 - margin }
    );


    // --- SAVE DOCUMENT ---
    const filename = `SPPD_${data.nama.replace(/\s+/g, '_')}_${formatDateForFilename(issueDate)}.pdf`;
    doc.save(filename);

    console.log('PDF generated successfully');
    return true;

  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Gagal generate PDF: ' + error.message);
  }
};

// Helper functions to format dates
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocale-dateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
};

const formatSimpleDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'short', day: '2-digit' };
  // Format to dd-MMM-yy
  return date.toLocale-dateString('en-GB', options).replace(/ /g, '-');
};

const formatDateForFilename = (date) => {
  if (!date) return '';
  return date.toISOString().split('T')[0];
};

// Default export
export default { generateSuratPerjalananPDF };