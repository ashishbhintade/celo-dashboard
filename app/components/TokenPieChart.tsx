"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { aggregateTokens, AggregatedToken } from "@/app/lib/aggragateTokens";
import TokenSelector from "./TokenSelector";

export default function TokenPieChart() {
  const [allTokens, setAllTokens] = useState<AggregatedToken[]>([]);
  const [filteredTokens, setFilteredTokens] = useState<AggregatedToken[]>([]);
  const [selectedChain, setSelectedChain] = useState("both");
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);
  const [hoveredToken, setHoveredToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    async function fetchTokens() {
      const res = await fetch("/api/balances");
      const json = await res.json();

      const allAggregated: AggregatedToken[] = Array.isArray(json.data)
        ? aggregateTokens(json.data)
        : [];

      setAllTokens(allAggregated);
      setLoading(false);
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
      .on("mouseover", function (event, d) {
        setHoveredToken(d.data.token);
        const [x, y] = arc.centroid(d);
        d3.select(this)
          .transition()
          .duration(200)
          .attr("transform", `translate(${x * 0.1}, ${y * 0.1})`);
      })
      .on("mouseout", function () {
        setHoveredToken(null);
        d3.select(this)
          .transition()
          .duration(200)
          .attr("transform", `translate(0, 0)`);
      })
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

  const totalUsdValue = filteredTokens.reduce(
    (sum, token) => sum + token.usdValue,
    0
  );

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Token Distribution (Filtered)</h2>

      {/* Filters */}
      <div className="flex flex-col gap-4 mb-4">
        {/* Chain Select */}
        <div className="w-full max-w-sm">
          <label className="block text-sm font-medium text-white mb-2">
            Select Chain
          </label>
          <select
            value={selectedChain}
            onChange={(e) => setSelectedChain(e.target.value)}
            disabled={loading}
            className="block w-full px-2 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-200 bg-white text-gray-700"
          >
            <option value="celo">Celo</option>
            <option value="ethereum">Ethereum</option>
            <option value="both">Celo & ETH</option>
          </select>
        </div>

        {/* Token Checkboxes */}
        <TokenSelector
          tokens={uniqueTokens}
          selectedTokens={selectedTokens}
          toggleToken={toggleToken}
          loading={loading}
        />
      </div>

      {/* Pie Chart */}
      <div className="flex justify-center h-[300px] items-center">
        {loading ? (
          <div className="w-[300px] h-[300px] rounded-full bg-gray-200 animate-pulse" />
        ) : (
          <svg ref={svgRef} />
        )}
      </div>

      {/* Token Grid */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl border bg-gray-100 animate-pulse space-y-2"
              >
                <div className="h-5 bg-gray-300 rounded w-1/2" />
                <div className="h-4 bg-gray-300 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/3" />
              </div>
            ))
          : filteredTokens.map((token) => (
              <div
                key={token.token + token.chain}
                className={`p-4 rounded-2xl shadow-md border transition-all ${
                  hoveredToken === token.token
                    ? "border-amber-500 bg-amber-50 shadow-lg scale-[1.02]"
                    : "border-gray-200 bg-white"
                }`}
              >
                <div className="mt-1 text-lg font-semibold text-gray-800">
                  {token.token}
                </div>
                <div className="mt-1 text-gray-700">
                  ${formatReadable(token.usdValue)} USD
                </div>
                <div className="text-sm text-gray-500">
                  {((token.usdValue / totalUsdValue) * 100).toFixed(2)}%
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}
