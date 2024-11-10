<script setup>
import LWChart from "./LWChart.vue";
import sampleData from "~/utils/testdata2.json";

function generateSampleData(ohlc) {
  const randomFactor = 25 + Math.random() * 25;
  function samplePoint(i) {
    return (
      i *
        (0.5 +
          Math.sin(i / 10) * 0.2 +
          Math.sin(i / 20) * 0.4 +
          Math.sin(i / randomFactor) * 0.8 +
          Math.sin(i / 500) * 0.5) +
      200
    );
  }

  const res = [];
  const date = new Date(Date.UTC(2018, 0, 1, 0, 0, 0, 0));
  const numberOfPoints = ohlc ? 100 : 500;
  for (let i = 0; i < numberOfPoints; ++i) {
    const time = date.getTime() / 1000;
    const value = samplePoint(i);

    res.push({
      time,
      value,
    });

    date.setUTCDate(date.getUTCDate() + 1);
  }

  return res;
}

const chartOptions = {
  layout: {
    textColor: "#9ca3af",
    background: { type: "solid", color: "black" },
  },
  grid: {
    vertLines: {
      visible: false,
    },
    horzLines: {
      visible: false,
    },
  },
};
// const data = ref(generateSampleData(false));
// console.log(data.value);

const seriesOptions = ref({
  color: "rgb(45, 77, 205)",
});
const chartType = ref("area");
const lwChart = ref();

const result = getDataFromJson(sampleData);
</script>

<template>
  <div class="chart-container">
    <LWChart
      ref="lwChart"
      :type="chartType"
      :data="result"
      :autosize="true"
      :chart-options="chartOptions"
      :series-options="seriesOptions"
    />
  </div>
  <!-- <div>{{ data }}</div> -->
</template>

<style scoped>
.lw-chart {
  /* height: 100%; */
}
</style>
