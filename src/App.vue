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
    <footer>
      <div class="footer-content">
        <div class="footer-section about">
          <h2>About ADUOne</h2>
          <p>ADUOne simplifies the process of building accessory dwelling units (ADUs) by offering pre-configured models and a clear pricing structure.</p>
        </div>
        <div class="footer-section contact">
          <h2>Contact Us</h2>
          <p>Email: support@aduone.com</p>
          <p>Phone: (123) 456-7890</p>
        </div>
        <div class="footer-section links">
          <router-link to="/privacy-policy">Privacy Policy</router-link>
          <router-link to="/terms-of-service">Terms of Service</router-link>
        </div>
      </div>
      <div class="footer-bottom">
        &copy; 2024 ADUOne | All Rights Reserved
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App'
};
</script>

<style>
/* Navigation Bar */
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

/* Footer */
footer {
  background-color: #ffffff;
  color: black;
  padding: 20px 0;
  text-align: center;
  position: relative;
  bottom: 0;
  width: 100%;
}

.footer-content {
  display: flex;
  justify-content: space-around;
  padding: 20px 0;
}

.footer-section {
  flex: 1;
  padding: 10px;
}

.footer-section h2 {
  margin-bottom: 15px;
}

.footer-section p, .footer-section a {
  color: black;
}

.footer-section a {
  text-decoration: none;
}

.footer-section a:hover {
  text-decoration: underline;
}

.footer-bottom {
  background-color: #23272b;
  padding: 10px 0;
  margin-top: 20px;
}

/* Ensure footer is at the bottom of the page */
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

router-view {
  flex: 1;
}
</style>
