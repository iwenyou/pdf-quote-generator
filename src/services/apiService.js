import axios from 'axios';

export async function fetchCategories() {
  const response = await axios.get('http://localhost:3000/categories');
  return response.data;
}

export async function fetchProducts() {
    try {
        const response = await axios.get('http://localhost:3000/products');
        console.log(response.data);
        return response.data;
      } catch (err) {
        console.error('Error fetching products:', err);
      }
  }

export async function fetchProductsByCategory(categoryId) {
    try {
        const response = await axios.get(`http://localhost:3000/products?category=${categoryId}`);
        return response.data;
      } catch (err) {
        console.error('Error fetching products by categoryId:', err);
      }
}

export async function fetchDefaults() {
  const response = await axios.get('http://localhost:3000/defaults');
  return response.data || {
    height: 0,
    width: 0,
    thickness: 0,
    number: 0,
    coefficient: 0
  };
}

export async function saveQuote(formData, rows) {
  const response = await axios.post('http://localhost:3000/quotes', { ...formData, rows });
  return response.data;
}
