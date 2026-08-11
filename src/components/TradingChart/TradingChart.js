"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

// -------------------------------------
// Generate mock OHLC data
// -------------------------------------

const stockPrices = {
  AAPL: 224.45,
  TSLA: 320.5,
  NVDA: 180.25,
  MSFT: 510.3,
  AMZN: 230.4,
};
const generateOHLCData = (count, intervalMinutes, symbol) => {
  const data = [];

  let price = stockPrices[symbol] || 200;

  const now = new Date();

  for (let i = count - 1; i >= 0; i--) {
    const time = new Date(now.getTime() - i * intervalMinutes * 60 * 1000);

    const open = price;

    const movement = (Math.random() - 0.5) * 3;

    const close = open + movement;

    const high = Math.max(open, close) + Math.random() * 1.5;

    const low = Math.min(open, close) - Math.random() * 1.5;

    data.push({
      x: time,
      y: [
        Number(open.toFixed(2)),
        Number(high.toFixed(2)),
        Number(low.toFixed(2)),
        Number(close.toFixed(2)),
      ],
    });

    price = close;
  }

  return data;
};

// -------------------------------------
// Timeframe configuration
// -------------------------------------
const timeframeConfig = {
  "1D": {
    count: 78,
    interval: 5,
  },

  "1W": {
    count: 390,
    interval: 5,
  },

  "1M": {
    count: 300,
    interval: 30,
  },

  "6M": {
    count: 180,
    interval: 240,
  },

  "1Y": {
    count: 252,
    interval: 1440,
  },

  "5Y": {
    count: 260,
    interval: 10080,
  },
};

export default function TradingChart({ symbol }) {
  const [chartType, setChartType] = useState("line");

  const [timeframe, setTimeframe] = useState("1D");

  // -------------------------------------
  // Generate data according to timeframe
  // -------------------------------------
  const chartData = useMemo(() => {
    const config = timeframeConfig[timeframe];

    return generateOHLCData(config.count, config.interval, symbol);
  }, [timeframe, symbol]);

  const latestCandle = chartData[chartData.length - 1];

  const currentPrice = latestCandle.y[3];

  const previousCandle = chartData[chartData.length - 2];

  const previousPrice = previousCandle.y[3];

  const change = currentPrice - previousPrice;

  const changePercent = (change / previousPrice) * 100;

  const priceClass =
    change > 0 ? "positive" : change < 0 ? "negative" : "neutral";
  // -------------------------------------
  // Line chart data
  // -------------------------------------
  const lineSeries = [
    {
      name: symbol,
      data: chartData.map((item) => ({
        x: item.x,
        y: item.y[3],
      })),
    },
  ];

  // -------------------------------------
  // Candlestick data
  // -------------------------------------
  const candleSeries = [
    {
      name: symbol,
      data: chartData,
    },
  ];

  // -------------------------------------
  // Custom Tooltip
  // -------------------------------------
  const customTooltip = ({ seriesIndex, dataPointIndex, w }) => {
    const data = w.config.series[seriesIndex].data[dataPointIndex];

    const date = new Date(data.x);

    // LINE CHART
    if (chartType === "line") {
      const close = data.y;

      return `
      <div class="custom-tooltip">
        <div class="tooltip-title">
          ${symbol}
        </div>

        <div class="tooltip-time">
          ${date.toLocaleString()}
        </div>

        <div class="tooltip-row">
          <span>Close</span>
          <strong>
            $${Number(close).toFixed(2)}
          </strong>
        </div>
      </div>
    `;
    }

    // CANDLESTICK CHART
    const [open, high, low, close] = data.y;

    return `
    <div class="custom-tooltip">
      <div class="tooltip-title">
        ${symbol}
      </div>

      <div class="tooltip-time">
        ${date.toLocaleString()}
      </div>

      <div class="tooltip-row">
        <span>Open</span>
        <strong>
          $${open.toFixed(2)}
        </strong>
      </div>

      <div class="tooltip-row">
        <span>High</span>
        <strong>
          $${high.toFixed(2)}
        </strong>
      </div>

      <div class="tooltip-row">
        <span>Low</span>
        <strong>
          $${low.toFixed(2)}
        </strong>
      </div>

      <div class="tooltip-row">
        <span>Close</span>
        <strong>
          $${close.toFixed(2)}
        </strong>
      </div>
    </div>
  `;
  };

  // -------------------------------------
  // Chart options
  // -------------------------------------
  const chartOptions = {
    chart: {
      type: chartType,
      toolbar: {
        show: true,
      },
      zoom: {
        enabled: true,
      },
    },

    xaxis: {
      type: "datetime",
    },

    yaxis: {
      labels: {
        formatter: (value) => `$${value.toFixed(2)}`,
      },
    },

    tooltip: {
      custom: customTooltip,
    },

    grid: {
      strokeDashArray: 4,
    },
  };

  return (
    <section className="trading-chart">
      {/* Header */}
      <div className="chart-header">
        <div>
          <h2>{symbol}</h2>

          <div className={`current-price ${priceClass}`}>
            ${currentPrice.toFixed(2)}
          </div>

          <div className={`price-change ${priceClass}`}>
            {change > 0 ? "+" : ""}
            {change.toFixed(2)} ({changePercent > 0 ? "+" : ""}
            {changePercent.toFixed(2)}%)
          </div>

          <p>US Equity Market</p>
        </div>

        {/* Line / Candle */}
        <div className="chart-toggle">
          <button
            className={chartType === "line" ? "active" : ""}
            onClick={() => setChartType("line")}
          >
            Line
          </button>

          <button
            className={chartType === "candlestick" ? "active" : ""}
            onClick={() => setChartType("candlestick")}
          >
            Candle
          </button>
        </div>
      </div>

      {/* Timeframe */}
      <div className="timeframe-container">
        <span>Time Range:</span>

        {Object.keys(timeframeConfig).map((range) => (
          <button
            key={range}
            className={timeframe === range ? "active" : ""}
            onClick={() => setTimeframe(range)}
          >
            {range}
          </button>
        ))}
      </div>

      {/* Chart */}
      <Chart
        options={chartOptions}
        series={chartType === "line" ? lineSeries : candleSeries}
        type={chartType}
        height={450}
      />
    </section>
  );
}
