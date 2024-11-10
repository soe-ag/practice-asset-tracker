<script setup lang="ts">
const menuItems = ref([
  {
    label: "Home",
    icon: "i-material-symbols-home-rounded",
    route: "/",
  },

  {
    label: "Save",
    icon: "i-material-symbols-save-rounded",
    route: "/save",
  },
  {
    label: "Favorite",
    icon: "i-material-symbols-favorite",
    route: "/favorite",
  },
  {
    label: "Others",
    icon: "i-material-symbols-movie-filter",
    route: "/others",
  },
  {
    label: "",
    icon: "i-logos-nuxt-icon",
    route: "/sample",
  },
]);

const route = useRoute();
// bg-[url('/images/pexels-pavel-danilyuk-7234404.jpg')]
</script>

<template>
  <div class="bg-cover bg-fixed bg-blend-overlay bg-center bg-#000">
    <nav class="flex gap-2 items-center p-1">
      <!-- Left Menu Items -->
      <div class="flex gap-2">
        <div v-for="menu in menuItems.slice(0, 4)" :key="menu.label">
          <NuxtLink
            :to="menu.route"
            :class="{
              'text-blue-4 ': route.path === menu.route,
              'text-gray-400 hover:text-blue-4': route.path !== menu.route,
            }"
            class="no-underline rounded-1 m-1 w-fit px-2 h-8 flex justify-center items-center gap-1"
          >
            <div :class="menu.icon" />
            <div class="text-lg max-md:hidden">{{ menu.label }}</div>
          </NuxtLink>
        </div>
      </div>

      <!-- Right Menu Item -->
      <!-- <div class="col-span-1 flex justify-end">
        <NuxtLink
          :to="menuItems[4].route"
          :class="{
            'text-green-4 ': route.path === menuItems[4].route,
            'text-gray-400 hover:text-green-4':
              route.path !== menuItems[4].route,
          }"
          class="no-underline rounded-1 m-1 w-fit px-2 h-8 flex justify-center items-center gap-1"
        >
          <div :class="menuItems[4].icon" class="text-xs" />
          <div class="text-lg">{{ menuItems[4].label }}</div>
        </NuxtLink>
      </div> -->
    </nav>
    <slot />
    <footer class="text-xs text-end my-2 text-gray-400">
      TradingView Lightweight Charts™ Copyright (с) 2024 TradingView, Inc.
      https://www.tradingview.com/
    </footer>
  </div>
</template>
