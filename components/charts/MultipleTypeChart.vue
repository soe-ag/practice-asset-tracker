<script setup>
import { ref, onMounted, onUnmounted, watch, defineExpose } from "vue";
import { createChart } from "lightweight-charts";
import sampleJsonData from "~/utils/teslaAll.json";

const sampleData = getDataFromJson(sampleJsonData);

const props = defineProps({
  chartType: {
    type: String,
    default: "line",
  },
  apiData: {
    type: Array,
    default: () => [],
  },
  isLive: {
    type: Boolean,
    default: false,
  },
});

// Function to get the correct series constructor name for current series type.
function getChartSeriesConstructorName(type) {
  return `add${type.charAt(0).toUpperCase() + type.slice(1)}Series`;
}

// Lightweight Chart instances are stored as normal JS variables
// If you need to use a ref then it is recommended that you use `shallowRef` instead
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
// const chartType = ref("area");
const autosize = true;

const fitContent = () => {
  if (!chart) return;
  chart.timeScale().fitContent();
};

const getChart = () => {
  return chart;
};

defineExpose({ fitContent, getChart });

// Auto resizes the chart when the browser window is resized.
const resizeHandler = () => {
  if (!chart || !chartContainer.value) return;
  const dimensions = chartContainer.value.getBoundingClientRect();
  chart.resize(dimensions.width, dimensions.height);
};

// Creates the chart series and sets the data.
const addSeriesAndData = () => {
  const seriesConstructor = getChartSeriesConstructorName(props.chartType);
  series = chart[seriesConstructor](seriesOptions);
  series.setData(props.isLive ? props.apiData : sampleData);
};

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

onMounted(() => {
  // Create the Lightweight Charts Instance using the container ref.
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

/*
 * Watch for changes to any of the component properties.

 * If an options property is changed then we will apply those options
 * on top of any existing options previously set (since we are using the
 * `applyOptions` method).
 *
 * If there is a change to the chart type, then the existing series is removed
 * and the new series is created, and assigned the data.
 *
 */
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

// watch(
//   () => data,
//   (newData) => {
//     if (!series) return;
//     series.setData(newData);
//   }
// );

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
    <div ref="chartContainer" class="h-80" />
  </div>
</template>
