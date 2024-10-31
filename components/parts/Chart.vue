<script setup lang="ts" generic="T extends ChartType">
import PrimeChart from "primevue/chart";
import type { ChartData, ChartOptions, ChartType, Plugin } from "chart.js";

type Props = {
  type: T;
  data: ChartData<T>;
  options?: ChartOptions<T>;
  plugins?: Plugin[];
};

const props = defineProps<Props>();
</script>

<template>
  <PrimeChart v-bind="props" />
</template>
