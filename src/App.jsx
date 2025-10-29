import React from "react";
import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Portfolio from "./components/PortfolioSummary";
import ChartsPanel from "./components/ChartsPanel";
import OrderPanel from "./components/OrderPanel";

const WATCHLIST = ["AAPL", "GOOGL", "TSLA", "AMZN", "MSFT"];

export default function App() {
  const [orders, setOrders] = useState([]);
  const [selectedStock, setSelectedStock] = useState("AAPL");
  const [prices, setPrices] = useState({});

  // Initialize stock prices
  useEffect(() => {
    const initial = {};
    WATCHLIST.forEach((s) => (initial[s] = 100 + Math.random() * 50));
    setPrices(initial);
  }, []);

  // Simulate live price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPrices((prev) => {
        const updated = {};
        WATCHLIST.forEach((s) => {
          const change = prev[s] * (Math.random() * 0.02 - 0.01); // ±1%
          updated[s] = +(prev[s] + change).toFixed(2);
        });
        return updated;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        selectedStock={selectedStock}
        setSelectedStock={setSelectedStock}
        prices={prices}
      />
      <div className="flex-1 flex flex-col p-4 gap-4">
        <Portfolio orders={orders} prices={prices} />
        <div className="flex flex-1 gap-4 flex-col lg:flex-row">
          <ChartsPanel selectedStock={selectedStock} orders={orders} prices={prices} />
          <OrderPanel selectedStock={selectedStock} orders={orders} setOrders={setOrders} />
        </div>
      </div>
    </div>
  );
}
