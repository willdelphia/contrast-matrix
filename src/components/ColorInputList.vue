<template>
  <div id="color-input-list">
    <ul>
      <ColorInputRow
        v-for="(hex, index) in colors"
        :index="index"
        :key="index"
      />
    </ul>
    <div id="new-color-container">
      <button @click="pushNewColor">Add Color</button>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
import ColorInputRow from "./ColorInputRow.vue";

export default {
  name: "ColorInputList",
  components: {
    ColorInputRow,
  },
  setup() {
    const store = useStore();

    const colors = computed(() => store.getters.colors);

    function pushNewColor() {
      store.commit("pushNewColor");
    }

    return {
      colors,
      pushNewColor,
    };
  },
};
</script>

<style lang="scss" scoped>
#color-input-list {
  width: 400px;
  margin: 0 auto 1em auto;
}

ul {
  padding: 0;
  margin: 0;
  width: 100%;
}

#color-input-list {
  grid-area: color-input-list;
}

#new-color-container {
  text-align: right;
}
</style>
