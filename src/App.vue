<template>
  <div id="main-grid">
    <div id="banner">Contrast Matrix</div>
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
  padding: 1em;
  background: rgb(204, 204, 204);
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

#banner {
  font-family: "Source Code Pro", monospace;
  text-align: center;
  margin-bottom: 1em;
}

#main-grid {
}
</style>
