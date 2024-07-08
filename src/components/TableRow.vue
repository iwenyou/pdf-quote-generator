<template>
  <tr>
    <td>
      <select v-model="localRow.selectedCategory" @change="handleCategoryChange">
        <option value="" disabled>Select Category</option>
        <option v-for="(value, key) in categories" :key="key" :value="key">{{ key }}</option>
      </select>
    </td>
    <td>
      <select v-if="localRow.types" v-model="localRow.selectedType" @change="handleTypeChange">
        <option value="" disabled>Select Type</option>
        <option v-for="(value, key) in localRow.types" :key="key" :value="key">{{ key }}</option>
      </select>
      <div v-else>Select Category first</div>
    </td>
    <td>
      <select v-if="localRow.areas" v-model="localRow.selectedArea" @change="handleAreaChange">
        <option value="" disabled>Select Area</option>
        <option v-for="(value, key) in localRow.areas" :key="key" :value="key">{{ key }}</option>
      </select>
      <div v-else>Select Type first</div>
    </td>
    <td>
      <select v-if="localRow.selectedArea && localRow.areas" v-model="localRow.items[0].selectedMaterial">
        <option value="" disabled>Select Material</option>
        <option v-for="(value, key) in localRow.areas" :key="key" :value="key">{{ key }}</option>
      </select>
      <div v-else>Select Area first</div>
    </td>
    <td v-for="(item, index) in localRow.items" :key="`height-${index}`">
      <input type="number" v-model.number="item.size.height" :placeholder="defaults.height" />
    </td>
    <td v-for="(item, index) in localRow.items" :key="`width-${index}`">
      <input type="number" v-model.number="item.size.width" :placeholder="defaults.width" />
    </td>
    <td v-for="(item, index) in localRow.items" :key="`thickness-${index}`">
      <input type="number" v-model.number="item.size.thickness" :placeholder="defaults.thickness" />
    </td>
    <td v-for="(item, index) in localRow.items" :key="`number-${index}`">
      <input type="number" v-model.number="item.count.number" :placeholder="defaults.number" />
    </td>
    <td v-for="(item, index) in localRow.items" :key="`coefficient-${index}`">
      <input type="number" v-model.number="item.count.coefficient" :placeholder="defaults.coefficient" />
    </td>
    <td v-for="(item, index) in localRow.items" :key="`inUSD-${index}`">
      {{ item.inUSD }}
    </td>
    <td>
      <button @click="deleteRow(index)">Delete</button>
    </td>
  </tr>
</template>

<script>
export default {
  props: {
    row: Object,
    categories: Object,
    defaults: Object,
    index: Number
  },
  emits: ['update-row', 'delete-row'],
  data() {
    return {
      localRow: { ...this.row }
    };
  },
  watch: {
    row: {
      handler(newValue) {
        console.log('Prop row updated:', newValue);
        this.localRow = { ...newValue };
      },
      deep: true
    }
  },
  mounted() {
    console.log('TableRow mounted with row:', this.row);
  },
  methods: {
    handleCategoryChange() {
      console.log('Category changed to:', this.localRow.selectedCategory);
      this.localRow.selectedType = '';
      this.localRow.selectedArea = '';
      this.localRow.types = this.categories[this.localRow.selectedCategory];
      this.localRow.areas = null;
      this.localRow.items = [{
        area: '',
        selectedMaterial: '',
        size: {
          height: this.defaults?.height || 0,
          width: this.defaults?.width || 0,
          thickness: this.defaults?.thickness || 0
        },
        count: {
          number: this.defaults?.number || 0,
          coefficient: this.defaults?.coefficient || 0
        },
        inUSD: 0
      }];
      this.$emit('update-row', this.index, this.localRow);
    },
    handleTypeChange() {
      console.log('Type changed to:', this.localRow.selectedType);
      this.localRow.selectedArea = '';
      this.localRow.areas = this.localRow.types[this.localRow.selectedType].material || this.localRow.types[this.localRow.selectedType];
      this.localRow.items = [{
        area: '',
        selectedMaterial: '',
        size: {
          height: this.defaults?.height || 0,
          width: this.defaults?.width || 0,
          thickness: this.defaults?.thickness || 0
        },
        count: {
          number: this.defaults?.number || 0,
          coefficient: this.defaults?.coefficient || 0
        },
        inUSD: 0
      }];
      this.$emit('update-row', this.index, this.localRow);
    },
    handleAreaChange() {
      console.log('Area changed to:', this.localRow.selectedArea);
      const selectedMaterial = this.localRow.areas[this.localRow.selectedArea];
      this.localRow.items = [{
        area: this.localRow.selectedArea,
        selectedMaterial: '',
        size: {
          height: this.defaults?.height || 0,
          width: this.defaults?.width || 0,
          thickness: this.defaults?.thickness || 0
        },
        count: {
          number: this.defaults?.number || 0,
          coefficient: this.defaults?.coefficient || 0
        },
        inUSD: selectedMaterial.price ? selectedMaterial.price.unitPrice : 0
      }];
      this.$emit('update-row', this.index, this.localRow);
    },
    deleteRow(itemIndex) {
      console.log('Deleting item at index:', itemIndex);
      this.localRow.items.splice(itemIndex, 1);
      if (this.localRow.items.length === 0) {
        this.$emit('delete-row', this.index);
      } else {
        this.$emit('update-row', this.index, this.localRow);
      }
    }
  }
};
</script>

<style scoped>
select, input {
  width: 100%;
  box-sizing: border-box;
  padding: 2px;
}
td {
  border: 1px solid black;
}
</style>
