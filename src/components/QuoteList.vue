<template>
    <div>
      <h1>Quotes List</h1>
      <table>
        <thead>
          <tr>
            <th>Client Name</th>
            <th>Client Address</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="quote in quotes" :key="quote._id">
            <td>{{ quote.client.name }}</td>
            <td>{{ quote.client.address }}</td>
            <td>{{ new Date(quote.date).toLocaleString() }}</td>
            <td>
              <button @click="viewQuote(quote._id)">View</button>
              <button @click="deleteQuote(quote._id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="error" class="error">{{ error }}</div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import router from '@/router';
  
  export default {
    data() {
      return {
        quotes: [],
        error: ''
      };
    },
    methods: {
      async fetchQuotes() {
        try {
          const response = await axios.get('http://localhost:3000/quotes');
          this.quotes = response.data;
        } catch (err) {
          this.error = 'Failed to fetch quotes.';
          console.error(err);
        }
      },
      viewQuote(id) {
        router.push({ name: 'QuoteForm', params: { id } });
      },
      async deleteQuote(id) {
        try {
          await axios.delete(`http://localhost:3000/quotes/${id}`);
          this.quotes = this.quotes.filter(quote => quote._id !== id);
        } catch (err) {
          this.error = 'Failed to delete quote.';
          console.error(err);
        }
      }
    },
    async mounted() {
      await this.fetchQuotes();
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
  