"use client";

import { useState } from "react";

type EthBalanceResponse = {
  chain: string;
  symbol: string;
  hexBalance: string;
  ethBalance: number;
  ethPrice: number;
  usdValue: number;
};

export default function GetBalancesButton() {
  const [data, setData] = useState<null | EthBalanceResponse>(null);
  const [loading, setLoading] = useState(false);

  const fetchBalance = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/eth-balance");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Error fetching ETH balance:", err);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={fetchBalance}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {loading ? "Fetching..." : "Get ETH Balance in USD"}
      </button>

      {data && (
        <div className="mt-4 text-sm space-y-1">
          <p>
            <strong>Chain:</strong> {data.chain}
          </p>
          <p>
            <strong>Symbol:</strong> {data.symbol}
          </p>
          <p>
            <strong>Hex Balance:</strong> {data.hexBalance}
          </p>
          <p>
            <strong>ETH Balance:</strong> {data.ethBalance.toFixed(6)} ETH
          </p>
          <p>
            <strong>ETH Price:</strong> ${data.ethPrice.toFixed(2)}
          </p>
          <p>
            <strong>USD Value:</strong> ${data.usdValue.toFixed(2)}
          </p>
        </div>
      )}
    </div>
  );
}
