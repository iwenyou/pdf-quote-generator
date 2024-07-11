<template>
  <div>
    <h1>Generate Your Quote</h1>
    <form @submit.prevent="generateQuote">
      <ClientDetails :client="formData.client" @update-client="updateClient" />
      <QuoteTable
        :rows="rows"
        :categories="categories"
        :products="products"
        :defaults="defaults"
        :formData="formData"
        @add-row="addRow"
        @update-row="updateRow"
        @delete-row="deleteRow"
      />
    </form>
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script>
import { getInitialData, initializeData, addRow, updateRow, deleteRow, updateClient, generateQuote } from '@/services/quoteService';
import ClientDetails from './quote/ClientDetails.vue';
import QuoteTable from './quote/QuoteTable.vue';

export default {
  components: {
    ClientDetails,
    QuoteTable
  },
  data() {
    return getInitialData();
  },
  methods: {
    addRow() {
      addRow(this);
    },
    updateRow(index, updatedRow) {
      updateRow(this, index, updatedRow);
    },
    deleteRow(index) {
      deleteRow(this, index);
    },
    updateClient({ field, value }) {
      updateClient(this, { field, value });
    },
    generateQuote() {
      generateQuote(this);
    }
  },
  async mounted() {
    await initializeData(this);
    console.log('Fetched categories:', this.categories);
    console.log('Fetched products:', this.products);
  }
};
</script>

<style src="@/styles/TableStyles.css"></style>
