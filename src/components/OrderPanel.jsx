import React, { useState, useEffect } from "react";

export default function OrderPanel({ orders, setOrders, selectedStock }) {
  const [form, setForm] = useState({ symbol: selectedStock, qty: "", price: "", type: "Market" });

  useEffect(() => {
    setForm({ ...form, symbol: selectedStock });
  }, [selectedStock]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const placeOrder = (e) => {
    e.preventDefault();
    if (form.symbol && form.qty && form.price) {
      setOrders([...orders, { ...form, id: Date.now() }]);
      setForm({ ...form, qty: "", price: "" });
    }
  };

  return (
    <div className="bg-gray-100 p-4 rounded shadow-md w-80 flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Place Order</h2>
      <form className="flex flex-col gap-2" onSubmit={placeOrder}>
        <input
          type="text"
          name="symbol"
          value={form.symbol}
          disabled
          className="p-2 border rounded bg-gray-200"
        />
        <input
          type="number"
          name="qty"
          value={form.qty}
          onChange={handleChange}
          placeholder="Quantity"
          className="p-2 border rounded"
        />
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          className="p-2 border rounded"
        />
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="p-2 border rounded"
        >
          <option>Market</option>
          <option>Limit</option>
        </select>
        <button className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          Place Order
        </button>
      </form>

      {orders.filter((o) => o.symbol === selectedStock).length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Orders</h3>
          <ul className="max-h-48 overflow-y-auto">
            {orders
              .filter((o) => o.symbol === selectedStock)
              .map((order) => (
                <li key={order.id} className="border-b p-1">
                  {order.symbol} - {order.qty} @ {order.price} ({order.type})
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
}
