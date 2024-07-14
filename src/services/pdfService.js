import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './NotoSansSC';

export function generatePDF(formData, spaces) {
  const doc = new jsPDF();

  // Set the custom font and size
  doc.setFont('NotoSansSC', 'normal');
  doc.setFontSize(12); // Ensure font size is set
  console.log('Current Font:', doc.getFont());
  console.log('Spaces passed to pdf generator:', spaces);

  // Add header image
  const imgData = 'data:image/jpeg;base64,...'; // Base64 encoded image data
  doc.addImage(imgData, 'JPEG', 15, 10, 50, 25);

  // Add client details
  doc.text(20, 50, `Name: ${formData.client.name}`);
  doc.text(20, 60, `Address: ${formData.client.address}`);
  doc.text(20, 70, `Date: ${new Date().toLocaleDateString()}`);

  // Define table columns
  const tableColumn = ['Space', 'Space Name', 'Product Type', 'Part Name', 'Material Name', 'Height', 'Width', 'Thickness', 'Number', 'Coefficient', 'Displayed Price', 'Total Price'];

  const tableRows = [];
  let totalQuotePrice = 0;
  let previousSpaceIndex = -1;

  spaces.forEach((space, spaceIndex) => {
    let totalSpacePrice = 0;

    if (space.products.length > 0) {
      space.products.forEach((product) => {
        const dataRow = [
          spaceIndex + 1,
          space.name,
          product.selectedProductName,
          product.name,
          product.selectedMaterial,
          product.size.height,
          product.size.width,
          product.size.thickness,
          product.count.number,
          product.count.coefficient,
          product.displayedPrice.toFixed(2),
          ''
        ];

        totalSpacePrice += product.displayedPrice;

        // Add the rowspan property to the first occurrence of each space index
        if (spaceIndex !== previousSpaceIndex) {
          previousSpaceIndex = spaceIndex;
        } else {
          dataRow[0] = '';
          dataRow[1] = '';
        }

        tableRows.push(dataRow);
      });

      // Add the total space price to the last row of the space
      if (tableRows.length > 0) {
        tableRows[tableRows.length - 1][11] = totalSpacePrice.toFixed(2);
      }

      totalQuotePrice += totalSpacePrice;
    } else {
      console.warn('Space has no products:', space);
    }
  });

  // Add the total quote price row with merged cells and bold text
  tableRows.push([
    { content: 'Total Quote Price', colSpan: 11, styles: { halign: 'right', fontStyle: 'bold' } },
    totalQuotePrice.toFixed(2)
  ]);

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
