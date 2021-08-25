<template>
  <li class="color-input-row">
    <div class="index">
      {{ index + 1 }}
    </div>
    <div class="hex-code">
      <input type="text" v-model="colorHex" />
    </div>
    <div>
      <input type="color" v-model="colorHex" />
      <span class="invalid" v-if="!colorValid">Invalid</span>
    </div>
    <div>
      <button v-if="colors.length > 1" @click="deleteColor">Delete</button>
      <button @click="cloneColor">Duplicate</button>
    </div>
  </li>
</template>

<script>
import { useRef, computed } from "vue";
import { useStore } from "vuex";

export default {
  name: "ColorInputRow",
  props: {
    hex: String,
    index: Number,
  },
  setup(props) {
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

    return {
      colors,
      colorHex,
      colorValid,
      deleteColor,
      cloneColor,
    };
  },
};
</script>

<style lang="scss" scoped>
.color-input-row {
  display: grid;
  grid-template-columns: auto auto 1fr auto;
  align-items: center;

  background: #fff;
  margin-bottom: 0.2em;
  list-style: none;
  gap: 0.3em;

  & > div:not(.index) {
    padding: 0.2em;
  }
}

input[type="text"] {
  width: 100px;
}

.index {
  display: flex;
  text-align: center;
  justify-content: center;
  min-width: 30px;
}

.invalid {
  display: inline-block;
  margin-left: 1em;
}
</style>
