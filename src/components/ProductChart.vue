<template>
    <n-config-provider>
      <div>
        <h1>Product Chart</h1>
        <n-data-table :columns="columns" :data="products" />
      </div>
    </n-config-provider>
  </template>
  
  <script>
  import axios from 'axios';
  import { defineComponent, ref, onMounted } from 'vue';
  import { NDataTable, NConfigProvider } from 'naive-ui';
  
  export default defineComponent({
    components: {
      NDataTable,
      NConfigProvider
    },
    setup() {
      const products = ref([]);
      const columns = ref([
        { title: 'Category', key: 'category' },
        { title: 'Product Type', key: 'productType' },
        { title: 'Part Name', key: 'partName' },
        { title: 'Material Name', key: 'materialName' },
        { title: 'Cost', key: 'cost' }
      ]);
  
      onMounted(async () => {
        try {
          console.log('Fetching products...');
          const response = await axios.get('http://localhost:3000/products');
          console.log('Raw products data:', response.data);
          const rawProducts = response.data;
          const formattedProducts = [];
  
          rawProducts.forEach((product) => {
            product.parts.forEach((part) => {
              part.materials.forEach((material) => {
                formattedProducts.push({
                  category: product.category,
                  productType: product.productType,
                  partName: part.name,
                  materialName: material.name,
                  cost: material.cost
                });
              });
            });
          });
  
          products.value = formattedProducts;
          console.log('Formatted products:', formattedProducts);
        } catch (error) {
          console.error('Failed to fetch products:', error);
        }
      });
  
      return {
        products,
        columns
      };
    }
  });
  </script>
  
  <style scoped>
  /* Add any necessary styles here */
  </style>
  