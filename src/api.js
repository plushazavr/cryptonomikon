//для получения обновления крипптовалютных пар с API

const API_KEY='61989cea893b6c0312652ceae72768e37412bbe7e6d6e97b6e30be106327a288';

const tickersHandlers = new Map();// список фун-й, которые надо получить, когда изменился тикер

const loadTickers = () => {
  if(tickersHandlers.size === 0) {
    return;
  }
  // получаем данные на сервере
  fetch(
    `https://min-api.cryptocompare.com/data/pricemulti?fsym=${[...tickersHandlers.keys()]
    .join(',')}&tsyms=USD&api_key=${API_KEY}`
    )
    .then(r => r.json())
    .then(rawData => {
      const updatedPrices = Object.fromEntries(
        Object.entries(rawData).map(([key, value]) => [key, value.USD])
      );

      Object.entries(updatedPrices).forEach(([currency,newPrice]) => {
        const handlers = tickersHandlers.get(currency) ?? [];
        handlers.forEach(fn => fn(newPrice));
      });
    });
};

//при подписке на определенный тикер вызывай ряд функций subscribers + новую функцию
export const subscribeToTicker = (ticker, cb) => {
  const subscribers = tickersHandlers.get(ticker) || [];
  tickersHandlers.set(ticker, [...subscribers, cb]);
};

export const unscribetoTicker = ticker => {
  tickersHandlers.delete(ticker);
  // const subscribers = tickersHandlers.get(ticker) || [];
  // tickersHandlers.set(ticker, subscribers.filter(fn => fn != cb)); //вытягиваем все функции, которые подписанны на тикер, и оставляем функцию отличную от заданного коллбэка
};

setInterval(loadTickers, 5000);

window.tickersHandlers = tickersHandlers;