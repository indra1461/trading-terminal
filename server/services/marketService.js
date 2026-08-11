const instruments = require("../data/marketData");

const getInstruments = () => {
  return instruments.map((stock) => {
    const change = stock.price - stock.previousClose;

    const changePercent = (change / stock.previousClose) * 100;

    return {
      ...stock,
      change: Number(change.toFixed(2)),
      changePercent: Number(changePercent.toFixed(2)),
    };
  });
};

const getInstrumentBySymbol = (symbol) => {
  const stock = instruments.find(
    (item) => item.symbol === symbol.toUpperCase(),
  );

  if (!stock) {
    return null;
  }

  const change = stock.price - stock.previousClose;

  const changePercent = (change / stock.previousClose) * 100;

  return {
    ...stock,
    change: Number(change.toFixed(2)),
    changePercent: Number(changePercent.toFixed(2)),
  };
};

module.exports = {
  getInstruments,
  getInstrumentBySymbol,
};
