"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { aggregateTokens, AggregatedToken } from "@/app/lib/aggragateTokens";

export default function TokenPieChart() {
  const [allTokens, setAllTokens] = useState<AggregatedToken[]>([]);
  const [filteredTokens, setFilteredTokens] = useState<AggregatedToken[]>([]);
  const [selectedChain, setSelectedChain] = useState("both");
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  const [hoveredToken, setHoveredToken] = useState<string | null>(null);

  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    async function fetchTokens() {
      const res = await fetch("/api/balances");
      const json = await res.json();

      const allAggregated: AggregatedToken[] = Array.isArray(json.data)
        ? aggregateTokens(json.data)
        : [];

      setAllTokens(allAggregated);
    }

    fetchTokens();
  }, []);

  useEffect(() => {
    let filtered = allTokens.filter((t) => t.chain === selectedChain);

    if (selectedTokens.length > 0) {
      filtered = filtered.filter((t) => selectedTokens.includes(t.token));
    }

    setFilteredTokens(filtered);
  }, [allTokens, selectedChain, selectedTokens]);

  useEffect(() => {
    if (filteredTokens.length === 0 || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2;

    const color = d3.scaleOrdinal(d3.schemeCategory10);
    const pie = d3.pie<AggregatedToken>().value((d) => d.usdValue);
    const arc = d3
      .arc<d3.PieArcDatum<AggregatedToken>>()
      .innerRadius(0)
      .outerRadius(radius - 10);

    const g = svg
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const formatBalance = d3.format(",.2f");

    g.selectAll("path")
      .data(pie(filteredTokens))
      .join("path")
      .attr("d", arc)
      .attr("fill", (_, i) => color(i.toString()))
      .on("mouseover", (event, d) => setHoveredToken(d.data.token))
      .on("mouseout", () => setHoveredToken(null))
      .append("title")
      .text((d) => `${d.data.token}: ${formatBalance(d.data.usdValue)}`);
  }, [filteredTokens]);

  const formatReadable = d3.format(",.2f");
  const uniqueTokens = [...new Set(allTokens.map((t) => t.token))];

  const toggleToken = (token: string) => {
    setSelectedTokens((prev) =>
      prev.includes(token) ? prev.filter((t) => t !== token) : [...prev, token]
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Token Distribution (Filtered)</h2>

      {/* Filters */}
      <div className="flex flex-col gap-4 mb-4">
        {/* Chain Select */}
        <div>
          <label className="block mb-1">Chain</label>
          <select
            value={selectedChain}
            onChange={(e) => setSelectedChain(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="celo">Celo</option>
            <option value="ethereum">Ethereum</option>
            <option value="both">Both</option>
          </select>
        </div>

        {/* Token Checkboxes */}
        <div>
          <label className="block mb-1">Select Tokens</label>
          <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border p-2 rounded">
            {uniqueTokens.map((token) => (
              <label key={token} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={token}
                  checked={selectedTokens.includes(token)}
                  onChange={() => toggleToken(token)}
                />
                {token}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="flex justify-center">
        <svg ref={svgRef} />
      </div>

      {/* Token Grid */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        {filteredTokens.map((token) => (
          <div
            key={token.token + token.chain}
            className={`p-2 border rounded shadow-sm transition-all ${
              hoveredToken === token.token
                ? "border-blue-500 bg-blue-100"
                : "border-gray-200"
            }`}
          >
            <strong>{token.token}</strong>: {formatReadable(token.usdValue)}
          </div>
        ))}
      </div>
    </div>
  );
}
