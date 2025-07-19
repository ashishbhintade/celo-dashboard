export type TokenBalance = {
  chain: string;
  walletAddress: string;
  token: string;
  balance: number;
  usdPrice: number;
  usdValue: number;
};

export type AggregatedToken = {
  token: string;
  balance: number;
  usdValue: number;
  usdPrice: number;
  chain: string; // celo, ethereum, both
};

function normalizeTokenName(token: string): string {
  const name = token.trim().toUpperCase();
  return name === "USD₮" ? "USDT" : name;
}

export function aggregateTokens(data: TokenBalance[]): AggregatedToken[] {
  const perChainMap = new Map<string, AggregatedToken>();
  const combinedMap = new Map<string, AggregatedToken>();

  for (const item of data) {
    const token = normalizeTokenName(item.token);
    const chainKey = `${token}-${item.chain}`;
    const combinedKey = `${token}-both`;

    // Per chain
    if (!perChainMap.has(chainKey)) {
      perChainMap.set(chainKey, {
        token,
        chain: item.chain,
        balance: item.balance,
        usdValue: item.usdValue,
        usdPrice: item.usdPrice,
      });
    } else {
      const existing = perChainMap.get(chainKey)!;
      existing.balance += item.balance;
      existing.usdValue += item.usdValue;
    }

    // Combined
    if (!combinedMap.has(combinedKey)) {
      combinedMap.set(combinedKey, {
        token,
        chain: "both",
        balance: item.balance,
        usdValue: item.usdValue,
        usdPrice: item.usdPrice,
      });
    } else {
      const existing = combinedMap.get(combinedKey)!;
      existing.balance += item.balance;
      existing.usdValue += item.usdValue;
    }
  }

  return [...perChainMap.values(), ...combinedMap.values()];
}
