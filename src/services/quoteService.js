import { fetchCategories, fetchProducts, fetchDefaults, saveQuote } from './apiService';
import { generatePDF } from './pdfService';

export async function initializeData(context) {
  try {
    context.categories = await fetchCategories();
    context.products = await fetchProducts();
    context.defaults = await fetchDefaults();
    if (context.rows.length === 0) {
      addRow(context);
    }
  } catch (error) {
    context.error = 'Failed to initialize data.';
    console.error(error);
  }
}

export function addRow(context) {
  context.rows.push({
    selectedCategory: '',
    selectedProduct: '',
    parts: [{
      name: '',
      materials: [{
        name: '',
        cost: 0
      }],
      size: {
        height: context.defaults.height,
        width: context.defaults.width,
        thickness: context.defaults.thickness
      },
      count: {
        number: context.defaults.number,
        coefficient: context.defaults.coefficient
      }
    }]
  });
}

export function updateRow(context, index, updatedRow) {
  context.rows.splice(index, 1, { ...updatedRow });
}

export function deleteRow(context, index) {
  context.rows.splice(index, 1);
}

export function updateClient(context, { field, value }) {
  context.formData.client[field] = value;
}

export async function generateQuote(context) {
  try {
    await saveQuote(context.formData, context.rows);
    generatePDF(context.formData, context.rows);
  } catch (error) {
    context.error = 'An error occurred while generating the PDF.';
    console.error(error);
  }
}

export function getInitialData() {
  return {
    formData: {
      client: {
        name: '',
        address: ''
      }
    },
    categories: [],
    products: [],
    defaults: {
      height: 0,
      width: 0,
      thickness: 0,
      number: 0,
      coefficient: 0
    },
    rows: [],
    error: ''
  };
}
