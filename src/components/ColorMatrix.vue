<template>
  <div id="color-matrix">
    <div class="settings">
      Minimum: {{ min }}<br />
      <input type="range" min="0" max="25" step="0.1" v-model="min" />
    </div>
    <table>
      <thead>
        <tr>
          <th><!-- blank --></th>
          <th v-for="(color, colorIndex) in colors" :key="colorIndex">
            {{ color }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(colorOne, colorOneIndex) in colors" :key="colorOneIndex">
          <th>{{ colorOne }}</th>
          <ContrastCell
            v-for="(colorTwo, colorTwoIndex) in colors"
            :key="colorTwoIndex"
            :colorOne="colorOne"
            :colorTwo="colorTwo"
            :min="min"
          />
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { computed, ref } from "vue";
import { useStore } from "vuex";

import ContrastCell from "./ContrastCell.vue";

export default {
  name: "ColorMatrix",
  components: {
    ContrastCell,
  },
  setup() {
    const store = useStore();
    const colors = computed(() => store.getters.uniqueValidColors);

    const min = ref(4.5);

    return {
      colors,
      min,
    };
  },
};
</script>

<style lang="scss" scoped>
#color-matrix {
  grid-area: color-matrix;
}

table {
  border-collapse: collapse;
  th,
  td {
    border: 2px grey solid;
    padding: 0.5em;
  }
}
</style>
