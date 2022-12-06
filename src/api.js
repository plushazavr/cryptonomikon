const API_KEY='61989cea893b6c0312652ceae72768e37412bbe7e6d6e97b6e30be106327a288';

export const loadTickers = tickers =>
fetch(
  `https://min-api.cryptocompare.com/data/pricemulti?fsym=${tickers.join(',')}&tsyms=USD&api_key=${API_KEY}`)
  .then(r => r.json())
  .then(rawData => 
    Object.fromEntries(
      Object.entries(rawData).map(([key, value]) => [key, value.USD])
  )
);