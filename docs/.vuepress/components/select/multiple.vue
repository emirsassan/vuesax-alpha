<template>
  <div class="center con-selects">
    <vs-select
      v-model="value"
      label="Multiple"
      multiple
      danger
      placeholder="Filter"
    >
      <vs-option label="Vuesax" value="1"> Vuesax </vs-option>
      <vs-option label="Vue" value="2"> Vue </vs-option>
      <vs-option label="Javascript" value="3"> Javascript </vs-option>
      <vs-option label="Sass" value="4"> Sass </vs-option>
      <vs-option label="Typescript" value="5"> Typescript </vs-option>
      <vs-option label="Webpack" value="6"> Webpack </vs-option>
      <vs-option label="Nodejs" value="7"> Nodejs </vs-option>
    </vs-select>
    <vs-select
      v-model="value2"
      label="Filter Multiple"
      filter
      multiple
      placeholder="Filter Multiple"
    >
      <vs-option label="Vuesax" value="1"> Vuesax </vs-option>
      <vs-option label="Vue" value="2"> Vue </vs-option>
      <vs-option label="Javascript" value="3"> Javascript </vs-option>
      <vs-option label="Sass" value="4"> Sass </vs-option>
      <vs-option label="Typescript" value="5"> Typescript </vs-option>
      <vs-option label="Webpack" value="6"> Webpack </vs-option>
      <vs-option label="Nodejs" value="7"> Nodejs </vs-option>
    </vs-select>

    <vs-select
      v-model="value3"
      label="Multiple collapse chips"
      filter
      multiple
      collapse-chips
      placeholder="Collapse chips"
    >
      <vs-option label="Vuesax" value="1"> Vuesax </vs-option>
      <vs-option label="Vue" value="2"> Vue </vs-option>
      <vs-option label="Javascript" value="3"> Javascript </vs-option>
      <vs-option label="Sass" value="4"> Sass </vs-option>
      <vs-option label="Typescript" value="5"> Typescript </vs-option>
      <vs-option label="Webpack" value="6"> Webpack </vs-option>
      <vs-option label="Nodejs" value="7"> Nodejs </vs-option>
    </vs-select>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const value = ref(['1', '2', '3'])
const value2 = ref(['4'])
const value3 = ref(['1', '4', '5', '6'])
</script>

<style scoped lang="scss">
.con-selects {
  .vs-select-content {
    margin: 20px 10px;
    max-width: calc(40% - 20px);
  }
}

@media (max-width: 500px) {
  .con-selects {
    .vs-select-content {
      max-width: 100%;
    }
  }
}
</style>
