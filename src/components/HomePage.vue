<template>
  <div class="home-page">
    <h1>Welcome to the Quote Generator</h1>
    <p>Choose an action to get started:</p>
    <nav>
      <ul>
        <li>
          <router-link to="/quote">Generate a Quote</router-link>
        </li>
        <li>
          <router-link to="/defaults">Set Default Values</router-link>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'HomePage'
};
</script>

<style scoped>
.home-page {
  text-align: center;
  margin-top: 50px;
}

nav ul {
  list-style-type: none;
  padding: 0;
}

nav ul li {
  display: inline-block;
  margin: 0 10px;
}

nav ul li a {
  text-decoration: none;
  color: #007BFF;
  font-size: 18px;
}

nav ul li a:hover {
  text-decoration: underline;
}
</style>
