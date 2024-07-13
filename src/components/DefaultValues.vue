<template>
  <div>
    <h1>Set Default Values</h1>
    <form @submit.prevent="saveDefaults">
      <div>
        <label for="height">Height:</label>
        <input type="number" v-model.number="defaults.height" step="0.01" required />
      </div>
      <div>
        <label for="width">Width:</label>
        <input type="number" v-model.number="defaults.width" step="0.01" required />
      </div>
      <div>
        <label for="thickness">Thickness:</label>
        <input type="number" v-model.number="defaults.thickness" step="0.01" required />
      </div>
      <div>
        <label for="number">Number:</label>
        <input type="number" v-model.number="defaults.number" step="0.01" required />
      </div>
      <div>
        <label for="coefficient">Coefficient:</label>
        <input type="number" v-model.number="defaults.coefficient" step="0.01" required />
      </div>
      <div>
        <label for="shippingRate">Shipping Rate:</label>
        <input type="number" v-model.number="defaults.shippingRate" step="0.01" required />
      </div>
      <div>
        <label for="importTaxRate">Import Tax Rate:</label>
        <input type="number" v-model.number="defaults.importTaxRate" step="0.01" required />
      </div>
      <div>
        <label for="storageFee">Storage Fee:</label>
        <input type="number" v-model.number="defaults.storageFee" step="0.01" required />
      </div>
      <div>
        <label for="exchangeRate">Exchange Rate:</label>
        <input type="number" v-model.number="defaults.exchangeRate" step="0.01" required />
      </div>
      <button type="submit">Save Defaults</button>
    </form>
    <div v-if="message" class="message">{{ message }}</div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      defaults: {
        height: 0,
        width: 0,
        thickness: 0,
        number: 0,
        coefficient: 0,
        shippingRate: 0,
        importTaxRate: 0,
        storageFee: 0,
        exchangeRate: 0
      },
      message: ''
    };
  },
  methods: {
    async saveDefaults() {
      try {
        await axios.post('http://localhost:3000/defaults', this.defaults);
        this.message = 'Default values saved successfully!';
      } catch (err) {
        this.message = 'Error saving default values.';
        console.error(err);
      }
    },
    async fetchDefaults() {
      try {
        const response = await axios.get('http://localhost:3000/defaults');
        if (response.data) {
          this.defaults = response.data;
        } else {
          this.defaults = {
            height: 0,
            width: 0,
            thickness: 0,
            number: 0,
            coefficient: 0,
            shippingRate: 0,
            importTaxRate: 0,
            storageFee: 0,
            exchangeRate: 0,
            profitMargin: 0,
            discountRate: 0
          };
        }
      } catch (err) {
        console.error('Error fetching default values:', err);
      }
    }
  },
  mounted() {
    this.fetchDefaults();
  }
};
</script>

<style scoped>
.message {
  color: green;
}
</style>
