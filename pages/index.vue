<script setup lang="ts">
import type { ChartOptions } from "chart.js";
import { convertToSimpleType } from "~/utils/utils";

// import { useRuntimeConfig } from "#app";

const client = useSupabaseClient();

// let isShowSearchResult = false;

// const searchQuery = ref("");
// let searchQueryLabel = "";

// const popularCurrentPage = ref(1);

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

// const popularMovies = computed(() => {
//   if (data.value) {
//     isShowSearchResult = false;
//     return convertToDbType(data.value);
//   } else return { movies: [], totalResults: 0 };
// });

// // search function area

// const searchResults = ref<DbMovie[]>([]);
// const searchTotal = ref(0);
// const searchCurrentPage = ref(1);

// const fetchSearchResults = async (page: number) => {
//   const searchData = await $fetch<RawMovieWithTotal>(
//     "https://api.themoviedb.org/3/search/multi",
//     {
//       params: {
//         api_key: config.public.tmdbApiKey,
//         include_adult: false,
//         query: searchQuery.value,
//         language: "en-US",
//         page,
//       },
//     }
//   );

//   isShowSearchResult = true;
//   searchQueryLabel = searchQuery.value; // for search query label
//   // searchQuery.value = ""; if clear, pagination will not work

//   searchResults.value = convertToDbType(searchData).movies.filter(
//     (item) => item.type !== "person"
//   );
//   searchTotal.value = searchData.total_results; // for pagination
// };

// };

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
</script>

<template>
  <div class="py-2 mx-4 h-100vh bg-gray-300 w-80vh">
    <!-- <pre>{{ assetList }}</pre> -->
    <PartsChart
      type="doughnut"
      :data="chartData"
      :options="chartOption"
      class="w-100 m-auto h-100"
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
