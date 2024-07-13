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

  // Add table with quote details
  //const tableColumn = ['Space', 'Space Name', 'Category', 'Product Type', 'Part Name', 'Material Name', 'Cost', 'Height', 'Width', 'Thickness', 'Number', 'Coefficient', 'Price', 'Volume', 'Shipping Cost', 'Tax', 'Storage', 'Total Cost', 'Final Price', 'In USD', 'Profits', 'Displayed Price'];

  const tableColumn = ['Space', 'Space Name', 'Product Type', 'Part Name', 'Material Name', 'Height', 'Width', 'Thickness', 'Number', 'Coefficient', 'Displayed Price'];

  const tableRows = [];

  spaces.forEach((space, spaceIndex) => {
    if (space.products.length > 0) {
      space.products.forEach(product => {
        const dataRow = [
          spaceIndex + 1,
          space.name,
          //product.selectedCategoryName,
          product.selectedProductName,
          product.name,
          product.selectedMaterial,
          //product.selectedMaterialCost,
          product.size.height,
          product.size.width,
          product.size.thickness,
          product.count.number,
          product.count.coefficient,
          //product.price,
          //product.volume,
          //product.shippingCost,
          //product.tax,
          //product.storage,
          //product.total_cost,
          //product.final_price,
          //product.in_usd,
          //product.profits,
          product.displayedPrice
        ];
        tableRows.push(dataRow);
      });
    } else {
      console.warn('Space has no products:', space);
    }
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
