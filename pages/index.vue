<script setup lang="ts">
import CompareChart from "~/components/charts/CompareChart.vue";
import LineChart from "~/components/charts/LineChart.vue";
import MultipleTypeChart from "~/components/charts/MultipleTypeChart.vue";
import VolumeChart from "~/components/charts/VolumeChart.vue";
import type { RefinedData } from "~/utils/type";
import sampleJsonData from "~/utils/teslaAll.json";

const chartType = ref("area");

const handleChangeChartType = (type: string) => {
  chartType.value = type;
};

const stockList = ref([
  { name: "Tesla", code: "TSLA" },
  { name: "Google", code: "GOOG" },
  { name: "Apple", code: "AAPL" },
  { name: "Amazon", code: "AMZN" },
  { name: "Microsoft", code: "MSFT" },
  { name: "Nvidia", code: "NVDA" },
  { name: "AMD", code: "AMD" },
  { name: "Meta", code: "META" },
]);

const selectedStock = ref<DropDownType | null>(stockList.value[0]);

const config = useRuntimeConfig();
const rawData = ref<RawStockData>();
const finalData = ref<RefinedData[]>([]);
const finalDataWithVolume = ref<RefinedData[]>([]);
const isLiveData = ref(false);

const fetchStockData = async (symbol: string) => {
  // const symbol = "TSLA";
  const apiKey = config.public.stockApiKey;
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=full&apikey=${apiKey}`;

  try {
    rawData.value = await $fetch(url);

    // change function name later
    finalData.value = getDataFromJson(
      rawData.value ? rawData.value : sampleJsonData
    );

    finalDataWithVolume.value = getVolumeDataFromJson(
      rawData.value ? rawData.value : sampleJsonData
    );
    console.log("api return data is ", finalData.value);
  } catch (error) {
    console.error("Error fetching stock data:", error);
  }
};

// onMounted(() => {
//   fetchStockData("TSLA");
// });

// watch(selectedStock, () => {
//   if (selectedStock.value === null) return;
//   fetchStockData(selectedStock.value.code);
// });
</script>

<template>
  <div class="bg-#000">
    {{ selectedStock?.code }}, is live data: {{ isLiveData }}
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-2 p-6 text-gray-400">
      <div class="b-2 b-solid rounded-2 b-gray-800 p-4">
        <div class="flex gap-2 items-center">
          <h4 class="">Line Chart with MA-50</h4>
          <Select
            v-model="selectedStock"
            :options="stockList"
            option-label="name"
            placeholder="Select a Stock"
            size="small"
            show-clear
            class="w-37 text-xs"
            :pt="{
              optionLabel: { class: 'text-xs font-sans	' },
            }"
          />
        </div>
        <div class="text-xs text-gray-500">
          {{ !isLiveData && "Sample Tesla Data" }}
        </div>

        <LineChart
          class="h-70 relative"
          :quote="selectedStock?.name"
          :api-data="finalData"
          :is-live="isLiveData"
        />
      </div>

      <div class="b-2 b-solid rounded-2 b-gray-800 p-4">
        <h4 class="mb-2">Series Comparison Chart</h4>
        <div class="text-xs text-gray-500">
          {{ !isLiveData && "Sample Tesla Data" }}
        </div>

        <CompareChart class="h-70" :is-live="isLiveData" />
      </div>
      <div class="b-2 b-solid rounded-2 b-gray-800 p-4">
        <div class="flex gap-2 items-center mb-2">
          <h4 class="mr-4">Multiple Type Chart</h4>

          <div
            class="flex justify-center items-center gap-1 h-8 b-2 b-solid b-gray-800 rounded-2"
          >
            <button
              class="text-gray-400 b-none w-auto px-2 text-center hover:cursor-pointer hover:bg-gray-700 hover:rounded-1.5 hover:h-100%"
              :class="{
                'bg-gray-700 rounded-1.5 font-medium h-100% text-white':
                  chartType === 'line',
              }"
              @click="() => handleChangeChartType('line')"
            >
              <p>Line</p>
            </button>
            <button
              class="text-gray-400 b-none w-auto px-2 text-center hover:cursor-pointer hover:bg-gray-700 hover:rounded-1.5 hover:h-100%"
              :class="{
                'bg-gray-700 rounded-1.5 font-medium h-100% text-white':
                  chartType === 'area',
              }"
              @click="() => handleChangeChartType('area')"
            >
              <p>Area</p>
            </button>
            <button
              class="text-gray-400 b-none w-auto px-2 text-center hover:cursor-pointer hover:bg-gray-700 hover:rounded-1.5 hover:h-100%"
              :class="{
                'bg-gray-700 rounded-1.5 font-medium h-100% text-white':
                  chartType === 'histogram',
              }"
              @click="() => handleChangeChartType('histogram')"
            >
              <p>Histogram</p>
            </button>
          </div>
        </div>
        <div class="text-xs text-gray-500">
          {{ !isLiveData && "Sample Tesla Data" }}
        </div>
        <!-- <p>{{ chartType }}</p> -->
        <MultipleTypeChart
          class="h-70"
          :chart-type="chartType"
          :is-live="isLiveData"
        />
      </div>

      <div class="b-2 b-solid rounded-2 b-gray-800 p-4">
        <h4 class="mb-2">Volume Chart</h4>
        <div class="text-xs text-gray-500">
          {{ !isLiveData && "Sample Tesla Data" }}
        </div>
        <VolumeChart
          class="h-70"
          :api-data="finalData"
          :api-volume-data="finalDataWithVolume"
          :is-live="isLiveData"
        />
      </div>
    </div>
    <div class="my-1">
      <WidgetOne />
    </div>

    <footer class="text-xs text-end my-2 text-gray-400">
      TradingView Lightweight Charts™ Copyright (с) 2024 TradingView, Inc.
      https://www.tradingview.com/
    </footer>
  </div>
</template>
