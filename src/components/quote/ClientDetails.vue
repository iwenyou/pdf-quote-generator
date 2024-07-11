<template>
  <div>
    <h2>Client Details</h2>
    <div>
      <label for="clientName">Client Name:</label>
      <input type="text" :value="client.name" @input="updateClient('name', $event.target.value)" placeholder="Enter client name" required />
    </div>
    <div>
      <label for="clientAddress">Client Address:</label>
      <input type="text" :value="client.address" @input="updateClient('address', $event.target.value)" placeholder="Enter client address" required />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    client: Object
  },
  methods: {
    updateClient(field, value) {
      this.$emit('update-client', { field, value });
    }
  }
};
</script>

<style scoped>
label {
  display: block;
  margin-top: 10px;
}
input {
  display: block;
  margin-top: 5px;
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}
</style>
