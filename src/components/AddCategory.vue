<template>
  <div>
    <h1>Add a New Category</h1>
    <form @submit.prevent="saveCategory">
      <div>
        <label for="categoryName">Category Name:</label>
        <input type="text" v-model="category.name" placeholder="Enter category name" />
      </div>
      <button type="submit">Save Category</button>
    </form>
    <div v-if="message" class="message">{{ message }}</div>

    <h2>Existing Categories</h2>
    <table v-if="categories.length">
      <thead>
        <tr>
          <th>Category Name</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(category, index) in categories" :key="category._id">
          <td>{{ category.name }}</td>
          <td>
            <button type="button" @click="deleteCategory(index)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-else>No categories found.</div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      category: {
        name: ''
      },
      categories: [],
      message: ''
    };
  },
  methods: {
    async saveCategory() {
      try {
        await axios.post('http://localhost:3000/categories', this.category);
        this.message = 'Category saved successfully!';
        this.resetForm();
        await this.fetchCategories(); // Fetch the updated list of categories
      } catch (err) {
        this.message = 'Error saving category.';
        console.error(err);
      }
    },
    async fetchCategories() {
      try {
        const response = await axios.get('http://localhost:3000/categories');
        this.categories = response.data;
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    },
    async deleteCategory(index) {
      const categoryId = this.categories[index]._id;
      try {
        await axios.delete(`http://localhost:3000/categories/${categoryId}`);
        this.categories.splice(index, 1);
        this.message = 'Category deleted successfully!';
      } catch (err) {
        this.message = 'Error deleting category.';
        console.error(err);
      }
    },
    resetForm() {
      this.category = {
        name: ''
      };
    }
  },
  async mounted() {
    await this.fetchCategories();
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
input {
  display: block;
  margin-top: 5px;
}
button {
  margin-top: 10px;
}
</style>
