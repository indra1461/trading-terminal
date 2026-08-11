"use client";

import { useState } from "react";

import Header from "@/components/Header/Header";
import MarketWatch from "@/components/MarketWatch/MarketWatch";
import TradingChart from "@/components/TradingChart/TradingChart";

export default function Home() {
  const [selectedSymbol, setSelectedSymbol] = useState("AAPL");

  return (
    <>
      <Header />

      <main>
        <MarketWatch
          selectedSymbol={selectedSymbol}
          onSelectSymbol={setSelectedSymbol}
        />

        <TradingChart symbol={selectedSymbol} />
      </main>
    </>
  );
}
