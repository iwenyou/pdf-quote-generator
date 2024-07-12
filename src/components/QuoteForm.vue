<template>
  <div>
    <h1>Generate Your Quote</h1>
    <form @submit.prevent="generateQuote">
      <ClientDetails :client="formData.client" @update-client="updateClient" />
      <QuoteTable
        :spaces="spaces"
        :categories="categories"
        :products="products"
        :defaults="defaults"
        :formData="formData"
        @add-space="addSpace"
        @update-space="updateSpace"
        @delete-space="deleteSpace"
      />
    </form>
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script>
import { getInitialData, initializeData, addSpace, updateSpace, deleteSpace, updateClient, generateQuote } from '@/services/quoteService';
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
    addSpace() {
      addSpace(this);
    },
    updateSpace(index, updatedSpace) {
      updateSpace(this, index, updatedSpace);
    },
    deleteSpace(index) {
      deleteSpace(this, index);
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
