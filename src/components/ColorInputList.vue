<template>
  <div id="color-input-list">
    <ul aria-label="Color Input List">
      <ColorInputRow
        v-for="(hex, index) in colors"
        :index="index"
        :key="index"
      />
    </ul>
    <div id="new-color-container">
      <button @click="pushNewColor">Add Color</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import ColorInputRow from "./ColorInputRow.vue";

const store = useStore();

const colors = computed(() => store.getters.colors);

function pushNewColor() {
  store.commit("pushNewColor");
}
</script>

<style lang="scss" scoped>
#color-input-list {
  max-width: 400px;
  margin: 0 auto 1em auto;
}

ul {
  padding: 0;
  margin: 0;
  width: 100%;
}

#color-input-list {
  grid-area: color-input-list;
}

#new-color-container {
  text-align: right;
}
</style>
