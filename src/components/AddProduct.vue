<template>
  <div>
    <h1>Add a New Product</h1>
    <form @submit.prevent="saveProduct">
      <div>
        <label for="category">Category:</label>
        <select v-model="product.category" @change="fetchProductTypes">
          <option value="" disabled>Select Category</option>
          <option v-for="category in categories" :key="category._id" :value="category._id">{{ category.name }}</option>
        </select>
      </div>
      <div v-if="product.category">
        <label for="productType">Product Type:</label>
        <input type="text" v-model="product.productType" placeholder="Enter product type" />
      </div>
      <div v-if="product.productType">
        <div v-for="(part, partIndex) in product.parts" :key="partIndex">
          <label>Part Name:</label>
          <input type="text" v-model="part.name" placeholder="Enter part name" />
          <div v-for="(material, materialIndex) in part.materials" :key="materialIndex">
            <label>Material Name:</label>
            <input type="text" v-model="material.name" placeholder="Enter material name" />
            <label>Cost:</label>
            <input type="number" v-model.number="material.cost" placeholder="Enter cost" />
            <button type="button" @click="removeMaterial(partIndex, materialIndex)">Remove Material</button>
          </div>
          <button type="button" @click="addMaterial(partIndex)">Add Material</button>
          <button type="button" @click="removePart(partIndex)">Remove Part</button>
        </div>
        <button type="button" @click="addPart">Add Part</button>
      </div>
      <button type="submit">Save Product</button>
    </form>
    <div v-if="message" class="message">{{ message }}</div>

    <h2>Existing Products</h2>
    <table v-if="products.length">
      <thead>
        <tr>
          <th>Category</th>
          <th>Product Type</th>
          <th>Parts</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(product, productIndex) in products" :key="product._id">
          <td>{{ getCategoryName(product.category) }}</td>
          <td>{{ product.productType }}</td>
          <td>
            <ul>
              <li v-for="part in product.parts" :key="part.name">
                {{ part.name }}
                <ul>
                  <li v-for="material in part.materials" :key="material.name">
                    {{ material.name }}: ${{ material.cost }}
                  </li>
                </ul>
              </li>
            </ul>
          </td>
          <td>
            <button type="button" @click="deleteProduct(productIndex)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-else>No products found.</div>
  </div>
</template>
  
<script>
import axios from 'axios';

export default {
  data() {
    return {
      categories: [],
      products: [],
      product: {
        category: '',
        productType: '',
        parts: []
      },
      message: ''
    };
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await axios.get('http://localhost:3000/categories');
        this.categories = response.data;
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    },
    async fetchProducts() {
      try {
        const response = await axios.get('http://localhost:3000/products');
        this.products = response.data;
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    },
    fetchProductTypes() {
      this.product.productType = '';
    },
    addPart() {
      this.product.parts.push({
        name: '',
        materials: []
      });
    },
    removePart(partIndex) {
      this.product.parts.splice(partIndex, 1);
    },
    addMaterial(partIndex) {
      this.product.parts[partIndex].materials.push({
        name: '',
        cost: 0
      });
    },
    removeMaterial(partIndex, materialIndex) {
      this.product.parts[partIndex].materials.splice(materialIndex, 1);
    },
    async saveProduct() {
      try {
        const newProduct = {
          category: this.product.category,
          productType: this.product.productType,
          parts: this.product.parts
        };
        await axios.post('http://localhost:3000/products', newProduct);
        this.message = 'Product saved successfully!';
        this.resetForm();
        await this.fetchProducts(); // Fetch the updated list of products
      } catch (err) {
        this.message = 'Error saving product.';
        console.error(err);
      }
    },
    async deleteProduct(productIndex) {
      const productId = this.products[productIndex]._id;
      try {
        await axios.delete(`http://localhost:3000/products/${productId}`);
        this.products.splice(productIndex, 1);
        this.message = 'Product deleted successfully!';
      } catch (err) {
        this.message = 'Error deleting product.';
        console.error(err);
      }
    },
    resetForm() {
      this.product = {
        category: '',
        productType: '',
        parts: []
      };
    },
      getCategoryName(category) {
      return category ? category.name : 'Unknown';
    }
  },
  async mounted() {
    await this.fetchCategories();
    await this.fetchProducts();
  }
};
</script>

  
  <style scoped>
  .message {
    color: green;
  }
  label {
    display: block;
    margin-top: 10px;
  }
  input, select {
    display: block;
    margin-top: 5px;
  }
  button {
    margin-top: 10px;
  }
  </style>
  