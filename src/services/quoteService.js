import { fetchCategories, fetchProducts, fetchDefaults, saveQuote } from './apiService';
import { generatePDF } from './pdfService';

export async function initializeData(context) {
  try {
    context.categories = await fetchCategories();
    context.products = await fetchProducts();
    context.defaults = await fetchDefaults();
    if (context.spaces.length === 0) {
      addSpace(context);
    }
  } catch (error) {
    context.error = 'Failed to initialize data.';
    console.error(error);
  }
}

export function addSpace(context) {
  context.spaces.push({
    name: '',
    products: [{
      name: '',
      materials: [{
        name: '',
        cost: 0
      }],
      size: {
        height: context.defaults.height || 0,
        width: context.defaults.width || 0,
        thickness: context.defaults.thickness || 0
      },
      count: {
        number: context.defaults.number || 0,
        coefficient: context.defaults.coefficient || 0
      },
      selectedMaterial: '',
      selectedMaterialCost: 0
    }]
  });
}

export function updateSpace(context, index, updatedSpace) {
  context.spaces.splice(index, 1, { ...updatedSpace });
}

export function deleteSpace(context, index) {
  context.spaces.splice(index, 1);
}

export function updateClient(context, { field, value }) {
  context.formData.client[field] = value;
}

export async function generateQuote(context) {
  try {
    await saveQuote(context.formData, context.spaces);
    generatePDF(context.formData, context.spaces); // Pass both formData and spaces
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
    spaces: [],
    error: ''
  };
}
