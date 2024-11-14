<script setup>
import { ref, onMounted, onUnmounted, watch, defineExpose } from "vue";
import { createChart } from "lightweight-charts";

const props = defineProps({
  chartType: {
    type: String,
    default: "line",
  },
  apiData: {
    type: Array,
    default: () => [],
  },
});

function getChartSeriesConstructorName(type) {
  return `add${type.charAt(0).toUpperCase() + type.slice(1)}Series`;
}

let series;
let chart;

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
const seriesOptions = ref({
  color: "rgb(45, 77, 205)",
});
const autosize = true;

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

// Creates the chart series and sets the data.
const addSeriesAndData = () => {
  const seriesConstructor = getChartSeriesConstructorName(props.chartType);
  series = chart[seriesConstructor](seriesOptions);
  series.setData(props.apiData);
};

// todo: baseLine
// const baseLineOptions = {
//   baseValue: { type: "price", price: 220 },
//   topLineColor: "rgba( 38, 166, 154, 1)",
//   topFillColor1: "rgba( 38, 166, 154, 0.28)",
//   topFillColor2: "rgba( 38, 166, 154, 0.05)",
//   bottomLineColor: "rgba( 239, 83, 80, 1)",
//   bottomFillColor1: "rgba( 239, 83, 80, 0.05)",
//   bottomFillColor2: "rgba( 239, 83, 80, 0.28)",
// };

// let baselineSeries;

onMounted(async () => {
  while (props.apiData.length === 0) {
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  chart = createChart(chartContainer.value, chartOptions);
  addSeriesAndData();

  // if (priceScaleOptions) {
  //   chart.priceScale().applyOptions(priceScaleOptions);
  // }

  // if (timeScaleOptions) {
  //   chart.timeScale().applyOptions(timeScaleOptions);
  // }

  // const baselineSeries = chart.addBaselineSeries(baseLineOptions);
  // baselineSeries.setData(jsonData);
  // if (props.chartType !== "baseline") chart.removeSeries(baselineSeries);

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
  // if (baselineSeries) {
  //   baselineSeries = null;
  // }
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

watch(
  () => props.chartType,
  () => {
    if (series && chart) {
      chart.removeSeries(series);
      // if (newType !== "baseline") chart.removeSeries(baselineSeries);
    }

    addSeriesAndData();
    // if (newType === "baseline") {
    //   const baselineSeries = chart.addBaselineSeries(baseLineOptions);
    //   baselineSeries.setData(jsonData);
    // }
  }
);

watch(
  () => props.apiData,
  (newData) => {
    if (!series) return;
    console.log("Type Chart: data updated");
    series.setData(newData);
  }
);

watch(
  () => chartOptions,
  (newOptions) => {
    if (!chart) return;
    chart.applyOptions(newOptions);
  }
);

watch(
  () => seriesOptions,
  (newOptions) => {
    if (!series) return;
    series.applyOptions(newOptions);
  }
);

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
  <div>
    <!-- {{ props.isLive }},
    {{ props.apiData[498] ? props.apiData[498].value : "no api data" }} -->
    <div ref="chartContainer" class="h-80" />
  </div>
</template>
