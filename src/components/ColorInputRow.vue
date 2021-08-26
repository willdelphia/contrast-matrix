<template>
  <li class="color-input-row">
    <div class="index">
      {{ index + 1 }}
    </div>
    <div class="hex-code">
      <label>
        <span>Hex Code:</span>
        <input type="text" v-model="colorHex" :invalid="!colorValid" />
        <span class="invalid" v-if="!colorValid">Invalid</span>
      </label>
    </div>
    <div>
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

<script>
import { useRef, computed } from "vue";
import { useStore } from "vuex";
import { x, duplicate } from "@primer/octicons";

export default {
  name: "ColorInputRow",
  props: {
    hex: String,
    index: Number,
  },
  components: {},
  setup(props) {
    console.log(x, duplicate);
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
      x,
      duplicate,
    };
  },
};
</script>

<style lang="scss" scoped>
.color-input-row {
  display: grid;
  grid-template-columns: auto auto 1fr auto;
  align-items: center;
  min-width: 400px;

  background: #fff;
  margin-bottom: 0.3em;
  list-style: none;
  gap: 0.3em;

  & > div:not(.index) {
    padding: 0.3em;
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
  color: red;
  margin-top: 0.2em;
}

label {
  span {
    display: block;
    font-size: 0.6em;
  }
}

.row-actions {
  display: flex;
  gap: 0.3em;
}

.icon-button {
  width: 2em;
  height: 3em;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
