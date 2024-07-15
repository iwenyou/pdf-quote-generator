import jsPDFInvoiceTemplate from 'jspdf-invoice-template';
import './NotoSansSC';

export function generatePDF(formData, spaces) {
  let totalQuotePrice = 0;

  const items = spaces.flatMap((space, spaceIndex) => {
    return space.products.map((product) => {
      totalQuotePrice += product.displayedPrice;
      return {
        index: spaceIndex + 1,
        spaceName: space.name,
        productType: product.selectedProductName,
        partName: product.name,
        materialName: product.selectedMaterial,
        height: product.size.height,
        width: product.size.width,
        thickness: product.size.thickness,
        number: product.count.number,
        coefficient: product.count.coefficient,
        displayedPrice: product.displayedPrice.toFixed(2)
      };
    });
  });

  const props = {
    outputType: 'save',
    returnJsPDFDocObject: true,
    fileName: 'Quote',
    orientationLandscape: false,
    compress: true,
    logo: {
      src: '', // Base64 encoded image data
      width: 53.33, // aspect ratio = width/height
      height: 26.66,
      margin: {
        top: 0, // negative or positive num, from the current position
        left: 0 // negative or positive num, from the current position
      }
    },
    stamp: {
      inAllPages: true,
      src: '', // Base64 encoded image data for the stamp
      width: 20, // aspect ratio = width/height
      height: 20,
      margin: {
        top: 0, // negative or positive num, from the current position
        left: 0 // negative or positive num, from the current position
      }
    },
    business: {
      name: 'ADUOne',
      address: 'Your Address Here',
      phone: '(123) 456-7890',
      email: 'support@aduone.com',
      website: 'www.aduone.com',
    },
    contact: {
      label: 'Quote issued for:',
      name: formData.client.name,
      address: formData.client.address,
      phone: formData.client.phone || '',
      email: formData.client.email || '',
    },
    invoice: {
      label: 'Quote #: ',
      num: 1,
      invDate: `Payment Date: ${new Date().toLocaleDateString()}`,
      invGenDate: `Quote Date: ${new Date().toLocaleDateString()}`,
      headerBorder: true,
      tableBodyBorder: true,
      header: [
        { title: 'Space', style: { width: 10 } },
        { title: 'Space Name', style: { width: 30 } },
        { title: 'Product Type', style: { width: 30 } },
        { title: 'Part Name', style: { width: 30 } },
        { title: 'Material Name', style: { width: 30 } },
        { title: 'Height', style: { width: 20 } },
        { title: 'Width', style: { width: 20 } },
        { title: 'Thickness', style: { width: 20 } },
        { title: 'Number', style: { width: 20 } },
        { title: 'Coefficient', style: { width: 20 } },
        { title: 'Displayed Price', style: { width: 30 } }
      ],
      table: items.map(item => [
        item.index,
        item.spaceName,
        item.productType,
        item.partName,
        item.materialName,
        item.height,
        item.width,
        item.thickness,
        item.number,
        item.coefficient,
        item.displayedPrice
      ]),
      additionalRows: [{
        col1: 'Total Quote Price:',
        col2: totalQuotePrice.toFixed(2),
        col3: 'USD',
        style: {
          fontSize: 14 // optional, default 12
        }
      }],
      invDescLabel: 'Quote Notes',
      invDesc: 'Thank you for considering ADUOne for your project. Please contact us for any further information.',
    },
    footer: {
      text: 'The quote is created on a computer and is valid without the signature and stamp.',
    },
    pageEnable: true,
    pageLabel: 'Page ',
  };

  jsPDFInvoiceTemplate(props);
}
