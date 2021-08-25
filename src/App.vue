<template>
  <div id="main-grid">
    <div id="banner">Contrast Table</div>
    <ColorInputList />
    <ColorMatrix />
  </div>
</template>

<script>
import ColorInputList from "./components/ColorInputList.vue";
import ColorMatrix from "./components/ColorMatrix.vue";

export default {
  name: "App",
  components: {
    ColorInputList,
    ColorMatrix,
  },
};
</script>

<style lang="scss">
body {
  padding: 30px;
  background: rgb(204, 204, 204);
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

#main-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto auto;
  grid-template-areas:
    "banner banner"
    "color-input-list color-matrix"
    "footer footer";
}
</style>
