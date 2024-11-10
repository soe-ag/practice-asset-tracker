<script setup>
import { ref, onMounted, onUnmounted, watch, defineExpose } from "vue";
import { createChart } from "lightweight-charts";
import dataOne from "~/utils/testdata1.json";
import dataTwo from "~/utils/testdata2.json";
import dataThree from "~/utils/testdata3.json";

// // Function to get the correct series constructor name for current series type.
// function getChartSeriesConstructorName(type) {
//   return `add${type.charAt(0).toUpperCase() + type.slice(1)}Series`;
// }

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

// Auto resizes the chart when the browser window is resized.
const resizeHandler = () => {
  if (!chart || !chartContainer.value) return;
  const dimensions = chartContainer.value.getBoundingClientRect();
  chart.resize(dimensions.width, dimensions.height);
};

// Creates the chart series and sets the data.
// const addSeriesAndData = (props) => {
//   const seriesConstructor = getChartSeriesConstructorName("line");
//   series = chart[seriesConstructor](props.seriesOptions);
//   series.setData(props.data);
// };

onMounted(() => {
  // Create the Lightweight Charts Instance using the container ref.
  chart = createChart(chartContainer.value, chartOptions);

  const lineSeriesOne = chart.addLineSeries({ color: "#2962FF" });
  const lineSeriesTwo = chart.addLineSeries({ color: "rgb(225, 87, 90)" });
  const lineSeriesThree = chart.addLineSeries({ color: "rgb(242, 142, 44)" });

  const lineSeriesOneData = getDataFromJson(dataOne);
  const lineSeriesTwoData = getDataFromJson(dataTwo);
  const lineSeriesThreeData = getDataFromJson(dataThree);

  lineSeriesOne.setData(lineSeriesOneData);
  lineSeriesTwo.setData(lineSeriesTwoData);
  lineSeriesThree.setData(lineSeriesThreeData);

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

// watch(
//   () => type,
//   () => {
//     if (series && chart) {
//       chart.removeSeries(series);
//     }
//     addSeriesAndData(props);
//   }
// );

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
  <div ref="chartContainer" class="h-80" />
</template>
