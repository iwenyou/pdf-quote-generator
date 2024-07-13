import { fetchCategories, fetchProducts, fetchDefaults, saveQuote, fetchProductsByCategory } from './apiService';
import { generatePDF } from './pdfService';
import { calculateValues } from './calculateService';

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
      selectedMaterialCost: 0,
      displayedPrice: 0
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
  if (!validateInputs(context)) {
    context.error = 'Please fill all required fields before generating the PDF.';
    return;
  }

  try {
    await saveQuote(context.formData, context.spaces);
    generatePDF(context.formData, context.spaces);
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
      coefficient: 0,
      shippingRate: 0,
      importTaxRate: 0,
      storageFee: 0,
      exchangeRate: 1,
      partHeights: {} // Add part heights here if needed
    },
    spaces: [],
    error: ''
  };
}

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

export function handleProductChange(context) {
  console.log('Product changed to:', context.localSpace.selectedProductId);
  const selectedProduct = context.productsByCategory.find(product => product._id === context.localSpace.selectedProductId);
  if (selectedProduct) {
    context.selectedProductName = selectedProduct.productType;
    context.localSpace.products = selectedProduct.parts.map(part => ({
      ...part,
      materials: part.materials.map(material => ({ ...material })),
      size: {
        height: part.defaultHeight || context.defaults.height || 0,
        width: context.defaults.width || 0,
        thickness: context.defaults.thickness || 0
      },
      count: {
        number: context.defaults.number || 0,
        coefficient: context.defaults.coefficient || 0
      },
      selectedMaterial: '', // Add selected material
      selectedMaterialCost: 0, // Add selected material cost
      selectedProductName: context.selectedProductName, // Add selected product name
      displayedPrice: 0 // Add displayed price
    }));
    context.localSpace.selectedProductName = context.selectedProductName;
  }
  emitUpdate(context);
}

export function handleMaterialChange(context, productIndex) {
  const selectedProduct = context.localSpace.products[productIndex];
  const selectedMaterial = selectedProduct.materials.find(material => material.name === selectedProduct.selectedMaterial);
  selectedProduct.selectedMaterialCost = selectedMaterial ? selectedMaterial.cost : 0;
  emitUpdate(context);
}

export function handleInputChange(context) {
  calculateAndEmit(context);
}

export function calculateAndEmit(context) {
  context.localSpace.products.forEach(product => {
    const calculatedValues = calculateValues(product, context.defaults);
    Object.assign(product, calculatedValues);
  });
  emitUpdate(context);
}

export function deleteProduct(context, productIndex) {
  context.localSpace.products.splice(productIndex, 1);
  if (context.localSpace.products.length === 0) {
    context.$emit('delete-space', context.index);
  } else {
    emitUpdate(context);
  }
}

export function emitUpdate(context) {
  context.$emit('update-space', context.index, JSON.parse(JSON.stringify(context.localSpace)));
}

function validateInputs(context) {
  for (const space of context.spaces) {
    if (!space.name || !space.selectedCategoryId || !space.selectedProductId) return false;
    for (const product of space.products) {
      if (
        !product.selectedMaterial ||
        product.selectedMaterialCost == null ||
        product.size.height == null ||
        product.size.width == null ||
        product.size.thickness == null ||
        product.count.number == null ||
        product.count.coefficient == null
      ) {
        return false;
      }
    }
  }
  return true;
}
