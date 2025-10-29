import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";

export default function ChartsPanel({ selectedStock, orders }) {
  const [series, setSeries] = useState([{ data: [] }]);

  useEffect(() => {
    // Initialize chart for selected stock
    const initialData = Array.from({ length: 20 }, (_, i) => {
      const price = 100 + Math.random() * 50;
      return { x: new Date(Date.now() - (20 - i) * 2000), y: [price, price + 5, price - 5, price + 2] };
    });
    setSeries([{ data: initialData }]);
  }, [selectedStock]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!series[0].data.length) return;

      const last = series[0].data[series[0].data.length - 1];
      const open = last.y[3];
      const close = open + (Math.random() * 4 - 2);
      const high = Math.max(open, close) + Math.random() * 2;
      const low = Math.min(open, close) - Math.random() * 2;

      setSeries([{ data: [...series[0].data.slice(-19), { x: new Date(), y: [open, high, low, close] }] }]);
    }, 2000);

    return () => clearInterval(interval);
  }, [series]);

  return (
    <div className="bg-gray-100 p-4 rounded shadow-md flex-1">
      <h2 className="text-lg font-semibold mb-2">{selectedStock} Chart</h2>
      <Chart
        options={{
          chart: { type: "candlestick", height: 350, animations: { enabled: true } },
          xaxis: { type: "datetime" },
          yaxis: { tooltip: { enabled: true } },
        }}
        series={series}
        type="candlestick"
        height={350}
      />
    </div>
  );
}
