<template>
  <tr v-for="(part, partIndex) in localRow.parts" :key="partIndex">
    <td v-if="partIndex === 0" :rowspan="localRow.parts.length">
      <select v-model="localRow.selectedCategory" @change="handleCategoryChange">
        <option value="" disabled>Select Category</option>
        <option v-for="category in categories" :key="category._id" :value="category._id">{{ category.name }}</option>
      </select>
    </td>
    <td v-if="partIndex === 0" :rowspan="localRow.parts.length">
      <select v-model="localRow.selectedProduct" @change="handleProductChange">
        <option value="" disabled>Select Product</option>
        <option v-for="productByCatagory in productsByCatagory" :key="productByCatagory._id" :value="productByCatagory._id">{{ productByCatagory.productType }}</option>
      </select>
    </td>
    <td>{{ part.name }}</td>
    <td v-for="(material, materialIndex) in part.materials" :key="materialIndex">
      <input type="text" v-model="material.name" placeholder="Enter material name" />
      <input type="number" v-model.number="material.cost" placeholder="Enter cost" />
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
      productsByCatagory: [] // Local state for filtered products
    };
  },
  watch: {
    row: {
      handler(newValue) {
        this.localRow = newValue ? JSON.parse(JSON.stringify(newValue)) : { parts: [] };
      },
      deep: true
    },
    'localRow.selectedCategory'(newCategory) {
      console.log('Selected category changed:', newCategory);
      this.handleCategoryChange();
    },
    'localRow.selectedProduct'(newProduct) {
      console.log('Selected product changed:', newProduct);
    }
  },
  methods: {
    async handleCategoryChange() {
      console.log('Category changed to:', this.localRow.selectedCategory);
      this.localRow.selectedProduct = '';
      try {
        const productsByCatagory = await fetchProductsByCategory(this.localRow.selectedCategory);
        this.productsByCatagory = productsByCatagory; // Update local state
      } catch (error) {
        console.error('Error fetching products:', error);
      }
      this.$emit('update-row', this.index, this.localRow);
    },
    handleProductChange() {
      console.log('Product changed to:', this.localRow.selectedProduct);
      const selectedProduct = this.productsByCatagory.find(product => product._id === this.localRow.selectedProduct);
      if (selectedProduct) {
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
          }
        }));
      }
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
  padding: 2px;
}
td {
  border: 1px solid black;
}
</style>
