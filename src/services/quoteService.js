import { fetchCategories, fetchProducts, fetchDefaults, saveQuote, fetchProductsByCategory } from './apiService';
import { generatePDF } from './pdfService';
import { calculateValues } from './calculateService';

// Initialize data for the quote form
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

// Add a new space to the quote form
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

// Update a specific space in the quote form
export function updateSpace(context, index, updatedSpace) {
  context.spaces.splice(index, 1, { ...updatedSpace });
}

// Delete a specific space from the quote form
export function deleteSpace(context, index) {
  context.spaces.splice(index, 1);
}

// Update client information in the quote form
export function updateClient(context, { field, value }) {
  context.formData.client[field] = value;
}

// Generate a quote and save it
export async function generateQuote(context) {
  try {
    await saveQuote(context.formData, context.spaces);
    generatePDF(context.formData, context.spaces); // Pass both formData and spaces
  } catch (error) {
    context.error = 'An error occurred while generating the PDF.';
    console.error(error);
  }
}

// Get initial data structure for the quote form
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

// Handle category change and update related products
export async function handleCategoryChange(context) {
  console.log('Category changed to:', context.localSpace.selectedCategoryId);
  const selectedCategory = context.categories.find(category => category._id === context.localSpace.selectedCategoryId);
  context.selectedCategoryName = selectedCategory ? selectedCategory.name : '';
  context.localSpace.selectedProductId = '';
  context.localSpace.selectedCategoryName = context.selectedCategoryName;
  try {
    const productsByCategory = await fetchProductsByCategory(context.localSpace.selectedCategoryId);
    context.productsByCategory = productsByCategory; // Update local state
  } catch (error) {
    console.error('Error fetching products:', error);
  }
  emitUpdate(context);
}

// Handle product change and update related parts and materials
export function handleProductChange(context) {
  console.log('Product changed to:', context.localSpace.selectedProductId);
  const selectedProduct = context.productsByCategory.find(product => product._id === context.localSpace.selectedProductId);
  if (selectedProduct) {
    context.selectedProductName = selectedProduct.productType;
    context.localSpace.products = selectedProduct.parts.map(part => ({
      ...part,
      materials: part.materials.map(material => ({ ...material })),
      size: {
        height: context.defaults.height || 0,
        width: context.defaults.width || 0,
        thickness: context.defaults.thickness || 0
      },
      count: {
        number: context.defaults.number || 0,
        coefficient: context.defaults.coefficient || 0
      },
      selectedMaterial: '', // Add selected material
      selectedMaterialCost: 0, // Add selected material cost
      selectedProductName: context.selectedProductName // Add selected product name
    }));
    context.localSpace.selectedProductName = context.selectedProductName;
  }
  emitUpdate(context);
}

// Handle material change and update cost
export function handleMaterialChange(context, productIndex) {
  const selectedProduct = context.localSpace.products[productIndex];
  const selectedMaterial = selectedProduct.materials.find(material => material.name === selectedProduct.selectedMaterial);
  selectedProduct.selectedMaterialCost = selectedMaterial ? selectedMaterial.cost : 0;
  emitUpdate(context);
}

// Handle input changes and calculate values
export function handleInputChange(context) {
  calculateAndEmit(context);
}

// Calculate and update values for each product in the space
export function calculateAndEmit(context) {
  context.localSpace.products.forEach(product => {
    const calculatedValues = calculateValues(product, context.defaults);
    Object.assign(product, calculatedValues);
  });
  emitUpdate(context);
}

// Delete a product from the space
export function deleteProduct(context, productIndex) {
  context.localSpace.products.splice(productIndex, 1);
  if (context.localSpace.products.length === 0) {
    context.$emit('delete-space', context.index);
  } else {
    emitUpdate(context);
  }
}

// Emit an update for the space
export function emitUpdate(context) {
  context.$emit('update-space', context.index, JSON.parse(JSON.stringify(context.localSpace)));
}
