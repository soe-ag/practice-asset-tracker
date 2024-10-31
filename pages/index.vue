<script setup lang="ts">
import { useRuntimeConfig } from "#app";

const config = useRuntimeConfig();

// let isShowSearchResult = false;

// const searchQuery = ref("");
// let searchQueryLabel = "";

// const popularCurrentPage = ref(1);

// const { data, refresh } = await useAsyncData(
//   "fetchPopularMovies",
//   () =>
//     $fetch<RawMovieWithTotal>(`https://api.themoviedb.org/3/movie/popular`, {
//       params: {
//         api_key: config.public.tmdbApiKey,
//         language: "en-US",
//         page: popularCurrentPage.value,
//       },
//     }),
//   { watch: [() => popularCurrentPage.value, () => isShowSearchResult] } // re-fetch
// );

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
</script>

<template>
  <div class="py-2 mx-4">
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
