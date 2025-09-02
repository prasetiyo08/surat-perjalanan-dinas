import jsPDF from 'jspdf';
import 'jspdf-autotable';
// import 'jspdf/dist/polyfills.es.js'; // Keep this removed

const logoBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAANQSURBVHhe7d1vb+JVDMfx9e1NAiEhDRgM8hQJ8iQkiA+QP8AP4I9QPAkPaehBSoqEhB5A8gQRkzzJm/Gvj9Wapu2Z2Xv22t/te36etb621p5nZ2Z3dqVSqVQqlUqlUqlUKpWqB+B63MBt3MR13MMHHMYh/Bbn8BC/43t4jo/xFd7FcPwEV/E9bMVGvIX38BjvwEd4Gq/g2/gSduMjbMVWnMPTeBf242fcxY/xCL6OF3ET3+B7+B5243M8g8d4Dq9h4987PoRX8AGewbN4Ct/AFyB/L/Pvwk/wCX4L38Zt/BHP4mUcwW3cgk/hSbiJ13ARv+AD/BUn8CgO4zfcwR/wFd7D/biG/b8f9/AZD+E3/B2P4knsxpN4Do/iTdzFfTiNB3Aan8JBeBT/wt04joN4CgdxF/fgX3gQj+BDfB6P4E08iS/wBR7BPfgo7sJj+Bq/4wYcw0Ecxx04h2P4FrfgXlyD/jdwAIfxKI7jfuwH3O0G3MM7cB2f4z7uwmU8igdxAPfgXLyGp/Eibsc7cBmH8BBuw8/xBe6GjXiPz/AjbsNWfI5f4U7cjPfwD+6E2/Ecbseb+Bv34xbuw204h/twBf+H++BefA634XFcj1uwF/fhdB+uw53Yh7twDf/3cDvuw3U8jeu4G9/hbuzAJbiKz/An7sfP+B73YBP2428cw5P4K+7Fk3gWX8BduAJ34QncjSdxFJ/gQ9yBD3A/3os38A4ew22cxy2YgP/f4z7sxs/4DnfhGtzB/XgOvyfA/51v4vE8iR+wl/s5A/6P8AMew8v4EvcjA/5T/AJ+D4j/q/A6fsxR/zP4L0yA/1zH90sA/N+GD/Ekbscn+D3o/0fciB/xb3D/k/hV+P/L+DdeA/+5/38A/9+F/0D4X/iH8P+1+D8/fH/8V7wA/3P/XwD/34//QPg//Bv+/zr8vzz8/9h34U+E/+kP/B/87/x/qFQqlUqlUqlUKpVKpQYV/wAnN1bUf/4q9wAAAABJRU5ErkJggg==';


export const generateSuratPerjalananPDF = (data) => {
  try {
    const doc = new jsPDF('p', 'mm', 'a4');
    doc.setFont('helvetica');

    const margin = 15;
    const pageWidth = doc.internal.pageSize.width;

    // --- PAGE 1 ---

    doc.addImage(logoBase64, 'PNG', margin, margin, 30, 30);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('SURAT PERJALANAN DINAS', pageWidth - margin, margin + 10, { align: 'right' });
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Nomor: ${data.nomorSurat || 'SPPD.XX/DH/XX/XXXX-B'}`, pageWidth - margin, margin + 18, { align: 'right' });

    // --- Manual Text Placement for Stability ---
    let y = margin + 50;
    const labelX = margin;
    const separatorX = labelX + 40;
    const valueX = separatorX + 5;
    const lineHeight = 7;

    doc.setFontSize(10);
    doc.text('Diberikan kepada:', labelX, y);
    y += lineHeight + 3;

    // A helper function for drawing rows to ensure alignment
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
    
    // Handle 'Pengikut' which can be an array
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
    doc.autoTable({ startY: margin, theme: 'plain', styles: { fontSize: 10, cellPadding: 1, valign: 'top' }, body: tableBody, columnStyles: { 0: { cellWidth: 10 }, 1: { cellWidth: 30 }, 2: { cellWidth: 60 }, 3: { halign: 'center' } } });
    finalY = doc.lastAutoTable.finalY + 5;

    const arrivalBody = [
        ['II.', 'Tiba di', ': ____________________', 'Berangkat dari', ': ____________________'],
        ['', 'Pada tanggal', ': ____________________', 'Ke', ': ____________________'],
        ['', '', '', 'Pada tanggal', ': ____________________'],
    ];
    doc.autoTable({ startY: finalY, theme: 'plain', styles: { fontSize: 10, cellPadding: 1 }, body: arrivalBody, columnStyles: { 0: { cellWidth: 10 }, 1: { cellWidth: 30 }, 2: { cellWidth: 60 }, 3: { cellWidth: 30 }, 4: { cellWidth: 'auto'}, } });
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
    doc.autoTable({ startY: finalY, theme: 'plain', styles: { fontSize: 10, cellPadding: 1, valign: 'top' }, body: returnBody, columnStyles: { 0: { cellWidth: 10 }, 1: { cellWidth: 30 }, 2: { cellWidth: 60 }, 3: { halign: 'center' } } });
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