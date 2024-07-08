import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import naive from 'naive-ui';

console.log('Creating Vue app...');
const app = createApp(App);

console.log('Using router...');
app.use(router);

console.log('Using Naive UI...');
app.use(naive);

console.log('Mounting app...');
app.mount('#app');
console.log('App mounted!');
