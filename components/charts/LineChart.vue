<script setup>
import { ref, onMounted, onUnmounted, watch, defineExpose } from "vue";
import { createChart } from "lightweight-charts";

const props = defineProps({
  quote: {
    type: String,
    default: "Quote",
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
let maSeries;
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
  crosshair: {
    horzLine: {
      visible: false,
      labelVisible: false,
    },
    vertLine: {
      labelVisible: false,
    },
  },
  rightPriceScale: {
    scaleMargins: {
      top: 0.3, // leave some space for the legend
      bottom: 0.25,
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
  series.priceScale().applyOptions({
    scaleMargins: {
      top: 0.3, // leave some space for the legend
      bottom: 0.25,
    },
  });
};

function calculateMovingAverageSeriesData(candleData, maLength) {
  const maData = [];

  for (let i = 0; i < candleData.length; i++) {
    if (i < maLength) {
      // Provide whitespace data points until the MA can be calculated
      maData.push({ time: candleData[i].time });
    } else {
      let sum = 0;
      for (let j = 0; j < maLength; j++) {
        sum += candleData[i - j].value;
      }
      const maValue = sum / maLength;
      maData.push({ time: candleData[i].time, value: maValue });
    }
  }

  return maData;
}

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
  const toolTipWidth = 80;
  const toolTipHeight = 80;
  const toolTipMargin = 15;

  // Create and style the tooltip html element
  const toolTip = document.createElement("div");
  toolTip.style = `width: 75px; height: 75px; position: absolute; display: none; padding: 6px; box-sizing: border-box; font-size: 10px; text-align: left; z-index: 1000; top: 12px; left: 12px; pointer-events: none; border: 1px solid; border-radius: 2px;font-family: -apple-system, BlinkMacSystemFont, 'Trebuchet MS', Roboto, Ubuntu, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;`;
  toolTip.style.background = "black";
  toolTip.style.color = "white";
  toolTip.style.borderColor = "#2962FF";
  chartContainer.value.appendChild(toolTip); // Use chartContainer here

  // update tooltip
  chart.subscribeCrosshairMove((param) => {
    if (
      param.point === undefined ||
      !param.time ||
      param.point.x < 0 ||
      param.point.x > chartContainer.value.clientWidth ||
      param.point.y < 0 ||
      param.point.y > chartContainer.value.clientHeight
    ) {
      toolTip.style.display = "none";
    } else {
      const dateStr = param.time;
      toolTip.style.display = "block";
      const data = param.seriesData.get(series);
      const price = data.value;
      // const price = data.value !== undefined ? data.value : data.close;
      toolTip.innerHTML = `<div style="color: ${"rgba( 38, 166, 154, 1)"}">${
        props.quote
      } Inc.</div><div style="font-size: 24px; margin: 4px 0px; color: ${"white"}">
            ${Math.round(100 * price) / 100}
            </div><div style="color: ${"white"}">
            ${dateStr}
            </div>`;

      const y = param.point.y;
      let left = param.point.x + toolTipMargin;
      if (left > chartContainer.value.clientWidth - toolTipWidth) {
        left = param.point.x - toolTipMargin - toolTipWidth;
      }

      let top = y + toolTipMargin;
      if (top > chartContainer.value.clientHeight - toolTipHeight) {
        top = y - toolTipHeight - toolTipMargin;
      }
      toolTip.style.left = left + "px";
      toolTip.style.top = top + "px";
    }
  });

  const maData = calculateMovingAverageSeriesData(props.apiData, 50);

  maSeries = chart.addLineSeries({
    color: "rgb(225, 87, 90)",
    lineWidth: 1,
  });
  maSeries.setData(maData);

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
    console.log("Line Chart: data updated", newData[0].value);
    series.setData(newData);

    const newMaData = calculateMovingAverageSeriesData(newData, 50);
    if (!maSeries) return;
    console.log("MA also updated");
    maSeries.setData(newMaData);
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
  <div>
    <!-- {{ props.isLive }},
    {{ props.apiData[495] ? props.apiData[498].value : "no api data" }} -->
    <div ref="chartContainer" class="h-80" />
  </div>
</template>
