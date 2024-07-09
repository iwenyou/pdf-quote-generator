import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './NotoSansSC'; // Ensure this path is correct

export function generatePDF(rows) {
  const doc = new jsPDF();

  // Set the custom font and size
  doc.setFont('NotoSansSC', 'normal');
  doc.setFontSize(12); // Ensure font size is set
  console.log('Current Font:', doc.getFont());

  // Add header image
  const imgData = 'data:image/jpeg;base64,...'; // Base64 encoded image data
  doc.addImage(imgData, 'JPEG', 15, 10, 50, 25);

  // Add some Chinese text to verify
  //doc.text('测试中文字符', 10, 40);

  // Add table with quote details
  const tableColumn = ['Category', 'Product Type', 'Part Name', 'Material Name', 'Cost', 'Height', 'Width', 'Thickness', 'Number', 'Coefficient'];
  const tableRows = [];

  console.log('Rows:', rows);

  rows.forEach(row => {
    row.parts.forEach(part => {
      part.materials.forEach(material => {
        const dataRow = [
          row.selectedCategoryName, // Use the name instead of ID
          row.selectedProductName,  // Use the name instead of ID
          part.name,
          material.name,
          material.cost,
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

  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    styles: { font: 'NotoSansSC', fontStyle: 'normal' }, // Ensure font is used in the table
    headStyles: { font: 'NotoSansSC', fontStyle: 'normal' }, // Apply to header
    bodyStyles: { font: 'NotoSansSC', fontStyle: 'normal' }, // Apply to body
    columnStyles: {
      0: { font: 'NotoSansSC', fontStyle: 'normal' }, // Category
      1: { font: 'NotoSansSC', fontStyle: 'normal' }, // Product Type
      2: { font: 'NotoSansSC', fontStyle: 'normal' }, // Part Name
      3: { font: 'NotoSansSC', fontStyle: 'normal' }, // Material Name
      // Add more if needed
    },
    startY: 70
  });

  // Save the PDF
  doc.save('quote.pdf');
}
