<template>
  <div>
    <div class="header-container">
      <h2>Quote Details</h2>
      <button type="button" @click="generatePDF" class="generate-pdf-button">Generate PDF</button>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>Space</th>
          <th>Space Name</th>
          <th>Category</th>
          <th>Product Type</th>
          <th>Part Name</th>
          <th>Material Name</th>
          <th>Cost</th>
          <th>Height</th>
          <th>Width</th>
          <th>Thickness</th>
          <th>Number</th>
          <th>Coefficient</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <TableRow
          v-for="(space, spaceIndex) in spaces"
          :key="spaceIndex"
          :space="space"
          :categories="categories"
          :products="products"
          :defaults="defaults"
          :index="spaceIndex"
          @update-space="updateSpace"
          @delete-space="deleteSpace"
        />
      </tbody>
    </table>
    <button type="button" @click="addSpace">Add Space</button>
  </div>
</template>

<script>
import TableRow from './TableRow.vue';
import { generatePDF } from '@/services/pdfService';

export default {
  components: {
    TableRow
  },
  props: {
    spaces: {
      type: Array,
      required: true,
      default: () => []
    },
    categories: {
      type: Array,
      required: true,
      default: () => []
    },
    products: {
      type: Array,
      required: true,
      default: () => []
    },
    defaults: {
      type: Object,
      required: true,
      default: () => ({})
    },
    formData: {
      type: Object,
      required: true,
      default: () => ({})
    }
  },
  methods: {
    addSpace() {
      this.$emit('add-space');
    },
    updateSpace(index, updatedSpace) {
      this.$emit('update-space', index, updatedSpace);
    },
    deleteSpace(index) {
      this.$emit('delete-space', index);
    },
    generatePDF() {
      
      console.log('FormData:', this.formData); // Debugging log
      console.log('Spaces:', this.spaces); // Debugging log
      generatePDF(this.formData, this.spaces); // Pass both formData and spaces
    }
  }
};
</script>

<style src="@/styles/TableStyles.css"></style>
<style scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.generate-pdf-button {
  margin-left: 10px; /* Adds space between the button and the heading */
}
</style>
