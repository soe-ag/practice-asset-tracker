<script setup lang="ts">
import type { ChartOptions } from "chart.js";
// import { convertToSimpleType } from "~/utils/utils";
import { useRuntimeConfig } from "#app";
import testdata1 from "~/utils/testdata1.json";
import testdata2 from "~/utils/testdata2.json";
import testdata3 from "~/utils/testdata3.json";
import type { StockData } from "~/utils/type";

const config = useRuntimeConfig();
// const client = useSupabaseClient();

// const { data } = await useAsyncData<RawAsset[]>(
//   "fetchAsset",
//   async () => {
//     const { data } = await client.from("assetList").select();
//     return data as RawAsset[];
//   }
//   // { watch: [() => popularCurrentPage.value, () => isShowSearchResult] } // re-fetch
// );

// const assetList = computed<Asset[]>(() => {
//   if (data.value) {
//     return data.value.map((item) => convertToSimpleType(item));
//   } else return [];
// });

// const firstRawData = ref();
const dataA = ref<StockData[]>();
const dataB = ref<StockData[]>();
const dataC = ref<StockData[]>();

const stockA = ref<DropDownType | null>();
const stockB = ref<DropDownType | null>();
const stockC = ref<DropDownType | null>();
const stockList = ref([
  { name: "Tesla", code: "TSLA" },
  { name: "IBM", code: "IBM" },
  { name: "Google", code: "GOOG" },
]);

// const fetchStockData = async (symbol: string) => {
//   // const symbol = "TSLA";
//   const apiKey = config.public.stockApiKey;
//   const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`;

//   try {
//     firstRawData.value = await $fetch(url);

//     // Get the entries of the Time Series and map to include the date and price price
//     dataA.value = Object.entries(
//       firstRawData.value["Time Series (Daily)"] as Record<string, DailyData>
//     )
//       .map(([date, day]) => ({
//         date, // The date of the stock data
//         price: Math.round(Number(day["4. price"])), // Rounded price price
//       }))
//       .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
//     console.log(dataA.value.slice(0, 10)); // This should log an array of numbers
//   } catch (error) {
//     console.error("Error fetching stock data:", error);
//   }
// };

