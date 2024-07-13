<template>
  <tr v-for="(product, productIndex) in localSpace.products" :key="productIndex">
    <td v-if="productIndex === 0" :rowspan="localSpace.products.length">
      {{ index + 1 }}
    </td>
    <td v-if="productIndex === 0" :rowspan="localSpace.products.length">
      <input type="text" v-model="localSpace.name" @input="handleInputChange" placeholder="Enter space name" />
      <span v-if="!localSpace.name" class="error">Required</span>
    </td>
    <td v-if="productIndex === 0" :rowspan="localSpace.products.length">
      <select v-model="localSpace.selectedCategoryId" @change="handleCategoryChange">
        <option value="" disabled>Select Category</option>
        <option v-for="category in categories" :key="category._id" :value="category._id">{{ category.name }}</option>
      </select>
      <span v-if="!localSpace.selectedCategoryId" class="error">Required</span>
    </td>
    <td v-if="productIndex === 0" :rowspan="localSpace.products.length">
      <select v-model="localSpace.selectedProductId" @change="handleProductChange">
        <option value="" disabled>Select Product</option>
        <option v-for="product in productsByCategory" :key="product._id" :value="product._id">{{ product.productType }}</option>
      </select>
      <span v-if="!localSpace.selectedProductId" class="error">Required</span>
    </td>
    <td>{{ product.name }}</td>
    <td>
      <select v-model="product.selectedMaterial" @change="handleMaterialChange(productIndex)">
        <option value="" disabled>Select Material</option>
        <option v-for="material in product.materials" :key="material.name" :value="material.name">{{ material.name }}</option>
      </select>
      <span v-if="!product.selectedMaterial" class="error">Required</span>
    </td>
    <td>
      <input type="number" v-model.number="product.selectedMaterialCost" placeholder="Enter cost" @input="handleInputChange" />
      <span v-if="!product.selectedMaterialCost && product.selectedMaterialCost !== 0" class="error">Required</span>
    </td>
    <td>
      <input type="number" v-model.number="product.size.height" placeholder="Height" @input="handleInputChange" />
      <span v-if="!product.size.height && product.size.height !== 0" class="error">Required</span>
    </td>
    <td>
      <input type="number" v-model.number="product.size.width" placeholder="Width" @input="handleInputChange" />
      <span v-if="!product.size.width && product.size.width !== 0" class="error">Required</span>
    </td>
    <td>
      <input type="number" v-model.number="product.size.thickness" placeholder="Thickness" @input="handleInputChange" />
      <span v-if="!product.size.thickness && product.size.thickness !== 0" class="error">Required</span>
    </td>
    <td>
      <input type="number" v-model.number="product.count.number" placeholder="Number" @input="handleInputChange" />
      <span v-if="!product.count.number && product.count.number !== 0" class="error">Required</span>
    </td>
    <td>
      <input type="number" v-model.number="product.count.coefficient" placeholder="Coefficient" @input="handleInputChange" />
      <span v-if="!product.count.coefficient && product.count.coefficient !== 0" class="error">Required</span>
    </td>
    <td>
      <button type="button" @click="deleteProduct(productIndex)">Delete Part</button>
    </td>
  </tr>
</template>

<script>
import { 
  handleCategoryChange, 
  handleProductChange, 
  handleMaterialChange, 
  handleInputChange, 
  deleteProduct, 
  emitUpdate 
} from '@/services/quoteService';

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
    handleCategoryChange() {
      handleCategoryChange(this);
    },
    handleProductChange() {
      handleProductChange(this);
    },
    handleMaterialChange(productIndex) {
      handleMaterialChange(this, productIndex);
    },
    handleInputChange() {
      handleInputChange(this);
    },
    deleteProduct(productIndex) {
      deleteProduct(this, productIndex);
    },
    emitUpdate() {
      emitUpdate(this);
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
.error {
  color: red;
  font-size: 0.8em;
  margin-top: 5px;
}
</style>
