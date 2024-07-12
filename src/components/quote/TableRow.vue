<template>
  <tr v-for="(product, productIndex) in localSpace.products" :key="productIndex">
    <td v-if="productIndex === 0" :rowspan="localSpace.products.length">
      {{ index + 1 }}
    </td>
    <td v-if="productIndex === 0" :rowspan="localSpace.products.length">
      <input type="text" v-model="localSpace.name" @input="emitUpdate" placeholder="Enter space name" />
    </td>
    <td v-if="productIndex === 0" :rowspan="localSpace.products.length">
      <select v-model="localSpace.selectedCategoryId" @change="handleCategoryChange">
        <option value="" disabled>Select Category</option>
        <option v-for="category in categories" :key="category._id" :value="category._id">{{ category.name }}</option>
      </select>
    </td>
    <td v-if="productIndex === 0" :rowspan="localSpace.products.length">
      <select v-model="localSpace.selectedProductId" @change="handleProductChange">
        <option value="" disabled>Select Product</option>
        <option v-for="product in productsByCategory" :key="product._id" :value="product._id">{{ product.productType }}</option>
      </select>
    </td>
    <td>{{ product.name }}</td>
    <td>
      <select v-model="product.selectedMaterial" @change="handleMaterialChange(productIndex)">
        <option value="" disabled>Select Material</option>
        <option v-for="material in product.materials" :key="material.name" :value="material.name">{{ material.name }}</option>
      </select>
    </td>
    <td>
      <input type="number" v-model.number="product.selectedMaterialCost" placeholder="Enter cost" @input="emitUpdate" />
    </td>
    <td>
      <input type="number" v-model.number="product.size.height" placeholder="Height" @input="emitUpdate" />
    </td>
    <td>
      <input type="number" v-model.number="product.size.width" placeholder="Width" @input="emitUpdate" />
    </td>
    <td>
      <input type="number" v-model.number="product.size.thickness" placeholder="Thickness" @input="emitUpdate" />
    </td>
    <td>
      <input type="number" v-model.number="product.count.number" placeholder="Number" @input="emitUpdate" />
    </td>
    <td>
      <input type="number" v-model.number="product.count.coefficient" placeholder="Coefficient" @input="emitUpdate" />
    </td>
    <td>
      <button type="button" @click="deleteProduct(productIndex)">Delete Part</button>
    </td>
  </tr>
</template>

<script>
import { fetchProductsByCategory } from '@/services/apiService';

export default {
  props: {
    space: {
      type: Object,
      required: true,
      default: () => ({ products: [] })
    },
    categories: Array,
    products: Array,
    defaults: Object,
    index: Number
  },
  emits: ['update-space', 'delete-space'],
  data() {
    return {
      localSpace: this.space ? JSON.parse(JSON.stringify(this.space)) : { products: [] },
      productsByCategory: [], // Local state for filtered products
      selectedCategoryName: '',
      selectedProductName: ''
    };
  },
  watch: {
    space: {
      handler(newValue) {
        this.localSpace = newValue ? JSON.parse(JSON.stringify(newValue)) : { products: [] };
      },
      deep: true
    },
    'localSpace.selectedCategoryId'(newCategoryId) {
      console.log('Selected category changed:', newCategoryId);
      this.handleCategoryChange();
    },
    'localSpace.selectedProductId'(newProductId) {
      console.log('Selected product changed:', newProductId);
    }
  },
  methods: {
    async handleCategoryChange() {
      console.log('Category changed to:', this.localSpace.selectedCategoryId);
      const selectedCategory = this.categories.find(category => category._id === this.localSpace.selectedCategoryId);
      this.selectedCategoryName = selectedCategory ? selectedCategory.name : '';
      this.localSpace.selectedProductId = '';
      this.localSpace.selectedCategoryName = this.selectedCategoryName;
      try {
        const productsByCategory = await fetchProductsByCategory(this.localSpace.selectedCategoryId);
        this.productsByCategory = productsByCategory; // Update local state
      } catch (error) {
        console.error('Error fetching products:', error);
      }
      this.emitUpdate();
    },
    handleProductChange() {
      console.log('Product changed to:', this.localSpace.selectedProductId);
      const selectedProduct = this.productsByCategory.find(product => product._id === this.localSpace.selectedProductId);
      if (selectedProduct) {
        this.selectedProductName = selectedProduct.productType;
        this.localSpace.products = selectedProduct.parts.map(part => ({
          ...part,
          materials: part.materials.map(material => ({ ...material })),
          size: {
            height: this.defaults.height || 0,
            width: this.defaults.width || 0,
            thickness: this.defaults.thickness || 0
          },
          count: {
            number: this.defaults.number || 0,
            coefficient: this.defaults.coefficient || 0
          },
          selectedMaterial: '', // Add selected material
          selectedMaterialCost: 0 // Add selected material cost
        }));
        this.localSpace.selectedProductName = this.selectedProductName;
      }
      this.emitUpdate();
    },
    handleMaterialChange(productIndex) {
      const selectedProduct = this.localSpace.products[productIndex];
      const selectedMaterial = selectedProduct.materials.find(material => material.name === selectedProduct.selectedMaterial);
      selectedProduct.selectedMaterialCost = selectedMaterial ? selectedMaterial.cost : 0;
      this.emitUpdate();
    },
    deleteProduct(productIndex) {
      this.localSpace.products.splice(productIndex, 1);
      if (this.localSpace.products.length === 0) {
        this.$emit('delete-space', this.index);
      } else {
        this.emitUpdate();
      }
    },
    emitUpdate() {
      this.$emit('update-space', this.index, JSON.parse(JSON.stringify(this.localSpace)));
    }
  }
};
</script>

<style scoped>
select, input {
  width: 100%; /* Ensure full width */
  box-sizing: border-box; /* Include padding and border in the element's total width and height */
  padding: 5px; /* Add some padding for better appearance */
}
td {
  border: 1px solid black; /* Add border to td for proper table alignment */
  padding: 8px; /* Add padding to table cells */
}
th {
  padding: 8px; /* Add padding to table headers */
}
</style>
