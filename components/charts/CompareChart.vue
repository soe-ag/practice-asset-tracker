<script setup>
import { ref, onMounted, onUnmounted, watch, defineExpose } from "vue";
import { createChart } from "lightweight-charts";

const props = defineProps({
  apiData: {
    type: Array,
    default: () => [],
  },
  compareOne: {
    type: Array,
    default: () => [],
  },
  compareTwo: {
    type: Array,
    default: () => [],
  },
});

// Lightweight Chart instances are stored as normal JS variables
// If you need to use a ref then it is recommended that you use `shallowRef` instead
let series;
let chart;
const autosize = true;

const chartContainer = ref();
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

const fitContent = () => {
  if (!chart) return;
  chart.timeScale().fitContent();
};

const getChart = () => {
  return chart;
};

defineExpose({ fitContent, getChart });

const resizeHandler = () => {
  if (!chart || !chartContainer.value) return;
  const dimensions = chartContainer.value.getBoundingClientRect();
  chart.resize(dimensions.width, dimensions.height);
};

let lineSeriesOne;
let lineSeriesTwo;
let lineSeriesThree;

onMounted(async () => {
  while (props.apiData.length === 0) {
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  chart = createChart(chartContainer.value, chartOptions);

  lineSeriesOne = chart.addLineSeries({ color: "#2962ff" });
  lineSeriesTwo = chart.addLineSeries({ color: "#e15759" });
  lineSeriesThree = chart.addLineSeries({ color: "#f28e2c" });

  lineSeriesOne.setData(props.apiData);
  lineSeriesTwo.setData(props.compareOne);
  lineSeriesThree.setData(props.compareTwo);

  //   if (priceScaleOptions) {
  //     chart.priceScale().applyOptions(priceScaleOptions);
  //   }

  //   if (timeScaleOptions) {
  //     chart.timeScale().applyOptions(timeScaleOptions);
  //   }

  chart.timeScale().fitContent();

  if (autosize) {
    window.addEventListener("resize", resizeHandler);
  }
});

onUnmounted(() => {
  if (chart) {
    chart.remove();
    chart = null;
  }
  if (series) {
    series = null;
  }
});

watch(
  () => autosize,
  (enabled) => {
    if (!enabled) {
      window.removeEventListener("resize", resizeHandler);
      return;
    }
    window.addEventListener("resize", resizeHandler);
  }
);

// watch(
//   () => type,
//   () => {
//     if (series && chart) {
//       chart.removeSeries(series);
//     }
//     addSeriesAndData(props.apiData);
//   }
// );

watch(
  () => props.apiData,
  (newData) => {
    if (!lineSeriesOne) return;
    console.log("Compare Chart: mainData updated");
    lineSeriesOne.setData(newData);
  }
);

watch(
  () => props.compareOne,
  (newData) => {
    if (!lineSeriesTwo) return;
    console.log("Compare Chart: compareOne updated");
    lineSeriesTwo.setData(newData);
  }
);

watch(
  () => props.compareTwo,
  (newData) => {
    if (!lineSeriesThree) return;
    console.log("Compare Chart: compareTwo updated");
    lineSeriesThree.setData(newData);
  }
);

watch(
  () => chartOptions,
  (newOptions) => {
    if (!chart) return;
    chart.applyOptions(newOptions);
  }
);

// watch(
//   () => seriesOptions,
//   (newOptions) => {
//     if (!series) return;
//     series.applyOptions(newOptions);
//   }
// );

// watch(
//   () => priceScaleOptions,
//   (newOptions) => {
//     if (!chart) return;
//     chart.priceScale().applyOptions(newOptions);
//   }
// );

// watch(
//   () => timeScaleOptions,
//   (newOptions) => {
//     if (!chart) return;
//     chart.timeScale().applyOptions(newOptions);
//   }
// );
</script>

<template>
  <!-- {{ props.apiData[498] ? props.apiData[498].value : "no api data" }}
  {{
    props.compareOne[498] ? props.compareOne[498].value : "no compareOne data"
  }}
  {{
    props.compareTwo[498] ? props.compareTwo[498].value : "no compareTwo data"
  }} -->
  <div ref="chartContainer" class="h-80" />
</template>
