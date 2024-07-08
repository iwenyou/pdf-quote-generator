import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/components/HomePage.vue';
import QuoteForm from '@/components/QuoteForm.vue';
import DefaultValues from '@/components/DefaultValues.vue';

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage
  },
  {
    path: '/quote',
    name: 'QuoteForm',
    component: QuoteForm
  },
  {
    path: '/defaults',
    name: 'DefaultValues',
    component: DefaultValues
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