const sampleFetch = async (symbol: string) => {
  const apiKey = config.public.stockApiKey2;
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`;

  const data = await $fetch(url);

  console.log(data);
};

const fetchStockData = () => {
  dataA.value = getDataFromJson(testdata1);
  dataB.value = getDataFromJson(testdata2);
  dataC.value = getDataFromJson(testdata3);
};

onMounted(() => {
  // fetchStockData();
  // sampleFetch("GOOG");
});

watch(
  () => stockA.value,
  (newValue) => {
    if (newValue) {
      switch (newValue.code) {
        case "IBM":
          dataA.value = getDataFromJson(testdata1);
          break;
        case "TSLA":
          dataA.value = getDataFromJson(testdata2);
          break;
        case "GOOG":
          dataA.value = getDataFromJson(testdata3);
          break;
      }
    }
  }
);

watch(
  () => stockB.value,
  (newValue) => {
    if (newValue) {
      switch (newValue.code) {
        case "IBM":
          dataB.value = getDataFromJson(testdata1);
          break;
        case "TSLA":
          dataB.value = getDataFromJson(testdata2);
          break;
        case "GOOG":
          dataB.value = getDataFromJson(testdata3);
          break;
      }
    }
  }
);

watch(
  () => stockC.value,
  (newValue) => {
    if (newValue) {
      switch (newValue.code) {
        case "IBM":
          dataC.value = getDataFromJson(testdata1);
          break;
        case "TSLA":
          dataC.value = getDataFromJson(testdata2);
          break;
        case "GOOG":
          dataC.value = getDataFromJson(testdata3);
          break;
      }
    }
  }
);

// watch(
//   [() => stockA.value, () => stockB.value, () => stockC.value],
//   ([newA, newb, newC]) => {
//     stockList.value = stockList.value.filter(
//       (item) =>
//         item.code !== newA.code &&
//         item.code !== newb.code &&
//         item.code !== newC.code
//     );
//   }
// );

const chartData2 = computed(() => {
  const labels: string[] = dataA.value
    ? dataA.value.map((item) => item.date)
    : [];
  const chartDataA: number[] = stockA.value
    ? dataA.value
      ? dataA.value.map((item) => item.price)
      : []
    : [];

  const chartDataB: number[] = stockB.value
    ? dataB.value
      ? dataB.value.map((item) => item.price)
      : []
    : [];

  const chartDataC: number[] = stockC.value
    ? dataC.value
      ? dataC.value.map((item) => item.price)
      : []
    : [];

  return {
    labels,
    datasets: [
      {
        label: "IBM",
        data: chartDataA,
        // backgroundColor: ["#417ABE", "#00B8CD", "#009DFF", "#78D7FF"],
        fill: false,
        backgroundColor: "#FFFFFF ",
        borderWidth: 1,
        borderColor: "#417ABE",
        // backgroundColor: "#cf352e",
        tension: 0.3,
        // radius: 1,
        pointStyle: false,
      },
      {
        label: "TSLA",
        data: chartDataB,
        // backgroundColor: ["#417ABE", "#00B8CD", "#009DFF", "#78D7FF"],
        fill: false,
        backgroundColor: "#FFFFFF ",
        borderWidth: 1,
        borderColor: "#cf352e",
        // backgroundColor: "#cf352e",
        tension: 0.3,
        // radius: 1,
        pointStyle: false,
      },
      {
        label: "GOOG",
        data: chartDataC,
        // backgroundColor: ["#417ABE", "#00B8CD", "#009DFF", "#78D7FF"],
        fill: false,
        backgroundColor: "#FFFFFF ",
        borderWidth: 1,
        borderColor: "#00B8CD",
        // backgroundColor: "#cf352e",
        tension: 0.3,
        // radius: 1,
        pointStyle: false,
      },
    ],
  };
});

const chartOption2: ChartOptions = {
  plugins: {
    legend: {
      position: "right",
    },
    title: {
      display: true,
      text: "Chart.js Line Chart",
    },
  },
};

// const handleEnter = async (event: KeyboardEvent) => {
//   if (event.key === "Enter") {
//     await fetchSearchResults(1);
//   }
// };
</script>

<template>
  <div class="py-2 h-100vh bg-gray-300 w-90vw m-auto">
    <div class="text-black text-sm w-100 m-2">
      <!--  eslint-disable-next-line vue/html-self-closing -->
      Stock A is {{ stockA }} <br />Stock B is {{ stockB }} <br />Stock C is{{
        stockC
      }}
      <!-- <pre> stockList is {{ stockList }}</pre> -->
    </div>
    <div class="gap-2 flex justify-center my-6 w-50vw m-auto">
      <Select
        v-model="stockA"
        :options="stockList"
        option-label="name"
        placeholder="Select a Stock"
        checkmark
        size="small"
        show-clear
        class="w-38 text-xs"
        :pt="{
          optionLabel: { class: 'text-xs font-sans	' },
        }"
      />

      <Select
        v-model="stockB"
        :options="stockList"
        option-label="name"
        placeholder="Select a Stock"
        checkmark
        size="small"
        show-clear
        class="w-38 text-xs"
        :pt="{ optionLabel: { class: 'text-xs font-sans	' } }"
      />

      <Select
        v-model="stockC"
        :options="stockList"
        option-label="name"
        placeholder="Select a Stock"
        checkmark
        size="small"
        show-clear
        class="w-38 text-xs"
        :pt="{ optionLabel: { class: 'text-xs font-sans	' } }"
      />
    </div>
    <!-- <pre>{{ dataA }}</pre> -->

    <PartsChart
      type="line"
      :data="chartData2"
      :options="chartOption2"
      class="w-200 m-auto h-100 border-2 border-amber"
    />

    <!-- <div class="flex gap-4 my-2">
      <Button
        label="Trending"
        icon="i-material-symbols-kid-star-sharp"
        class=""
        :pt="{ label: { class: 'max-md:text-xs' } }"
        @click="
          () => {
            searchQuery = '';
            refresh();
          }
        "
      />

      <InputText
        v-model="searchQuery"
        type="text"
        variant="filled"
        placeholder="Search for a movie"
        size="small"
        @keydown="handleEnter"
      />
    </div> -->
  </div>
</template>
