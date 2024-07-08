<template>
  <div id="app">
    <nav>
      <ul>
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/quote">Generate Quote</router-link></li>
        <li><router-link to="/defaults">Set Default Values</router-link></li>
      </ul>
    </nav>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
};
</script>

<style>
nav ul {
  list-style: none;
  padding: 0;
  display: flex;
  gap: 10px;
}
nav ul li {
  display: inline;
}
nav ul li a {
  text-decoration: none;
  color: #000;
}
nav ul li a.router-link-active {
  font-weight: bold;
}
</style>
