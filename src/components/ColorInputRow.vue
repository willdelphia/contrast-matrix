<template>
  <li class="color-input-row" :class="{ 'alpha-mode': alphaMode }">
    <div class="index">
      {{ index + 1 }}
    </div>
    <div class="hex-code">
      <label>
        <span>Hex Code:</span>
        <input
          type="text"
          v-model="colorHex"
          :aira-invalid="!colorValid"
          :disabled="alphaMode"
        />
        <span class="invalid" v-if="!colorValid">Invalid</span>
      </label>
    </div>
    <div class="color-picker">
      <label>
        <span>Color Picker:</span>
        <input type="color" v-model="colorHex" :disabled="alphaMode" />
      </label>
    </div>
    <div class="alpha-toggler">
      <label class="alpha-toggler-checkbox-label">
        <span>Alpha Calc</span>
        <input
          class="alpha-toggler-checkbox"
          type="checkbox"
          v-model="alphaMode"
        />
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
    <div v-if="alphaMode" class="alpha-mode-panel">
      <div class="alpha-panel-input-container alpha-foreground-rbga-code">
        <label>
          <span>Foreground RGBA Code:</span>
          <input
            type="text"
            v-model="alphaForegroundRGBA"
            :aira-invalid="!colorValid"
          />
          <span class="invalid" v-if="!alphaForegroundValid">Invalid</span>
        </label>
      </div>
      <div class="alpha-panel-input-container alpha-background-hex-code">
        <label>
          <span>Background RBG Code:</span>
          <input
            type="text"
            v-model="alphaBackgroundRGB"
            :aira-invalid="!alphaBackgroundValid"
          />
          <span class="invalid" v-if="!alphaBackgroundValid">Invalid</span>
        </label>
      </div>
    </div>
  </li>
</template>

<script setup>
import { computed, defineProps, ref, watch } from "vue";
import { useStore } from "vuex";
import { x, duplicate } from "@primer/octicons";
import hexRgb from "hex-rgb";
import rgbHex from "rgb-hex";
import parse from "color-parse";
import { validateHTMLColor } from "validate-color";
import { normal } from "color-blend";

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

//alpha mode

const alphaMode = ref(false);
const alphaForegroundRGBA = ref("rgba(0,0,0,0)");
const alphaBackgroundRGB = ref("rgb(255,255,255)");

const alphaForegroundValid = computed(() => {
  return validateHTMLColor(alphaForegroundRGBA.value);
});

const alphaBackgroundValid = computed(() => {
  return validateHTMLColor(alphaBackgroundRGB.value);
});

watch(() => {
  if (!alphaMode.value && colorValid.value) {
    const foreground = hexRgb(colorHex.value);
    const { red, green, blue } = foreground;
    alphaForegroundRGBA.value = `rgba(${red}, ${green}, ${blue}, 1)`;
  }
});

watch(() => {
  if (alphaMode.value && alphaForegroundValid.value) {
    const fg = parse(alphaForegroundRGBA.value);
    const bg = parse(alphaBackgroundRGB.value);

    const fgObj = {
      r: fg.values[0],
      g: fg.values[1],
      b: fg.values[2],
      a: fg.alpha,
    };

    const bgObj = {
      r: bg.values[0],
      g: bg.values[1],
      b: bg.values[2],
      a: bg.alpha,
    };

    const combination = normal(bgObj, fgObj);
    const { r, g, b } = combination;
    colorHex.value = `#${rgbHex(r, g, b)}`;
  }
});
</script>

<style lang="scss" scoped>
.color-input-row {
  display: grid;
  grid-template-columns: auto auto auto auto 1fr auto;
  grid-template-areas: "index hex color alpha-toggler . actions";

  &.alpha-mode {
    grid-template-columns: auto auto auto auto 1fr auto;
    grid-template-areas:
      "index hex color alpha-toggler . actions"
      "index alpha-panel alpha-panel alpha-panel . .";
  }

  background: #fff;
  margin-bottom: 0.3em;
  list-style: none;
  column-gap: 0.3em;

  & > div:not(.index):not(.alpha-mode-panel) {
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
  width: 150px;
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

.alpha-toggler {
  grid-area: alpha-toggler;
}

.alpha-mode-panel {
  grid-area: alpha-panel;
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

.alpha-toggler-checkbox-label {
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100%;
}

.alpha-toggler-checkbox {
  align-self: center;
  justify-self: center;
  width: 17px;
  height: 17px;
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

.alpha-mode-panel {
  display: flex;
  flex-direction: column;
  gap: 0.3em;

  & > div {
    padding: 0.3em;
  }
}

.alpha-panel-input-container {
  display: flex;
  gap: 1em;
}

.alpha-foreground-rbga-code {
  grid-area: foreground;
}

.alpha-background-hex-code {
  grid-area: background-code;
}

.alpha-background-color-picker {
  grid-area: background-picker;
}
</style>
