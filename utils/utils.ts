// export const convertToDbType = (item: RawMovieWithTotal): DbMovieWithTotal => {
//   return {
//     totalResults: item.total_results,
//     movies: item.results.map((item) => {
//       return {
//         id: item.id,
//         title: item.title ?? item.name ?? "no title",
//         posterUrl: item.poster_path
//           ? `https://image.tmdb.org/t/p/w200${item.poster_path}`
//           : "/images/default-movie-poster.jpg",
//         rating: item.vote_average ? Number(item.vote_average.toFixed(1)) : 0,
//         release: item.first_air_date
//           ? Number(item.first_air_date.split("-")[0])
//           : item.release_date
//           ? Number(item.release_date.split("-")[0])
//           : null,
//         type: item.media_type ?? "movie",
//         addedAt: new Date(),
//       };
//     }),
//   };
// };

export const convertToSimpleType = (item: RawAsset): Asset => {
  return {
    name: item.assetName,
    value: item.amount
      ? item.amount * item.buyPrice
      : item.isYen
      ? item.buyPrice
      : convertDollarToYen(item.buyPrice, 152),
  };
};

const convertDollarToYen = (dollar: number, rate: number): number => {
  return dollar * rate;
};

// todo: change the function name
export const getDataFromJson = (jsonData: RawStockData) => {
  return Object.entries(jsonData["Time Series (Daily)"])
    .map(([date, day]) => ({
      time: date, // The date of the stock data
      value: Math.round(Number(day["4. close"])), // Rounded close price
    }))
    .slice(0, 500)
    .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
};

export const getVolumeDataFromJson = (jsonData: RawStockData) => {
  return Object.entries(jsonData["Time Series (Daily)"])
    .map(([date, day]) => ({
      time: date, // The date of the stock data
      value: Math.round(Number(day["5. volume"])), // Rounded close price
    }))
    .slice(0, 500)
    .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
};
