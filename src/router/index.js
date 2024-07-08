import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/components/HomePage.vue';
import QuoteForm from '@/components/QuoteForm.vue';
import DefaultValues from '@/components/DefaultValues.vue';
import AddProduct from '@/components/AddProduct.vue';
import AddCategory from '@/components/AddCategory.vue';
import ProductChart from '@/components/ProductChart.vue';  // Import the new component
import QuoteList from '@/components/QuoteList.vue';


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
  },
  {
    path: '/add-product',
    name: 'AddProduct',
    component: AddProduct
  },
  {
    path: '/add-category',
    name: 'AddCategory',
    component: AddCategory
  },
  {
    path: '/product-chart',
    name: 'ProductChart',
    component: ProductChart
  },
  {
    path: '/quotes',
    name: 'QuoteList',
    component: QuoteList
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
