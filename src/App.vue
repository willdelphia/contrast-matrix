<template>
  <main id="main-grid">
    <div id="banner"><h1>Contrast Matrix</h1></div>
    <ColorInputList />
    <ColorMatrix />
    <div id="byline">
      <a
        href="https://github.com/willdelphia/contrast-matrix"
        aria-label="Github repository"
        v-html="github.toSVG()"
      >
      </a>
      Made with Vue 3 by Will Delphia
    </div>
  </main>
</template>

<script>
import ColorInputList from "./components/ColorInputList.vue";
import ColorMatrix from "./components/ColorMatrix.vue";
import octicons from "@primer/octicons";

export default {
  name: "App",
  components: {
    ColorInputList,
    ColorMatrix,
  },
  setup() {
    return {
      github: octicons["mark-github"],
    };
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

h1 {
  font-size: 1em;
}

#byline {
  margin: 4em auto 0 auto;
  padding-top: 1em;
  text-align: center;
}
</style>
