"use client";

import { useEffect, useState } from "react";
import {
  aggregateTokens,
  AggregatedToken,
  TokenBalance,
} from "@/app/lib/aggragateTokens";

export default function TokenList() {
  const [tokens, setTokens] = useState<AggregatedToken[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBalances() {
      try {
        const res = await fetch("/api/balances");
        const json = await res.json();

        if (!Array.isArray(json.data)) {
          console.error("Expected `data` to be an array:", json);
          return;
        }
        console.log(json);

        const grouped = aggregateTokens(json.data);
        setTokens(grouped);
      } catch (error) {
        console.error("Error fetching balances:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchBalances();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Aggregated Token Balances</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="space-y-2">
          {tokens.map((token, i) => (
            <li
              key={`${token.token}-${token.chain}-${i}`}
              className="p-2 border rounded"
            >
              <strong>Chain:</strong> {token.chain} | <strong>Token:</strong>{" "}
              {token.token} | <strong>Balance:</strong>{" "}
              {Number(token.usdValue).toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 4,
              })}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
