<script setup></script>

<template>
  <div>
    <p>a</p>
    <div class="grid grid-cols-2 gap-4 m-2 p-2">
      <div>
        <h4 class="pl-4">Single Line Chart</h4>
        <TvChart class="h-98 border-3 border-amber p-4" />
      </div>
      <div>
        <h4 class="pl-4">Series Comparison Chart</h4>
        <SeriesCompare class="h-80 border-3 border-amber p-4" />
      </div>
      <div>
        <h4 class="pl-4">Single Line Chart</h4>
        <TvChart class="h-100 border-3 border-amber p-4" />
      </div>
      <div>
        <h4 class="pl-4">Single Line Chart</h4>
        <TvChart class="h-100 border-3 border-amber p-4" />
      </div>
    </div>
  </div>
</template>
