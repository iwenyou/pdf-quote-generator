import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './NotoSansSC';

export function generatePDF(formData, spaces) {
  const doc = new jsPDF();

  // Set the custom font and size
  doc.setFont('NotoSansSC', 'normal');
  doc.setFontSize(12); // Ensure font size is set
  console.log('Current Font:', doc.getFont());

  // Add header image
  const imgData = 'data:image/jpeg;base64,...'; // Base64 encoded image data
  doc.addImage(imgData, 'JPEG', 15, 10, 50, 25);

  // Add client details
  doc.text(20, 50, `Name: ${formData.client.name}`);
  doc.text(20, 60, `Address: ${formData.client.address}`);
  doc.text(20, 70, `Date: ${new Date().toLocaleDateString()}`);

  // Add table with quote details
  const tableColumn = ['Space', 'Space Name', 'Category', 'Product Type', 'Part Name', 'Material Name', 'Cost', 'Height', 'Width', 'Thickness', 'Number', 'Coefficient'];
  const tableRows = [];

  spaces.forEach((space, spaceIndex) => {
    space.products.forEach(product => {
      product.parts.forEach(part => {
        const dataRow = [
          spaceIndex + 1,
          space.name,
          product.selectedCategoryName,
          product.selectedProductName,
          part.name,
          part.selectedMaterial,
          part.selectedMaterialCost,
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
    startY: 80
  });

  // Save the PDF
  doc.save('quote.pdf');
}
