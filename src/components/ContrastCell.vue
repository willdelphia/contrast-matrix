<template>
  <td>
    <div v-if="colorOne === colorTwo" class="disable-cell"></div>
    <div class="report-box" v-else>
      <div class="preview-outer" :style="{ backgroundColor: colorOne }">
        <div class="preview-inner" :style="{ backgroundColor: colorTwo }"></div>
      </div>
      <div>
        {{ contrastInfo.ratioString }}
      </div>
      <div v-if="contrastInfo.ratio > min" class="passes lil-pill">Pass!</div>
      <div v-else class="fails lil-pill">Fail</div>
    </div>
  </td>
</template>

<script>
import { ColorContrastCalc } from "color-contrast-calc";
import { computed } from "vue";

export default {
  name: "ContrastCell",
  props: {
    colorOne: String,
    colorTwo: String,
    min: String,
  },
  setup(props) {
    const contrastInfo = computed(() => {
      const colorOne = ColorContrastCalc.colorFrom(props.colorOne);
      const colorTwo = ColorContrastCalc.colorFrom(props.colorTwo);
      const ratio = colorOne.contrastRatioAgainst(colorTwo);

      return {
        ratioString: ratio.toFixed(2),
        ratio: ratio,
        level: colorOne.contrastLevel(colorTwo),
      };
    });

    const minNumber = computed(() => parseFloat(props.min));

    return {
      contrastInfo,
      minNumber,
    };
  },
};
</script>

<style lang="scss" scoped>
.report-box {
  width: 100%;
  min-width: 70px;
  height: 100%;
  text-align: center;
}

.preview-outer {
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  margin: auto;
}

.preview-inner {
  width: 20px;
  height: 20px;
  border-radius: 100%;
}

.disable-cell {
  background: grey;
  width: 100%;
  height: 100%;
}

.lil-pill {
  color: black;
  border-radius: 3px;
  font-size: 0.7em;
  display: inline-block;
  padding: 0.3em;
}

.passes {
  background: rgb(0, 212, 0);
}

.fails {
  background: rgb(212, 0, 0);
  color: white;
}
</style>
