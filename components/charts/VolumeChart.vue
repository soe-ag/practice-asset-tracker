<script setup>
import { ref, onMounted, onUnmounted, defineExpose } from "vue";
import { createChart } from "lightweight-charts";

const props = defineProps({
  apiData: {
    type: Array,
    default: () => [],
  },
  apiVolumeData: {
    type: Array,
    default: () => [],
  },
});

function getChartSeriesConstructorName(type) {
  return `add${type.charAt(0).toUpperCase() + type.slice(1)}Series`;
}

let series;
let volumeSeries;
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

const resizeHandler = () => {
  if (!chart || !chartContainer.value) return;
  const dimensions = chartContainer.value.getBoundingClientRect();
  chart.resize(dimensions.width, dimensions.height);
};

const addSeriesAndData = () => {
  const seriesConstructor = getChartSeriesConstructorName(chartType);
  series = chart[seriesConstructor]();
  series.setData(props.apiData);
};

onMounted(async () => {
  while (props.apiData.length === 0) {
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  chart = createChart(chartContainer.value, chartOptions);
  addSeriesAndData();

  //   if (priceScaleOptions) {
  //     chart.priceScale().applyOptions(priceScaleOptions);
  //   }

  //   if (timeScaleOptions) {
  //     chart.timeScale().applyOptions(timeScaleOptions);
  //   }

  volumeSeries = chart.addHistogramSeries({
    color: "#079a80",
    priceFormat: {
      type: "volume",
    },
    priceScaleId: "",
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

  volumeSeries.setData(props.apiVolumeData);

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
//   () => chartType,
//   () => {
//     if (series && chart) {
//       chart.removeSeries(series);
//     }
//     addSeriesAndData();
//   }
// );

watch(
  () => props.apiData,
  (newData) => {
    if (!series) return;
    console.log("Volume Chart: data updated");
    series.setData(newData);
  }
);

watch(
  () => props.apiVolumeData,
  (newData) => {
    if (!volumeSeries) return;
    console.log("Volume Chart: volume also updated");
    console.log("------end------");
    volumeSeries.setData(newData);
  }
);

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
  <!-- {{ props.isLive }}, length: {{ props.apiData.length }},
  {{ props.apiData[495] ? props.apiData[498].value : "no api data" }} -->
  <div ref="chartContainer" class="h-80" />
</template>
