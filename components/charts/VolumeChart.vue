<script setup>
import { ref, onMounted, onUnmounted, watch, defineExpose } from "vue";
import { createChart } from "lightweight-charts";
import dataTwo from "~/utils/testdata2.json";

// Function to get the correct series constructor name for current series type.
function getChartSeriesConstructorName(type) {
  return `add${type.charAt(0).toUpperCase() + type.slice(1)}Series`;
}

let series;
let chart;
const chartOptions = {
  layout: {
    textColor: "white",
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
const chartType = "line";
const autosize = true;
const chartContainer = ref();

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

// const mainData = getDataFromJson(dataTwo);
const volumeData = getVolumeDataFromJson(dataTwo);

// Creates the chart series and sets the data.
const addSeriesAndData = () => {
  const seriesConstructor = getChartSeriesConstructorName(chartType);
  series = chart[seriesConstructor]();
  series.setData(getDataFromJson(dataTwo));
};

onMounted(() => {
  // Create the Lightweight Charts Instance using the container ref.
  chart = createChart(chartContainer.value, chartOptions);
  addSeriesAndData();

  //   if (priceScaleOptions) {
  //     chart.priceScale().applyOptions(priceScaleOptions);
  //   }

  //   if (timeScaleOptions) {
  //     chart.timeScale().applyOptions(timeScaleOptions);
  //   }

  const volumeSeries = chart.addHistogramSeries({
    color: "#079a80",
    priceFormat: {
      type: "volume",
    },
    priceScaleId: "", // set as an overlay by setting a blank priceScaleId
    // set the positioning of the volume series
    scaleMargins: {
      top: 0.7, // highest point of the series will be 70% away from the top
      bottom: 0,
    },
  });
  volumeSeries.priceScale().applyOptions({
    scaleMargins: {
      top: 0.7, // highest point of the series will be 70% away from the top
      bottom: 0,
    },
  });

  volumeSeries.setData(volumeData);

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

// watch(
//   () => autosize,
//   (enabled) => {
//     if (!enabled) {
//       window.removeEventListener("resize", resizeHandler);
//       return;
//     }
//     window.addEventListener("resize", resizeHandler);
//   }
// );

// watch(
//   () => chartType,
//   () => {
//     if (series && chart) {
//       chart.removeSeries(series);
//     }
//     addSeriesAndData();
//   }
// );

// watch(
//   () => data,
//   (newData) => {
//     if (!series) return;
//     series.setData(newData);
//   }
// );

// watch(
//   () => chartOptions,
//   (newOptions) => {
//     if (!chart) return;
//     chart.applyOptions(newOptions);
//   }
// );

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
  <div ref="chartContainer" class="lw-chart" />
</template>

<style scoped>
.lw-chart {
  height: 100%;
}
</style>
