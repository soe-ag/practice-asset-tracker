<script setup lang="ts">
import CompareChart from "~/components/charts/CompareChart.vue";
import LineChart from "~/components/charts/LineChart.vue";
import MultipleTypeChart from "~/components/charts/MultipleTypeChart.vue";
import VolumeChart from "~/components/charts/VolumeChart.vue";
import type { RawStockData, RefinedData } from "~/utils/type";
import sampleTeslaJsonData from "~/utils/teslaAll.json";
import sampleAppleJsonData from "~/utils/appleAll.json";
import sampleGoogleJsonData from "~/utils/googleAll.json";

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
  // { name: "Nvidia", code: "NVDA" }, stock split not ok
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
const isLiveData = ref(false); // set to false in dev

const compareDataOne = ref<RefinedData[]>([]);
const compareDataTwo = ref<RefinedData[]>([]);

const fetchStockData = async (
  symbol: string
): Promise<RawStockData | undefined> => {
  // const symbol = "TSLA";
  const apiKey = config.public.stockApiKey;
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=full&apikey=${apiKey}`;

  if (isLiveData.value === false) {
    return undefined;
  }
  try {
    const response = await $fetch<RawStockData>(url);
    console.log("Fetched from api ...");
    return response;
  } catch (error) {
    console.error("Error fetching stock data:", error);
    return undefined;
  }
};

onMounted(async () => {
  // const rawData = await fetchStockData("TSLA");
  // const rawData = {}; // set for reducing api call on first rendered

  // if (rawData && rawData["Time Series (Daily)"]) {
  //   finalData.value = getDataFromJson(rawData);
  //   finalDataWithVolume.value = getVolumeDataFromJson(rawData);
  // } else {
  console.log("showing sample data");
  finalData.value = getDataFromJson(sampleTeslaJsonData);
  finalDataWithVolume.value = getVolumeDataFromJson(sampleTeslaJsonData);
  // }

  compareDataOne.value = getDataFromJson(sampleAppleJsonData);
  compareDataTwo.value = getDataFromJson(sampleGoogleJsonData);
});

watch(selectedStock, async () => {
  if (selectedStock.value === null) return;
  const response = await fetchStockData(selectedStock.value.code);
  if (response && response["Time Series (Daily)"]) {
    finalData.value = getDataFromJson(response);
    finalDataWithVolume.value = getVolumeDataFromJson(response);
  } else {
    finalData.value = getDataFromJson(sampleTeslaJsonData);
    finalDataWithVolume.value = getVolumeDataFromJson(sampleTeslaJsonData);
  }
});

watch(compareStockOne, async () => {
  if (compareStockOne.value === null) return;
  const response = await fetchStockData(compareStockOne.value.code);
  if (response && response["Time Series (Daily)"]) {
    compareDataOne.value = getDataFromJson(response);
  } else {
    compareDataOne.value = getDataFromJson(sampleAppleJsonData);
  }
});

watch(compareStockTwo, async () => {
  if (compareStockTwo.value === null) return;
  const response = await fetchStockData(compareStockTwo.value.code);
  if (response && response["Time Series (Daily)"]) {
    compareDataTwo.value = getDataFromJson(response);
  } else {
    compareDataTwo.value = getDataFromJson(sampleGoogleJsonData);
  }
});
</script>

<template>
  <div class="bg-#000">
    <div
      class="grid grid-cols-1 lg:grid-cols-2 gap-2 px-4 pt-4 pb-2 text-gray-400"
    >
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
            :disabled="!isLiveData"
          />
        </div>
        <div class="text-xs text-gray-500">
          <div class="flex gap-1 items-center">
            <Checkbox v-model="isLiveData" binary size="small" />
            <p>
              {{
                isLiveData
                  ? "Live Data"
                  : selectedStock?.code === "TSLA"
                  ? "Sample Data: Tesla"
                  : selectedStock?.name
              }}
            </p>
            <p v-if="isLiveData" class="text-red-4 opacity-60 text-2.5">
              (Once you reach 25 API requests in a day, sample data will be
              displayed instead)
            </p>
          </div>
        </div>
        <!-- {{ finalData[498] }} -->

        <LineChart
          :quote="selectedStock?.name"
          :api-data="finalData"
          :is-live="isLiveData"
        />
      </div>

      <div class="b-2 b-solid rounded-2 b-gray-800 p-4">
        <h4 class="mb-2">Series Comparison Chart</h4>
        <div class="flex gap-2 items-center">
          <div class="text-xs text-gray-500">
            {{
              isLiveData
                ? "Live Data"
                : selectedStock?.code === "TSLA"
                ? "Sample Data"
                : ""
            }}
          </div>
          <PartsComparisonLegend
            :label1="selectedStock?.name"
            :label2="compareStockOne?.name"
            :label3="compareStockTwo?.name"
          />
        </div>

        <CompareChart
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
          {{
            isLiveData
              ? "Live Data"
              : selectedStock?.code === "TSLA"
              ? "Sample Data: Tesla"
              : selectedStock?.name
          }}
        </div>
        <!-- <p>{{ chartType }}</p> -->
        <!-- {{ finalData[498] }} -->

        <MultipleTypeChart
          :api-data="finalData"
          :chart-type="chartType"
          :is-live="isLiveData"
        />
      </div>

      <div class="b-2 b-solid rounded-2 b-gray-800 p-4">
        <h4 class="mb-2">Volume Chart</h4>
        <div class="text-xs text-gray-500">
          {{
            isLiveData
              ? "Live Data"
              : selectedStock?.code === "TSLA"
              ? "Sample Data: Tesla"
              : selectedStock?.name
          }}
        </div>
        <!-- {{ finalData[498] }} -->
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

    <footer class="text-xs text-end my-1 text-gray-400">
      <!-- {{ selectedStock?.code }}, is live data: {{ isLiveData }} / TradingView -->
      Lightweight Charts™ Copyright (с) 2024 TradingView, Inc.
      https://www.tradingview.com/
    </footer>
  </div>
</template>
