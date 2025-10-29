import React from "react";
import Chart from "react-apexcharts";

export default function Portfolio({ orders, prices }) {
  // Aggregate holdings by stock
  const portfolio = {};
  orders.forEach((o) => {
    if (!portfolio[o.symbol]) portfolio[o.symbol] = { invested: 0, qty: 0, history: [] };
    portfolio[o.symbol].invested += o.qty * o.price;
    portfolio[o.symbol].qty += +o.qty;
    portfolio[o.symbol].history.push(prices[o.symbol] || o.price);
  });

  const totalInvested = Object.values(portfolio).reduce((acc, s) => acc + s.invested, 0);
  const totalValue = Object.values(portfolio).reduce((acc, s) => acc + s.qty * (prices[s.symbol] || s.invested / s.qty), 0);
  const totalPnL = totalValue - totalInvested;

  return (
    <div className="bg-white shadow-md rounded-lg p-4 overflow-x-auto">
      <h2 className="text-xl font-semibold mb-2">Portfolio</h2>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th className="p-2">Stock</th>
            <th className="p-2">Qty</th>
            <th className="p-2">Invested</th>
            <th className="p-2">Value</th>
            <th className="p-2">P&L</th>
            <th className="p-2">% Change</th>
            <th className="p-2">Trend</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(portfolio).map((symbol) => {
            const s = portfolio[symbol];
            const currentPrice = prices[symbol] || 0;
            const value = s.qty * currentPrice;
            const pnl = value - s.invested;
            const change = (pnl / s.invested) * 100 || 0;
            const sparkData = s.history.slice(-20);

            return (
              <tr key={symbol} className="hover:bg-gray-50 transition">
                <td className="p-2 font-semibold">{symbol}</td>
                <td className="p-2">{s.qty}</td>
                <td className="p-2">${s.invested.toFixed(2)}</td>
                <td className="p-2">${value.toFixed(2)}</td>
                <td className={`p-2 font-semibold ${pnl >= 0 ? "text-green-600" : "text-red-600"}`}>
                  ${pnl.toFixed(2)}
                </td>
                <td className={`p-2 ${change >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {change.toFixed(2)}%
                </td>
                <td className="p-2 w-24">
                  {sparkData.length > 1 && (
                    <Chart
                      options={{
                        chart: { type: "area", sparkline: { enabled: true } },
                        stroke: { curve: "smooth" },
                        colors: [change >= 0 ? "#34D399" : "#F87171"],
                        tooltip: { enabled: false },
                      }}
                      series={[{ data: sparkData }]}
                      type="area"
                      height={40}
                    />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="mt-2 flex justify-between font-bold text-lg">
        <span>Total P&L:</span>
        <span className={totalPnL >= 0 ? "text-green-600" : "text-red-600"}>${totalPnL.toFixed(2)}</span>
      </div>
    </div>
  );
}
