<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/quote">Generate Quote</router-link>
      <router-link to="/defaults">Set Default Values</router-link>
      <router-link to="/add-product">Add Product</router-link>
      <router-link to="/add-category">Add Category</router-link>
    </nav>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
};
</script>

<style>
nav {
  padding: 1em;
  background-color: #f8f9fa;
}
nav a {
  margin-right: 1em;
  text-decoration: none;
  color: #007bff;
}
nav a:hover {
  text-decoration: underline;
}
</style>
