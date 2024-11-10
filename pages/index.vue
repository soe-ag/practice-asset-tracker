<script setup></script>

<template>
  <div>
    <div class="grid grid-cols-2 gap-4 mx-2 p-2 text-gray-400">
      <div class="b-2 b-solid rounded-2 b-gray-800 p-4">
        <h4 class="mb-4">Single Line Chart</h4>
        <TvChart class="h-80" />
      </div>
      <div class="b-2 b-solid rounded-2 b-gray-800 p-4">
        <h4 class="mb-4">Series Comparison Chart</h4>
        <SeriesCompare class="h-80" />
      </div>
      <div class="b-2 b-solid rounded-2 b-gray-800 p-4">
        <h4 class="mb-4">Tooltip</h4>
        <SingleTooltip class="h-80 relative" quote="Tesla" />
      </div>
      <div class="b-2 b-solid rounded-2 b-gray-800 p-4">
        <h4 class="mb-4">Series Comparison Chart</h4>
        <TvChart class="h-80" />
      </div>
    </div>
    <!-- <div class="b-1 b-solid b-amber">
      <WidgetOne />
    </div> -->
  </div>
</template>
