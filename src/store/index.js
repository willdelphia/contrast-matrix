import { createStore } from "vuex";

function validateColorCode(userColor) {
  return /^#([0-9A-F]{3}){1,2}$/i.test(userColor);
}

export default createStore({
  state: {
    colors: [
      { hex: "#ffffff", valid: true },
      { hex: "#000000", valid: true },
    ],
  },
  getters: {
    hex: (state) => (index) => state.colors[index].hex,
    valid: (state) => (index) => state.colors[index].valid,
    colors: (state) => state.colors,
    uniqueValidColors: (state) => {
      const validColors = state.colors
        .filter((colorObj) => colorObj.valid)
        .map((colorObj) => colorObj.hex);
      return [...new Set(validColors)];
    },
  },
  mutations: {
    updateColor(state, payload) {
      const { index, newColor } = payload;
      console.log(index);
      state.colors[index].hex = newColor;
      state.colors[index].valid = validateColorCode(newColor);
    },
    deleteColor(state, payload) {
      const { index } = payload;
      state.colors.splice(index, 1);
    },
    duplicateColor(state, payload) {
      const { index } = payload;
      state.colors.splice(index, 0, { ...state.colors[index] });
    },
    pushNewColor(state) {
      state.colors.push({
        hex: "#000000",
        valid: true,
      });
    },
  },
  actions: {},
  modules: {},
});
