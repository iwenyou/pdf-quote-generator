<template>
  <div>
    <h1>Add or Edit a Product</h1>
    <form @submit.prevent="saveProduct" class="product-form">
      <div class="form-group">
        <label for="category">Category:</label>
        <select v-model="product.category" @change="fetchProductTypes">
          <option value="" disabled>Select Category</option>
          <option v-for="category in categories" :key="category._id" :value="category._id">{{ category.name }}</option>
        </select>
      </div>
      <div v-if="product.category" class="form-group">
        <label for="productType">Product Type:</label>
        <input type="text" v-model="product.productType" placeholder="Enter product type" />
      </div>
      <div v-if="product.productType">
        <table class="table">
          <thead>
            <tr>
              <th>Part Name</th>
              <th>Default Height</th>
              <th>Material Name</th>
              <th>Cost</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(part, partIndex) in product.parts" :key="partIndex">
              <td>
                <input type="text" v-model="part.name" placeholder="Enter part name" />
              </td>
              <td>
                <input type="number" v-model.number="part.defaultHeight" placeholder="Enter default height" />
              </td>
              <td>
                <div v-for="(material, materialIndex) in part.materials" :key="materialIndex" class="material-section">
                  <input type="text" v-model="material.name" placeholder="Enter material name" />
                  <button type="button" @click="removeMaterial(partIndex, materialIndex)" class="remove-btn">Remove Material</button>
                </div>
              </td>
              <td>
                <div v-for="(material, materialIndex) in part.materials" :key="materialIndex">
                  <input type="number" v-model.number="material.cost" placeholder="Enter cost" />
                </div>
              </td>
              <td>
                <button type="button" @click="addMaterial(partIndex)" class="add-btn">Add Material</button>
                <button type="button" @click="removePart(partIndex)" class="remove-btn">Remove Part</button>
              </td>
            </tr>
          </tbody>
        </table>
        <button type="button" @click="addPart" class="add-btn">Add Part</button>
      </div>
      <button type="submit" class="submit-btn">{{ editMode ? 'Update Product' : 'Save Product' }}</button>
    </form>
    <div v-if="message" class="message">{{ message }}</div>

    <h2>Existing Products</h2>
    <table v-if="products.length" class="table">
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
                {{ part.name }} (Default Height: {{ part.defaultHeight }})
                <ul>
                  <li v-for="material in part.materials" :key="material.name">
                    {{ material.name }}: ${{ material.cost }}
                  </li>
                </ul>
              </li>
            </ul>
          </td>
          <td>
            <button type="button" @click="editProduct(productIndex)" class="action-btn">Edit</button>
            <button type="button" @click="deleteProduct(productIndex)" class="action-btn">Delete</button>
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
      editMode: false,
      editIndex: null,
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
        defaultHeight: 0,
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
        if (this.editMode) {
          await axios.put(`http://localhost:3000/products/${this.products[this.editIndex]._id}`, newProduct);
          this.message = 'Product updated successfully!';
        } else {
          await axios.post('http://localhost:3000/products', newProduct);
          this.message = 'Product saved successfully!';
        }
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
    editProduct(productIndex) {
      const product = this.products[productIndex];
      this.product = JSON.parse(JSON.stringify(product)); // Deep copy to avoid mutating original data
      this.editMode = true;
      this.editIndex = productIndex;
    },
    resetForm() {
      this.product = {
        category: '',
        productType: '',
        parts: []
      };
      this.editMode = false;
      this.editIndex = null;
    },
    getCategoryName(category) {
      const foundCategory = this.categories.find(cat => cat._id === category);
      return foundCategory ? foundCategory.name : 'Unknown';
    }
  },
  async mounted() {
    await this.fetchCategories();
    await this.fetchProducts();
  }
};
</script>

<style scoped>
.product-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.add-btn, .remove-btn, .submit-btn, .action-btn {
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.add-btn {
  background-color: #4caf50;
  color: white;
}

.remove-btn {
  background-color: #f44336;
  color: white;
}

.submit-btn {
  background-color: #008cba;
  color: white;
  align-self: flex-start;
}

.action-btn {
  background-color: #ffc107;
  color: black;
  margin-right: 0.5rem;
}

.message {
  color: green;
  margin-top: 1rem;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 2rem;
}

th, td {
  border: 1px solid black;
  padding: 8px;
  text-align: left;
}
</style>
