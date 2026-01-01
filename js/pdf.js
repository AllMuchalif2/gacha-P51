// PDF Export Module
class PDFExporter {
  constructor() {
    this.jsPDF = window.jspdf?.jsPDF;
  }

  exportKelompok(kelompokData, totalAnggota) {
    if (!this.jsPDF) {
      alert("jsPDF library tidak tersedia");
      return;
    }

    if (kelompokData.length === 0) {
      alert("Belum ada kelompok yang dibuat");
      return;
    }

    const doc = new this.jsPDF();

    doc.setFontSize(16);
    doc.text("Daftar Kelompok", 10, 10);
    doc.setFontSize(12);
    doc.text(`Total Anggota: ${totalAnggota}`, 10, 18);
    doc.text(`Jumlah Kelompok: ${kelompokData.length}`, 10, 26);

    let yPos = 40;

    kelompokData.forEach((group, idx) => {
      doc.setFontSize(14);
      doc.text(`Kelompok ${idx + 1} (${group.length} orang)`, 10, yPos);
      yPos += 10;

      doc.setFontSize(12);
      group.forEach((anggota, anggotaIdx) => {
        doc.text(`${anggotaIdx + 1}. ${anggota.nama}`, 15, yPos);
        yPos += 7;

        if (yPos > 280) {
          doc.addPage();
          yPos = 20;
        }
      });

      yPos += 10;
    });

    doc.save(`kelompok_${new Date().toISOString().slice(0, 10)}.pdf`);
  }
}

export default PDFExporter;
