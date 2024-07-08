<template>
  <div>
    <h1>Set Default Values</h1>
    <form @submit.prevent="saveDefaults">
      <div>
        <label for="height">Height:</label>
        <input type="number" v-model.number="defaults.height" required />
      </div>
      <div>
        <label for="width">Width:</label>
        <input type="number" v-model.number="defaults.width" required />
      </div>
      <div>
        <label for="thickness">Thickness:</label>
        <input type="number" v-model.number="defaults.thickness" required />
      </div>
      <div>
        <label for="number">Number:</label>
        <input type="number" v-model.number="defaults.number" required />
      </div>
      <div>
        <label for="coefficient">Coefficient:</label>
        <input type="number" v-model.number="defaults.coefficient" required />
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
        coefficient: 0
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
            coefficient: 0
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
