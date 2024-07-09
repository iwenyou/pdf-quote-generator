<template>
  <div>
    <div class="header-container">
      <h2>Quote Details</h2>
      <button type="button" @click="generatePDF" class="generate-pdf-button">Generate PDF</button>
    </div>
    <table class="table">
      <thead>
        <tr>
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
          v-for="(row, rowIndex) in rows"
          :key="rowIndex"
          :row="row"
          :categories="categories"
          :products="products"
          :defaults="defaults"
          :index="rowIndex"
          @update-row="updateRow"
          @delete-row="deleteRow"
        />
      </tbody>
    </table>
    <button type="button" @click="addRow">Add Row</button>
  </div>
</template>

<script>
import TableRow from './TableRow.vue';

export default {
  components: {
    TableRow
  },
  props: {
    rows: {
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
    }
  },
  methods: {
    addRow() {
      this.$emit('add-row');
    },
    updateRow(index, updatedRow) {
      this.$emit('update-row', index, updatedRow);
    },
    deleteRow(index) {
      this.$emit('delete-row', index);
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
