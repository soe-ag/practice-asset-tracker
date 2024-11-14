<script setup lang="ts">
const props = defineProps<{
  label1?: string;
  label2?: string;
  label3?: string;
}>();
</script>

<template>
  <div class="text-xs text-gray-500 flex gap-2">
    <div class="flex gap-1 items-center">
      <div class="w-3 h-3 bg-#2962ff" />
      <p>{{ props.label1 ?? "Not selected" }}</p>
    </div>
    <div class="flex gap-1 items-center">
      <div class="w-3 h-3 bg-#e15759" />
      <p>{{ props.label2 ?? "Apple" }}</p>
    </div>
    <div class="flex gap-1 items-center">
      <div class="w-3 h-3 bg-#f28e2c" />
      <p>{{ props.label3 ?? "Google" }}</p>
    </div>
  </div>
</template>
