"use client";

import useMarketData from "@/hooks/useMarketData";
import useMarketWebSocket from "@/hooks/useMarketWebSocket";

export default function MarketWatch({ selectedSymbol, onSelectSymbol }) {
  const { data, error, isLoading } = useMarketData("/market/instruments");

  const { isConnected, updates } = useMarketWebSocket();

  if (isLoading) {
    return <p>Loading market data...</p>;
  }

  if (error) {
    return <p>Failed to load market data.</p>;
  }

  const instruments = data?.data || [];

  return (
    <section>
      <div>
        <h2>Market Watch</h2>

        <span>{isConnected ? "🟢 Live" : "🔴 Disconnected"}</span>
      </div>

      <table>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Name</th>
            <th>Price</th>
            <th>Change</th>
            <th>Change %</th>
            <th>Volume</th>
          </tr>
        </thead>

        <tbody>
          {instruments.map((stock) => {
            const liveUpdate = updates[stock.symbol];

            const currentPrice = liveUpdate?.price ?? stock.price;

            const change = currentPrice - stock.previousClose;

            const changePercent = (change / stock.previousClose) * 100;

            const valueClass =
              change > 0 ? "positive" : change < 0 ? "negative" : "neutral";

            const isSelected = selectedSymbol === stock.symbol;

            return (
              <tr
                key={stock.symbol}
                onClick={() => onSelectSymbol(stock.symbol)}
                className={isSelected ? "selected-row" : ""}
              >
                <td>{stock.symbol}</td>

                <td>{stock.name}</td>

                <td className={valueClass}>${currentPrice.toFixed(2)}</td>

                <td className={valueClass}>
                  {change > 0 ? "+" : ""}
                  {change.toFixed(2)}
                </td>

                <td className={valueClass}>
                  {changePercent > 0 ? "+" : ""}
                  {changePercent.toFixed(2)}%
                </td>

                <td>{stock.volume.toLocaleString()}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
