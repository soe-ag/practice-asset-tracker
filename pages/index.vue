<script setup lang="ts">
import type { ChartOptions } from "chart.js";
import { convertToSimpleType } from "~/utils/utils";
import { useRuntimeConfig } from "#app";

const config = useRuntimeConfig();
const client = useSupabaseClient();

const { data } = await useAsyncData<RawAsset[]>(
  "fetchAsset",
  async () => {
    const { data } = await client.from("assetList").select();
    return data as RawAsset[];
  }
  // { watch: [() => popularCurrentPage.value, () => isShowSearchResult] } // re-fetch
);

const assetList = computed<Asset[]>(() => {
  if (data.value) {
    return data.value.map((item) => convertToSimpleType(item));
  } else return [];
});

const firstRawData = ref();
const firstData = ref<
  {
    index: number;
    close: number;
  }[]
>();
const fetchStockData = async () => {
  const symbol = "IBM";
  const apiKey = config.public.stockApiKey;
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`;

  try {
    firstRawData.value = await $fetch(url);

    const timeSeries = Object.entries(
      firstRawData.value["Time Series (Daily)"] as Record<string, DailyData>
    );

    firstData.value = timeSeries.map(([_, day], index) => ({
      index, // The index of the day
      close: Math.round(Number(day["4. close"])),
    }));
    console.log(firstData.value.slice(0, 10)); // This should log an array of numbers
  } catch (error) {
    console.error("Error fetching stock data:", error);
  }
};

onMounted(() => {
  fetchStockData();
});

// const config2 = {
//   type: "line",
//   data: {
//     datasets: [
//       {
//         borderColor: "#417ABE",
//         borderWidth: 1,
//         radius: 0,
//         data: firstData.value,
//       },
//       {
//         borderColor: "#00B8CD",
//         borderWidth: 1,
//         radius: 0,
//         data: firstData.value,
//       },
//     ],
//   },
// };

const chartData2 = computed(() => {
  const labels: number[] = firstData.value
    ? firstData.value.map((item) => item.index)
    : [];
  const data: number[] = firstData.value
    ? firstData.value.map((item) => item.close)
    : [];

  return {
    labels,
    datasets: [
      {
        label: "value(yen)",
        data,
        // backgroundColor: ["#417ABE", "#00B8CD", "#009DFF", "#78D7FF"],
        backgroundColor: "#417ABE",
      },
    ],
  };
});

// const handleEnter = async (event: KeyboardEvent) => {
//   if (event.key === "Enter") {
//     await fetchSearchResults(1);
//   }
// };

const chartData = computed(() => {
  const labels: string[] = assetList.value.map((item) => item.name);
  const data: number[] = assetList.value.map((item) => item.value);

  return {
    labels,
    datasets: [
      {
        label: "value(yen)",
        data,
        backgroundColor: ["#417ABE", "#00B8CD", "#009DFF", "#78D7FF"],
      },
    ],
  };
});

interface ChartOptionsWithRadius extends ChartOptions {
  radius?: number;
}

const chartOption: ChartOptionsWithRadius = {
  // responsive: true,
  maintainAspectRatio: false,
  radius: 120,
  plugins: {
    legend: {
      position: "right",
      labels: {
        boxWidth: 15,
        font: {
          size: 14,
        },
      },
    },

    tooltip: {
      enabled: true,
    },
  },
};

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
</script>

<template>
  <div class="py-2 mx-4 h-100vh bg-gray-300 w-100vw">
    <!-- <pre>{{ firstData }}</pre> -->
    <PartsChart
      type="doughnut"
      :data="chartData"
      :options="chartOption"
      class="w-100 m-auto h-100"
    />

    <PartsChart
      type="line"
      :data="chartData2"
      :options="chartOption2"
      class="w-200 m-auto h-100"
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
