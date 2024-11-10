<template>
  <div ref="widgetContainer" v-html="widgetHTML"></div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const widgetContainer = ref(null);

// Widget HTML structure as a string
const widgetHTML = `
  <div class="tradingview-widget-container">
    <div class="tradingview-widget-container__widget"></div>
    <div class="tradingview-widget-copyright">
      <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
        <span class="blue-text">Track all markets on TradingView</span>
      </a>
    </div>
  </div>
`;

onMounted(() => {
  // Inject the TradingView script dynamically
  const script = document.createElement("script");
  script.src =
    "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
  script.async = true;
  script.innerHTML = JSON.stringify({
    symbols: [
      { proName: "FOREXCOM:SPXUSD", title: "S&P 500 Index" },
      { proName: "BITSTAMP:BTCUSD", title: "Bitcoin" },
      { proName: "BITSTAMP:ETHUSD", title: "Ethereum" },
      { description: "Tesla", proName: "NASDAQ:TSLA" },
      { description: "Nvidia", proName: "NASDAQ:NVDA" },
      { description: "Apple", proName: "NASDAQ:AAPL" },
      { description: "Google", proName: "NASDAQ:GOOG" },
      { description: "Microsoft", proName: "NASDAQ:MSFT" },
      { description: "AMD", proName: "NASDAQ:AMD" },
      { description: "USD/JPY", proName: "CAPITALCOM:USDJPY" },
    ],
    showSymbolLogo: true,
    isTransparent: false,
    displayMode: "adaptive",
    colorTheme: "dark",
    locale: "en",
  });
  widgetContainer.value.appendChild(script);
});
</script>

<style scoped>
.tradingview-widget-container {
  width: 100%;
}
</style>
