import React from "react";
import { FaHome, FaChartLine, FaWallet, FaShoppingCart } from "react-icons/fa";
import Chart from "react-apexcharts";
import { useEffect, useState } from "react";

const WATCHLIST = ["AAPL", "GOOGL", "TSLA", "AMZN", "MSFT"];

export default function Sidebar({ selectedStock, setSelectedStock, prices }) {
  const [history, setHistory] = useState({});

  // Maintain last 20 price points per stock for sparkline
  useEffect(() => {
    const interval = setInterval(() => {
      setHistory((prev) => {
        const updated = { ...prev };
        WATCHLIST.forEach((stock) => {
          const newPrice = prices?.[stock] || 100;
          if (!updated[stock]) updated[stock] = [];
          updated[stock] = [...updated[stock].slice(-19), newPrice];
        });
        return updated;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [prices]);

  return (
    <div className="w-64 bg-gray-900 text-white h-screen p-5 flex flex-col gap-5">
      <h1 className="text-2xl font-bold">Trading Solutions</h1>
      <nav className="flex flex-col gap-4">
        <a href="#" className="hover:bg-gray-700 p-2 rounded flex items-center gap-2">
          <FaHome /> Dashboard
        </a>
        <a href="#" className="hover:bg-gray-700 p-2 rounded flex items-center gap-2">
          <FaChartLine /> Charts
        </a>
        <a href="#" className="hover:bg-gray-700 p-2 rounded flex items-center gap-2">
          <FaWallet /> Portfolio
        </a>
        <a href="#" className="hover:bg-gray-700 p-2 rounded flex items-center gap-2">
          <FaShoppingCart /> Orders
        </a>
      </nav>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Watchlist</h2>
        {WATCHLIST.map((stock) => {
          const change = history[stock]?.length > 1
            ? ((history[stock][history[stock].length - 1] - history[stock][0]) / history[stock][0]) * 100
            : 0;

          return (
            <button
              key={stock}
              className={`w-full text-left p-2 rounded flex justify-between items-center hover:bg-gray-700 ${
                selectedStock === stock ? "bg-gray-700" : ""
              }`}
              onClick={() => setSelectedStock(stock)}
            >
              <div>
                <div className="flex justify-between items-center gap-2">
                  <span>{stock}</span>
                  <span className={`${change >= 0 ? "text-green-400" : "text-red-400"} text-sm`}>
                    {change >= 0 ? "+" : ""}{change.toFixed(2)}%
                  </span>
                </div>
                <div className="mt-1">
                  {history[stock] && history[stock].length > 1 && (
                    <Chart
                      options={{
                        chart: { type: "area", sparkline: { enabled: true }, animations: { enabled: true } },
                        stroke: { curve: "smooth" },
                        tooltip: { enabled: false },
                        colors: [change >= 0 ? "#34D399" : "#F87171"],
                      }}
                      series={[{ data: history[stock] }]}
                      type="area"
                      height={30}
                      width={100}
                    />
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

