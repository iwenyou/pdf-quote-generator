<template>
  <tr v-for="(part, partIndex) in localRow.parts" :key="partIndex">
    <td v-if="partIndex === 0" :rowspan="localRow.parts.length">
      <select v-model="localRow.selectedCategoryId" @change="handleCategoryChange">
        <option value="" disabled>Select Category</option>
        <option v-for="category in categories" :key="category._id" :value="category._id">{{ category.name }}</option>
      </select>
    </td>
    <td v-if="partIndex === 0" :rowspan="localRow.parts.length">
      <select v-model="localRow.selectedProductId" @change="handleProductChange">
        <option value="" disabled>Select Product</option>
        <option v-for="product in productsByCategory" :key="product._id" :value="product._id">{{ product.productType }}</option>
      </select>
    </td>
    <td>{{ part.name }}</td>
    <td>
      <select v-model="part.selectedMaterial" @change="handleMaterialChange(partIndex)">
        <option value="" disabled>Select Material</option>
        <option v-for="material in part.materials" :key="material.name" :value="material.name">{{ material.name }}</option>
      </select>
    </td>
    <td>
      <input type="number" v-model.number="part.selectedMaterialCost" placeholder="Enter cost" />
    </td>
    <td>
      <input type="number" v-model.number="part.size.height" placeholder="Height" />
    </td>
    <td>
      <input type="number" v-model.number="part.size.width" placeholder="Width" />
    </td>
    <td>
      <input type="number" v-model.number="part.size.thickness" placeholder="Thickness" />
    </td>
    <td>
      <input type="number" v-model.number="part.count.number" placeholder="Number" />
    </td>
    <td>
      <input type="number" v-model.number="part.count.coefficient" placeholder="Coefficient" />
    </td>
    <td>
      <button type="button" @click="deletePart(partIndex)">Delete Part</button>
    </td>
  </tr>
</template>

<script>
import { fetchProductsByCategory } from '@/services/apiService';

export default {
  props: {
    row: {
      type: Object,
      required: true,
      default: () => ({ parts: [] })
    },
    categories: Array,
    products: Array,
    defaults: Object,
    index: Number
  },
  emits: ['update-row', 'delete-row'],
  data() {
    return {
      localRow: this.row ? JSON.parse(JSON.stringify(this.row)) : { parts: [] },
      productsByCategory: [],
      selectedCategoryName: '',
      selectedProductName: ''
    };
  },
  watch: {
    row: {
      handler(newValue) {
        this.localRow = newValue ? JSON.parse(JSON.stringify(newValue)) : { parts: [] };
      },
      deep: true
    },
    'localRow.selectedCategoryId'(newCategoryId) {
      console.log('Selected category changed:', newCategoryId);
      this.handleCategoryChange();
    },
    'localRow.selectedProductId'(newProductId) {
      console.log('Selected product changed:', newProductId);
    }
  },
  methods: {
    async handleCategoryChange() {
      console.log('Category changed to:', this.localRow.selectedCategoryId);
      const selectedCategory = this.categories.find(category => category._id === this.localRow.selectedCategoryId);
      this.selectedCategoryName = selectedCategory ? selectedCategory.name : '';
      this.localRow.selectedProductId = '';
      this.localRow.selectedCategoryName = this.selectedCategoryName;
      try {
        const productsByCategory = await fetchProductsByCategory(this.localRow.selectedCategoryId);
        this.productsByCategory = productsByCategory;
      } catch (error) {
        console.error('Error fetching products:', error);
      }
      this.$emit('update-row', this.index, this.localRow);
    },
    handleProductChange() {
      console.log('Product changed to:', this.localRow.selectedProductId);
      const selectedProduct = this.productsByCategory.find(product => product._id === this.localRow.selectedProductId);
      if (selectedProduct) {
        this.selectedProductName = selectedProduct.productType;
        this.localRow.parts = selectedProduct.parts.map(part => ({
          ...part,
          materials: part.materials.map(material => ({ ...material })),
          size: {
            height: this.defaults.height,
            width: this.defaults.width,
            thickness: this.defaults.thickness
          },
          count: {
            number: this.defaults.number,
            coefficient: this.defaults.coefficient
          },
          selectedMaterial: '',
          selectedMaterialCost: 0
        }));
        this.localRow.selectedProductName = this.selectedProductName;
      }
      this.$emit('update-row', this.index, this.localRow);
    },
    handleMaterialChange(partIndex) {
      const selectedPart = this.localRow.parts[partIndex];
      const selectedMaterial = selectedPart.materials.find(material => material.name === selectedPart.selectedMaterial);
      selectedPart.selectedMaterialCost = selectedMaterial ? selectedMaterial.cost : 0;
      this.$emit('update-row', this.index, this.localRow);
    },
    deletePart(partIndex) {
      this.localRow.parts.splice(partIndex, 1);
      if (this.localRow.parts.length === 0) {
        this.$emit('delete-row', this.index);
      } else {
        this.$emit('update-row', this.index, this.localRow);
      }
    }
  }
};
</script>

<style scoped>
select, input {
  width: 100%;
  box-sizing: border-box;
  padding: 5px;
}
td {
  border: 1px solid black;
  padding: 8px;
}
th {
  padding: 8px;
}
</style>
