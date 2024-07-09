import jsPDF from 'jspdf';
import 'jspdf-autotable';

export function generatePDF(formData, rows) {
  const doc = new jsPDF();

  // Add header image
  const imgData = 'data:image/jpeg;base64,...'; // Base64 encoded image data
  doc.addImage(imgData, 'JPEG', 15, 10, 50, 25);

  // Add client details
  doc.text(20, 50, `Name: ${formData.client.name}`);
  doc.text(20, 60, `Address: ${formData.client.address}`);

  // Add table with quote details
  const tableColumn = ['Category', 'Product Type', 'Part Name', 'Material Name', 'Cost', 'Height', 'Width', 'Thickness', 'Number', 'Coefficient'];
  const tableRows = [];

  rows.forEach(row => {
    row.parts.forEach(part => {
      part.materials.forEach(material => {
        const dataRow = [
          row.selectedCategory,
          row.selectedProduct,
          part.name,
          material.name,
          `$${material.cost}`,
          part.size.height,
          part.size.width,
          part.size.thickness,
          part.count.number,
          part.count.coefficient
        ];
        tableRows.push(dataRow);
      });
    });
  });

  doc.autoTable(tableColumn, tableRows, { startY: 70 });

  // Save the PDF
  doc.save('quote.pdf');
}
