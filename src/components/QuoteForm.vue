<template>
  <div>
    <h1>Generate Your Quote</h1>
    <form @submit.prevent="generateQuote">
      <div v-if="quoteData">
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Type</th>
              <th>Area</th>
              <th>Material</th>
              <th>Height</th>
              <th>Width</th>
              <th>Thickness</th>
              <th>Number</th>
              <th>Coefficient</th>
              <th>In USD</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <TableRow
              v-for="(row, rowIndex) in rows"
              :key="rowIndex"
              :row="row"
              :categories="quoteData.category"
              :defaults="defaults"
              :index="rowIndex"
              @update-row="updateRow"
              @delete-row="deleteRow"
            />
          </tbody>
        </table>
        <button type="button" @click="addRow">Add Row</button>
        <button type="submit">Generate PDF</button>
      </div>
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
        name: '',
        email: ''
      },
      quoteData: null,
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
    async fetchQuoteData() {
      try {
        const response = await axios.get('http://localhost:3000/quotes');
        console.log('Quote data:', response.data);
        this.quoteData = response.data[0]; // Assuming there's only one document
      } catch (err) {
        this.error = 'Failed to fetch quote data.';
        console.error(err);
      }
    },
    async fetchDefaults() {
      try {
        const response = await axios.get('http://localhost:3000/defaults');
        console.log('Defaults:', response.data);
        this.defaults = response.data || {
          height: 0,
          width: 0,
          thickness: 0,
          number: 0,
          coefficient: 0
        };
        console.log('Set defaults:', this.defaults);
      } catch (err) {
        this.error = 'Error fetching default values.';
        console.error(err);
      }
    },
    addRow() {
      console.log('Adding row with defaults:', this.defaults);
      this.rows.push({
        selectedCategory: '',
        selectedType: '',
        selectedArea: '',
        selectedMaterial: '',
        types: null,
        areas: null,
        items: [{
          area: '',
          selectedMaterial: '',
          size: {
            height: this.defaults.height,
            width: this.defaults.width,
            thickness: this.defaults.thickness
          },
          count: {
            number: this.defaults.number,
            coefficient: this.defaults.coefficient
          },
          inUSD: 0
        }]
      });
      console.log('Current rows:', this.rows);
    },
    updateRow(index, updatedRow) {
      console.log('Updating row at index:', index, 'with data:', updatedRow);
      this.rows.splice(index, 1, { ...updatedRow }); // Use splice to replace the row in a reactive way
      console.log('Current rows after update:', this.rows);
    },
    deleteRow(index) {
      console.log('Deleting row at index:', index);
      this.rows.splice(index, 1);
      console.log('Current rows after deletion:', this.rows);
    },
    async generateQuote() {
      try {
        console.log('Generating PDF with form data:', this.formData);
        // Save quote to the database
        const response = await axios.post('http://localhost:3000/quotes', this.formData);
        console.log('Quote saved:', response.data);

        // Generate PDF
        const doc = new jsPDF();
        
        // Add header image
        const imgData = 'data:image/jpeg;base64,...'; // Base64 encoded image data
        doc.addImage(imgData, 'JPEG', 15, 10, 50, 25);

        // Add user details
        doc.text(20, 50, `Name: ${this.formData.name}`);
        doc.text(20, 60, `Email: ${this.formData.email}`);

        // Add table with quote details
        const tableColumn = ['Category', 'Type', 'Area', 'Material', 'Height', 'Width', 'Thickness', 'Number', 'Coefficient', 'In USD'];
        const tableRows = [];

        this.rows.forEach(row => {
          row.items.forEach(item => {
            const dataRow = [
              row.selectedCategory,
              row.selectedType,
              item.area,
              item.selectedMaterial,
              item.size.height,
              item.size.width,
              item.size.thickness,
              item.count.number,
              item.count.coefficient,
              `$${item.inUSD}`
            ];
            tableRows.push(dataRow);
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
    console.log('Component mounted');
    await this.fetchQuoteData();
    await this.fetchDefaults();
    if (this.rows.length === 0) {
      console.log('No rows found, adding initial row');
      this.addRow(); // Add initial row with defaults if no rows exist
    }
    console.log('Component initialization complete');
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
  border: 1px solid black; /* Add border to td for proper table alignment */
  padding: 8px;
  text-align: left;
}
</style>
