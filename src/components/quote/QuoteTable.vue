<template>
  <div>
    <div class="header-container">
      <h2>Quote Details</h2>
      <button 
        type="button" 
        @click="generatePDF" 
        class="generate-pdf-button"
        :disabled="hasValidationErrors">Generate PDF</button>
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
          <th>Displayed Price</th>
          <th>Total Price</th>
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
        <tr>
          <td colspan="13"><strong>Total Quote Price</strong></td>
          <td>{{ totalQuotePrice.toFixed(2) }}</td>
          <td></td>
        </tr>
      </tbody>
    </table>
    <button type="button" @click="addSpace">Add Space</button>
  </div>
</template>

<script>
import TableRow from './TableRow.vue';
import { generateQuote } from '@/services/quoteService';

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
      required: true
    }
  },
  data() {
    return {
      error: ''
    };
  },
  computed: {
    totalQuotePrice() {
      return this.spaces.reduce((sum, space) => {
        const totalSpacePrice = space.products.reduce((spaceSum, product) => spaceSum + product.displayedPrice, 0);
        return sum + totalSpacePrice;
      }, 0);
    },
    hasValidationErrors() {
      return !this.spaces.every(space => {
        return space.name && space.selectedCategoryId && space.selectedProductId &&
          space.products.every(product => {
            return product.selectedMaterial &&
              product.selectedMaterialCost != null &&
              product.size.height != null &&
              product.size.width != null &&
              product.size.thickness != null &&
              product.count.number != null &&
              product.count.coefficient != null;
          });
      });
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
      generateQuote(this);
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
