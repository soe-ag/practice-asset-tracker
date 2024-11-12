<script setup lang="ts">
import CompareChart from "~/components/charts/CompareChart.vue";
import LineChart from "~/components/charts/LineChart.vue";
import MultipleTypeChart from "~/components/charts/MultipleTypeChart.vue";
import VolumeChart from "~/components/charts/VolumeChart.vue";
import type { RawStockData, RefinedData } from "~/utils/type";
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
const compareStockOne = ref<DropDownType | null>(null);
const compareStockTwo = ref<DropDownType | null>(null);

const config = useRuntimeConfig();
// const rawData = ref<RawStockData>();
const finalData = ref<RefinedData[]>([]);
const finalDataWithVolume = ref<RefinedData[]>([]);
const isLiveData = ref(true);

const compareDataOne = ref<RefinedData[]>([]);
const compareDataTwo = ref<RefinedData[]>([]);

const fetchStockData = async (
  symbol: string
): Promise<RawStockData | undefined> => {
  // const symbol = "TSLA";
  const apiKey = config.public.stockApiKey;
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=full&apikey=${apiKey}`;

  try {
    const response = await $fetch<RawStockData>(url);
    console.log("Fetched raw data:", response);
    return response; // if (!response) {
    //   throw new Error(`API error ...`);
    // }

    // change function name later
    // finalData.value = getDataFromJson(response ? response : sampleJsonData);

    // finalDataWithVolume.value = getVolumeDataFromJson(
    //   response ? response : sampleJsonData
    // );
    // console.log("api return data is ", finalData.value);
  } catch (error) {
    console.error("Error fetching stock data:", error);
    return undefined;
  }
};

onMounted(async () => {
  const rawData = await fetchStockData("TSLA");

  if (rawData && rawData["Time Series (Daily)"]) {
    finalData.value = getDataFromJson(rawData);
    finalDataWithVolume.value = getVolumeDataFromJson(rawData);
  }
});

watch(selectedStock, async () => {
  if (selectedStock.value === null) return;
  const response = await fetchStockData(selectedStock.value.code);
  if (response && response["Time Series (Daily)"]) {
    finalData.value = getDataFromJson(response);
    finalDataWithVolume.value = getVolumeDataFromJson(response);
  }
});

watch(compareStockOne, async () => {
  if (compareStockOne.value === null) return;
  const response = await fetchStockData(compareStockOne.value.code);
  if (response && response["Time Series (Daily)"]) {
    compareDataOne.value = getDataFromJson(response);
  }
});

watch(compareStockTwo, async () => {
  if (compareStockTwo.value === null) return;
  const response = await fetchStockData(compareStockTwo.value.code);
  if (response && response["Time Series (Daily)"]) {
    compareDataTwo.value = getDataFromJson(response);
  }
});
</script>

<template>
  <div class="bg-#000">
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
          {{ isLiveData ? "Live Data" : "Sample Data (Tesla)" }}
        </div>
        {{ finalData[498] }}

        <LineChart
          :quote="selectedStock?.name"
          :api-data="finalData"
          :is-live="isLiveData"
        />
      </div>

      <div class="b-2 b-solid rounded-2 b-gray-800 p-4">
        <h4 class="mb-2">Series Comparison Chart</h4>
        <div class="text-xs text-gray-500">
          {{ isLiveData ? "Live Data" : "Sample Data (Tesla, Apple, Google)" }}
        </div>

        <CompareChart
          class="h-70"
          :is-live="isLiveData"
          :api-data="finalData"
          :compare-one="compareDataOne"
          :compare-two="compareDataTwo"
        />
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
          {{ isLiveData ? "Live Data" : "Sample Data (Tesla)" }}
        </div>
        <!-- <p>{{ chartType }}</p> -->
        {{ finalData[498] }}

        <MultipleTypeChart
          :api-data="finalData"
          :chart-type="chartType"
          :is-live="isLiveData"
        />
      </div>

      <div class="b-2 b-solid rounded-2 b-gray-800 p-4">
        <h4 class="mb-2">Volume Chart</h4>
        <div class="text-xs text-gray-500">
          {{ isLiveData ? "Live Data" : "Sample Data (Tesla)" }}
        </div>
        {{ finalData[498] }}
        <VolumeChart
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
      {{ selectedStock?.code }}, is live data: {{ isLiveData }} / TradingView
      Lightweight Charts™ Copyright (с) 2024 TradingView, Inc.
      https://www.tradingview.com/
    </footer>
  </div>
</template>
