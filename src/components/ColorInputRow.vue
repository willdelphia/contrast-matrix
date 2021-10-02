<template>
  <li class="color-input-row">
    <div class="index">
      {{ index + 1 }}
    </div>
    <div class="hex-code">
      <label>
        <span>Hex Code:</span>
        <input type="text" v-model="colorHex" :aira-invalid="!colorValid" />
        <span class="invalid" v-if="!colorValid">Invalid</span>
      </label>
    </div>
    <div class="color-picker">
      <label>
        <span>Color Picker:</span>
        <input type="color" v-model="colorHex" />
      </label>
    </div>
    <div class="row-actions">
      <button
        @click="cloneColor"
        v-html="duplicate.toSVG()"
        aria-label="Duplicate Row"
        class="icon-button"
      ></button>
      <button
        v-if="colors.length > 1"
        @click="deleteColor"
        v-html="x.toSVG()"
        aria-label="Delete Row"
        class="icon-button"
      ></button>
    </div>
  </li>
</template>

<script setup>
import { computed, defineProps } from "vue";
import { useStore } from "vuex";
import { x, duplicate } from "@primer/octicons";

const props = defineProps({
  hex: String,
  index: Number,
});

const store = useStore();

const colors = computed(() => store.getters.colors);

const colorValid = computed(() => store.getters.valid(props.index));
const colorHex = computed({
  get: () => store.getters.hex(props.index),
  set: (val) =>
    store.commit("updateColor", { index: props.index, newColor: val }),
});

function deleteColor() {
  store.commit("deleteColor", { index: props.index });
}

function cloneColor() {
  store.commit("duplicateColor", { index: props.index });
}
</script>

<style lang="scss" scoped>
.color-input-row {
  display: grid;
  grid-template-columns: auto auto auto 1fr auto;
  grid-template-areas: "index hex color . actions";

  background: #fff;
  margin-bottom: 0.3em;
  list-style: none;
  column-gap: 0.3em;

  & > div:not(.index) {
    padding: 0.3em;
  }

  @media screen and (max-width: 350px) {
    grid-template-columns: auto auto 1fr auto;
    grid-template-rows: auto auto;
    grid-template-areas:
      "index hex   . actions"
      "index color . actions";
  }
}

input[type="text"] {
  width: 100px;
  height: 2em;
  box-sizing: border-box;
}

input[type="color"] {
  height: 2em;
  box-sizing: border-box;
}

.index {
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
  min-width: 30px;
  grid-area: index;
  align-self: stretch;
  background: rgb(243, 243, 243);
}

.hex-code {
  grid-area: hex;
}

.color-picker {
  grid-area: color;
}

.invalid {
  color: red;
  margin-top: 0.2em;
}

label {
  span {
    display: block;
    font-size: 0.6em;
    margin-bottom: 0.2em;
    white-space: nowrap;
  }
}

.row-actions {
  display: flex;
  gap: 0.3em;
  grid-area: actions;
  align-self: stretch;
}

.icon-button {
  width: 2em;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
