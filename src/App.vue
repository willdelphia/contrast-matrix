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
  padding: 30px;
  background: rgb(204, 204, 204);
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

#banner {
  font-family: "Source Code Pro", monospace;
}

#main-grid {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}
</style>
