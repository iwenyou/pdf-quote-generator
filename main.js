import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import axios from 'axios';

// Log requests
axios.interceptors.request.use(request => {
  console.log('Starting Request', request);
  return request;
});

// Log responses
axios.interceptors.response.use(response => {
  console.log('Response:', response);
  return response;
});

const app = createApp(App);

app.use(router);
app.mount('#app');
