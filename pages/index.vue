<script setup lang="ts">
import type { ChartOptions } from "chart.js";
// import { convertToSimpleType } from "~/utils/utils";
import { useRuntimeConfig } from "#app";
import testdata1 from "~/utils/testdata1.json";
import testdata2 from "~/utils/testdata2.json";

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
const dataA = ref<
  {
    date: string;
    close: number;
  }[]
>();
const dataB = ref<
  {
    date: string;
    close: number;
  }[]
>();
// const fetchStockData = async (symbol: string) => {
//   // const symbol = "TSLA";
//   const apiKey = config.public.stockApiKey;
//   const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`;

//   try {
//     firstRawData.value = await $fetch(url);

//     // Get the entries of the Time Series and map to include the date and close price
//     dataA.value = Object.entries(
//       firstRawData.value["Time Series (Daily)"] as Record<string, DailyData>
//     )
//       .map(([date, day]) => ({
//         date, // The date of the stock data
//         close: Math.round(Number(day["4. close"])), // Rounded close price
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
  dataA.value = Object.entries(testdata1["Time Series (Daily)"])
    .map(([date, day]) => ({
      date, // The date of the stock data
      close: Math.round(Number(day["4. close"])), // Rounded close price
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  dataB.value = Object.entries(testdata2["Time Series (Daily)"])
    .map(([date, day]) => ({
      date, // The date of the stock data
      close: Math.round(Number(day["4. close"])), // Rounded close price
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

onMounted(() => {
  fetchStockData();
  sampleFetch("TSLA");
});

const chartData2 = computed(() => {
  const labels: string[] = dataA.value
    ? dataA.value.map((item) => item.date)
    : [];
  const chartDataA: number[] = dataA.value
    ? dataA.value.map((item) => item.close)
    : [];

  const chartDataB: number[] = dataB.value
    ? dataB.value.map((item) => item.close)
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
        borderColor: "#cf352e",
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
        borderColor: "#417ABE",
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
  <div class="py-2 mx-4 h-100vh bg-gray-300 w-100vw">
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
