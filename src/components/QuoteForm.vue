<template>
  <div>
    <h1>Generate Your Quote</h1>
    <form @submit.prevent="generateQuote">
      <div>
        <label for="clientName">Client Name:</label>
        <input type="text" v-model="formData.client.name" placeholder="Enter client name" required />

        <label for="clientAddress">Client Address:</label>
        <input type="text" v-model="formData.client.address" placeholder="Enter client address" required />
      </div>

      <div v-if="categories && products">
        <table>
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
      <button type="submit">Generate PDF</button>
    </form>
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script>
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import TableRow from './TableRow.vue';

export default {
  components: {
    TableRow
  },
  data() {
    return {
      formData: {
        client: {
          name: '',
          address: ''
        }
      },
      categories: [],
      products: [],
      defaults: {
        height: 0,
        width: 0,
        thickness: 0,
        number: 0,
        coefficient: 0
      },
      rows: [],
      error: ''
    };
  },
  methods: {
    async fetchCategories() {
      try {
        const response = await axios.get('http://localhost:3000/categories');
        this.categories = response.data;
      } catch (err) {
        this.error = 'Failed to fetch categories.';
        console.error(err);
      }
    },
    async fetchProducts() {
      try {
        const response = await axios.get('http://localhost:3000/products');
        this.products = response.data;
      } catch (err) {
        this.error = 'Failed to fetch products.';
        console.error(err);
      }
    },
    async fetchDefaults() {
      try {
        const response = await axios.get('http://localhost:3000/defaults');
        this.defaults = response.data || {
          height: 0,
          width: 0,
          thickness: 0,
          number: 0,
          coefficient: 0
        };
      } catch (err) {
        this.error = 'Error fetching default values.';
        console.error(err);
      }
    },
    addRow() {
      this.rows.push({
        selectedCategory: '',
        selectedProduct: '',
        parts: [{
          name: '',
          materials: [{
            name: '',
            cost: 0
          }],
          size: {
            height: this.defaults.height,
            width: this.defaults.width,
            thickness: this.defaults.thickness
          },
          count: {
            number: this.defaults.number,
            coefficient: this.defaults.coefficient
          }
        }]
      });
    },
    updateRow(index, updatedRow) {
      this.rows.splice(index, 1, { ...updatedRow });
    },
    deleteRow(index) {
      this.rows.splice(index, 1);
    },
    async generateQuote() {
      try {
        const response = await axios.post('http://localhost:3000/quotes', { ...this.formData, rows: this.rows });
        console.log('Quote saved:', response.data);

        // Generate PDF
        const doc = new jsPDF();
        
        // Add header image
        const imgData = 'data:image/jpeg;base64,...'; // Base64 encoded image data
        doc.addImage(imgData, 'JPEG', 15, 10, 50, 25);

        // Add client details
        doc.text(20, 50, `Name: ${this.formData.client.name}`);
        doc.text(20, 60, `Address: ${this.formData.client.address}`);

        // Add table with quote details
        const tableColumn = ['Category', 'Product Type', 'Part Name', 'Material Name', 'Cost', 'Height', 'Width', 'Thickness', 'Number', 'Coefficient'];
        const tableRows = [];

        this.rows.forEach(row => {
          row.parts.forEach(part => {
            part.materials.forEach(material => {
              const dataRow = [
                row.selectedCategory,
                row.selectedProduct,
                part.name,
                material.name,
                `$${material.cost}`,
                part.size.height,
                part.size.width,
                part.size.thickness,
                part.count.number,
                part.count.coefficient
              ];
              tableRows.push(dataRow);
            });
          });
        });

        doc.autoTable(tableColumn, tableRows, { startY: 70 });

        // Save the PDF
        doc.save('quote.pdf');
      } catch (err) {
        this.error = 'An error occurred while generating the PDF.';
        console.error(err);
      }
    }
  },
  async mounted() {
    await this.fetchCategories();
    await this.fetchProducts();
    await this.fetchDefaults();
    if (this.rows.length === 0) {
      this.addRow();
    }
  }
};
</script>

<style scoped>
.error {
  color: red;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th, td {
  border: 1px solid black;
  padding: 8px;
  text-align: left;
}
</style>
