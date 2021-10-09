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
          @input="foregroundInput"
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
            v-model="foregroundRGBA"
            :aira-invalid="!colorValid"
            @input="foregroundInput"
          />
          <span class="invalid" v-if="!foregroundValid">Invalid</span>
        </label>
        <label>
          <span>Alpha:</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            v-model="foregroundAlpha"
            @input="alphaRangeInput"
            :disabled="!foregroundAlphaValid"
            @mousedown="removeSelectionRanges"
          />
        </label>
      </div>
      <div class="alpha-panel-input-container alpha-background-hex-code">
        <label>
          <span>Background RBG Code:</span>
          <input
            type="text"
            v-model="backgroundRGB"
            :aira-invalid="!backgroundValid"
            @input="backgroundTextInput"
          />
          <span class="invalid" v-if="!backgroundValid">Invalid</span>
        </label>
        <label>
          <span>BG Color Picker:</span>
          <input
            type="color"
            v-model="backgroundPicker"
            @input="backgroundPickerInput"
          />
        </label>
      </div>
    </div>
  </li>
</template>

<script setup>
import { computed, defineProps, ref, watchEffect } from "vue";
import { useStore } from "vuex";
import { x, duplicate } from "@primer/octicons";
import hexRgb from "hex-rgb";
import rgbHex from "rgb-hex";
import parse from "color-parse";
import { validateHTMLColor } from "validate-color";
import { normal } from "color-blend";
import { removeSelectionRanges } from "../common.js";

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
const foregroundRGBA = ref("rgba(0,0,0,0)");
const foregroundAlpha = ref(1);
const foregroundAlphaValid = ref(true);
const backgroundRGB = ref("rgb(255,255,255)");
const backgroundPicker = ref("#ffffff");

const foregroundValid = computed(() => {
  return validateHTMLColor(foregroundRGBA.value);
});

const backgroundValid = computed(() => {
  return validateHTMLColor(backgroundRGB.value);
});

watchEffect(() => {
  if (!alphaMode.value && colorValid.value) {
    const foreground = hexRgb(colorHex.value);
    const { red, green, blue } = foreground;
    foregroundRGBA.value = `rgba(${red}, ${green}, ${blue}, 1)`;
  }
});

watchEffect(() => {
  if (alphaMode.value && foregroundValid.value) {
    const fg = parse(foregroundRGBA.value);
    const bg = parse(backgroundRGB.value);

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

function backgroundTextInput() {
  const hex = rgbHex(backgroundRGB.value);
  backgroundPicker.value = `#${hex}`;
}

function backgroundPickerInput() {
  const rbg = hexRgb(backgroundPicker.value);
  backgroundRGB.value = `rgb(${rbg.red}, ${rbg.green}, ${rbg.blue})`;
}

function alphaRangeInput() {
  const fg = parse(foregroundRGBA.value);

  const fgObj = {
    r: fg.values[0],
    g: fg.values[1],
    b: fg.values[2],
  };

  foregroundRGBA.value = `rgba(${fgObj.r}, ${fgObj.g}, ${fgObj.b}, ${foregroundAlpha.value})`;
}

function foregroundInput() {
  const fg = parse(foregroundRGBA.value);
  if (isNaN(fg.alpha)) {
    console.log("NOT A NUMBER");
    foregroundAlphaValid.value = false;
    foregroundAlpha.value = 1;
  } else {
    foregroundAlphaValid.value = true;
    foregroundAlpha.value = fg.alpha;
  }
}
</script>

<style lang="scss" scoped>
.color-input-row {
  display: grid;
  grid-template-columns: auto auto auto auto 1fr auto;
  grid-template-areas: "index hex color alpha-toggler . actions";
  padding: 0.3em;

  &.alpha-mode {
    grid-template-columns: auto auto auto auto 1fr auto;
    grid-template-areas:
      "index hex color alpha-toggler . actions"
      "index alpha-panel alpha-panel alpha-panel . . ";
  }

  background: #fff;
  margin-bottom: 0.3em;
  list-style: none;
  column-gap: 0.4em;
  row-gap: 0.3em;

  @media screen and (max-width: 480px) {
    grid-template-columns: auto auto auto 1fr auto;
    grid-template-rows: auto auto;
    grid-template-areas:
      "index hex  hex  . actions"
      "index color  alpha-toggler . . ";

    &.alpha-mode {
      grid-template-columns: auto auto auto 1fr auto;
      grid-template-areas:
        "index hex hex . actions"
        "index color alpha-toggler . . "
        "index alpha-panel alpha-panel alpha-panel .  ";
    }
  }
}

input[type="text"] {
  width: 160px;
  height: 2em;
}

input[type="color"] {
  height: 2em;
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
  margin: -0.3em 0 -0.3em -0.3em;
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
  text-align: center;
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
}

.alpha-panel-input-container {
  display: flex;
  gap: 0.4em;
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

[type="range"] {
  width: 100px;
}
</style>
