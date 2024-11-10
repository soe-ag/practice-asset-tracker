<script setup lang="ts">
import CompareChart from "~/components/charts/CompareChart.vue";
import LineChart from "~/components/charts/LineChart.vue";
import MultipleTypeChart from "~/components/charts/MultipleTypeChart.vue";
import VolumeChart from "~/components/charts/VolumeChart.vue";

const chartType = ref("area");

const handleChangeChartType = (type: string) => {
  chartType.value = type;
};
</script>

<template>
  <div class="">
    <div class="grid grid-cols-2 gap-1 mx-2 px-2 text-gray-400">
      <div class="b-2 b-solid rounded-2 b-gray-800 p-4">
        <h4 class="mb-4">Line Chart with MA-20</h4>
        <LineChart class="h-70 relative" quote="Tesla" />
      </div>

      <div class="b-2 b-solid rounded-2 b-gray-800 p-4">
        <h4 class="mb-4">Series Comparison Chart</h4>
        <CompareChart class="h-70" />
      </div>
      <div class="b-2 b-solid rounded-2 b-gray-800 p-4">
        <div class="flex gap-2 items-center mb-4">
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
        <!-- <p>{{ chartType }}</p> -->
        <MultipleTypeChart class="h-70" :chart-type="chartType" />
      </div>

      <div class="b-2 b-solid rounded-2 b-gray-800 p-4">
        <h4 class="mb-4">Volume Chart</h4>
        <VolumeChart class="h-70" />
      </div>
    </div>
    <div class="my-1">
      <WidgetOne />
    </div>
  </div>
</template>
