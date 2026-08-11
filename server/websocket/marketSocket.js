const { WebSocketServer } = require("ws");

const marketPrices = {
  AAPL: 215.42,
  NVDA: 181.23,
  TSLA: 342.18,
  MSFT: 512.64,
  AMZN: 228.45,
  META: 782.35,
};

const marketSocket = (server) => {
  const wss = new WebSocketServer({
    server,
  });

  wss.on("connection", (socket) => {
    console.log("WebSocket client connected");

    socket.send(
      JSON.stringify({
        type: "CONNECTED",
        message: "Market data connection established",
      }),
    );

    socket.on("close", () => {
      console.log("WebSocket client disconnected");
    });
  });

  // Mock real-time market feed
  setInterval(() => {
    Object.keys(marketPrices).forEach((symbol) => {
      const currentPrice = marketPrices[symbol];

      const movement = (Math.random() - 0.5) * 2;

      const newPrice = currentPrice + movement;

      marketPrices[symbol] = Number(newPrice.toFixed(2));

      const message = JSON.stringify({
        type: "QUOTE_UPDATE",
        symbol,
        price: marketPrices[symbol],
        timestamp: new Date().toISOString(),
      });

      console.log(`[MARKET] ${symbol}: $${marketPrices[symbol]}`);

      wss.clients.forEach((client) => {
        if (client.readyState === 1) {
          client.send(message);
        }
      });
    });
  }, 1000);

  return wss;
};

module.exports = marketSocket;
