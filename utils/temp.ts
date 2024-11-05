// interface CustomScriptableContext extends ScriptableContext<"line"> {
//     index: number; // Make index optional
//     xStarted: boolean;
//     yStarted: boolean;
//   }

// const totalDuration = 10000;
// const delayBetweenPoints = totalDuration / firstData.value.length;
// const previousY = (ctx: CustomScriptableContext) => {
//   // Check if we're at the first index or if previous data point is unavailable
//   if (ctx.index === 0) {
//     return ctx.chart.scales.y.getPixelForValue(100);
//   }

//   const previousDataPoint = ctx.chart.getDatasetMeta(ctx.datasetIndex).data[
//     ctx.index - 1
//   ];

//   // Ensure the previous data point exists before calling getProps
//   return previousDataPoint
//     ? previousDataPoint.getProps(["y"], true).y
//     : ctx.chart.scales.y.getPixelForValue(100); // Fallback if previous data point is missing
// };

// const animation = {
//   x: {
//     type: "number",
//     easing: "linear",
//     duration: delayBetweenPoints,
//     from: NaN, // the point is initially skipped
//     delay(ctx: CustomScriptableContext) {
//       if (ctx.type !== "data" || ctx.xStarted) {
//         return 0;
//       }
//       ctx.xStarted = true;
//       return ctx.index * delayBetweenPoints;
//     },
//   },
//   y: {
//     type: "number",
//     easing: "linear",
//     duration: delayBetweenPoints,
//     from: previousY,
//     delay(ctx: CustomScriptableContext) {
//       if (ctx.type !== "data" || ctx.yStarted) {
//         return 0;
//       }
//       ctx.yStarted = true;
//       return ctx.index * delayBetweenPoints;
//     },
//   },
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
// } as any;

// const chartConfig = {
//     type: "line",
//     data: {
//       datasets: [
//         {
//           borderColor: "#00B8CD",
//           borderWidth: 1,
//           radius: 0,
//           data: firstData.value,
//         },
//         {
//           borderColor: "#00B8CE",
//           borderWidth: 1,
//           radius: 0,
//           data: firstData.value,
//         },
//       ],
//     },
//     options: {
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       animation: animation as any, // Casting if necessary to bypass typing issues
//       interaction: {
//         intersect: false,
//       },
//       plugins: {
//         legend: false,
//       },
//       scales: {
//         x: {
//           type: "linear",
//         },
//       },
//     },
//   };
