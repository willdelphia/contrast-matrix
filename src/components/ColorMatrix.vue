<template>
  <div id="color-matrix">
    <div id="settings">
      <div id="left-settings">
        <div>
          <div class="small-label">Minimum Contrast:</div>
          {{ min }}
        </div>
        <input
          aria-label="Minimum Contrast"
          type="range"
          min="0"
          max="21"
          step="0.1"
          v-model="min"
        />
      </div>
      <div id="right-settings">
        <button @click="changeMin(4.5)">Text AA</button>
        <button @click="changeMin(3)">Large Text AA</button>
        <button @click="changeMin(3)">Graphics AA</button>
      </div>
    </div>
    <div class="overflower">
      <table>
        <thead>
          <tr>
            <th class="empty"><!-- blank --></th>
            <th
              v-for="(color, colorIndex) in colors"
              :key="colorIndex"
              scope="col"
            >
              {{ color }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(colorOne, colorOneIndex) in colors" :key="colorOneIndex">
            <th scope="row">{{ colorOne }}</th>
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
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useStore } from "vuex";

import ContrastCell from "./ContrastCell.vue";

const store = useStore();
const colors = computed(() => store.getters.uniqueValidColors);

const min = ref(4.5);

function changeMin(val) {
  min.value = val;
}
</script>

<style lang="scss" scoped>
#color-matrix {
  grid-area: color-matrix;
}

.overflower {
  max-width: 100%;
  overflow: auto;
}

table {
  box-sizing: border-box;
  margin: auto;
  border-collapse: collapse;
  th,
  td {
    border: 2px grey solid;
    padding: 0.5em;
  }
}

th {
  font-family: "Source Code Pro", monospace;
}

.empty {
  border: none;
}

#settings {
  width: 400px;
  max-width: 100%;
  background: white;
  box-sizing: border-box;
  display: flex;
  gap: 1em;
  margin: 0 auto 2em;
}

#left-settings {
  padding: 0.5em;
}

#right-settings {
  display: flex;
  justify-content: flex-end;
  gap: 0.3em;
  flex-wrap: wrap;
  padding: 0.3em;
}

.small-label {
  font-size: 0.6em;
}
</style>
