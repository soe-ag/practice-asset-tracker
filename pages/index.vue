<script setup></script>

<template>
  <div>
    <p></p>
    <div class="grid grid-cols-2 gap-4 m-2 p-2 text-gray-400">
      <div class="b-2 b-solid rounded-2 b-gray-800 p-4">
        <h4 class="mb-4">Single Line Chart</h4>
        <TvChart class="h-80" />
      </div>
      <div class="b-2 b-solid rounded-2 b-gray-800 p-4">
        <h4 class="mb-4">Series Comparison Chart</h4>
        <SeriesCompare class="h-80" />
      </div>
      <div class="b-2 b-solid rounded-2 b-gray-800 p-4">
        <h4 class="mb-4">Series Comparison Chart</h4>
        <TvChart class="" />
      </div>
      <div class="b-2 b-solid rounded-2 b-gray-800 p-4">
        <h4 class="mb-4">Series Comparison Chart</h4>
        <TvChart class="" />
      </div>
    </div>
  </div>
</template>
