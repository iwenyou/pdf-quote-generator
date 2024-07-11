import axios from 'axios';

export async function fetchCategories() {
  const response = await axios.get('http://localhost:3000/categories');
  return response.data;
}

export async function fetchProducts() {
  const response = await axios.get('http://localhost:3000/products');
  return response.data;
}

export async function fetchDefaults() {
  const response = await axios.get('http://localhost:3000/defaults');
  return response.data;
}

export async function saveQuote(formData, rows) {
  const quoteData = {
    client: formData.client,
    rows: rows,
    date: new Date()
  };
  await axios.post('http://localhost:3000/quotes', quoteData);
}

export async function fetchProductsByCategory(categoryId) {
  const response = await axios.get(`http://localhost:3000/products?category=${categoryId}`);
  return response.data;
}
