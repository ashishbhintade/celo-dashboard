export const runtime = "nodejs";

import { NextResponse } from "next/server";

const input = [
  {
    chain: "celo",
    walletAddress: "0x9380fA34Fd9e4Fd14c06305fd7B6199089eD4eb9",
    assets: [
      {
        name: "celo",
        tokenAddress: "0x471EcE3750Da237f93B8E339c536989b8978a438",
      },
      {
        name: "usdc",
        tokenAddress: "0xcebA9300f2b948710d2653dD7B07f33A8B32118C",
      },
      {
        name: "axlusdc",
        tokenAddress: "0xEB466342C4d449BC9f53A865D5Cb90586f405215",
      },
      {
        name: "usdt",
        tokenAddress: "0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e",
      },
      {
        name: "axleuroc",
        tokenAddress: "0x061cc5a2C863E0C1Cb404006D559dB18A34C762d",
      },
    ],
  },
  {
    chain: "celo",
    walletAddress: "0x87647780180b8f55980c7d3ffefe08a9b29e9ae1",
    assets: [
      {
        name: "celo",
        tokenAddress: "0x471EcE3750Da237f93B8E339c536989b8978a438",
      },
      {
        name: "usdt",
        tokenAddress: "0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e",
      },
    ],
  },
  {
    chain: "celo",
    walletAddress: "0x87647780180b8f55980c7d3ffefe08a9b29e9ae1",
    assets: [
      {
        name: "celo",
        tokenAddress: "0x471EcE3750Da237f93B8E339c536989b8978a438",
      },
      {
        name: "usdglo",
        tokenAddress: "0x4F604735c1cF31399C6E711D5962b2B3E0225AD3",
      },
      {
        name: "usdc",
        tokenAddress: "0xcebA9300f2b948710d2653dD7B07f33A8B32118C",
      },
      {
        name: "steur",
        tokenAddress: "0x004626A008B1aCdC4c74ab51644093b155e59A23",
      },
    ],
  },
  {
    chain: "celo",
    walletAddress: "0x87647780180B8f55980C7D3fFeFe08a9B29e9aE1",
    assets: [
      {
        name: "celo",
        tokenAddress: "0x471EcE3750Da237f93B8E339c536989b8978a438",
      },
      {
        name: "usdt",
        tokenAddress: "0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e",
      },
    ],
  },
  {
    chain: "celo",
    walletAddress: "0xD3D2e5c5Af667DA817b2D752d86c8f40c22137E1",
    assets: [
      {
        name: "celo",
        tokenAddress: "0x471EcE3750Da237f93B8E339c536989b8978a438",
      },
      {
        name: "usdc",
        tokenAddress: "0xcebA9300f2b948710d2653dD7B07f33A8B32118C",
      },
      {
        name: "usdt",
        tokenAddress: "0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e",
      },
      {
        name: "axleuroc",
        tokenAddress: "0x061cc5a2C863E0C1Cb404006D559dB18A34C762d",
      },
      {
        name: "axlusdc",
        tokenAddress: "0xEB466342C4d449BC9f53A865D5Cb90586f405215",
      },
    ],
  },
  {
    chain: "celo",
    walletAddress: "0x9d65E69aC940dCB469fd7C46368C1e094250a400",
    assets: [
      {
        name: "celo",
        tokenAddress: "0x471EcE3750Da237f93B8E339c536989b8978a438",
      },
    ],
  },
  {
    chain: "ethereum",
    walletAddress: "0xd0697f70E79476195B742d5aFAb14BE50f98CC1E",
    assets: [
      {
        name: "wbtc",
        tokenAddress: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
      },
      {
        name: "steth",
        tokenAddress: "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84",
      },
      {
        name: "eurc",
        tokenAddress: "0x1aBaEA1f7C830bD89Acc67eC4af516284b1bC33c",
      },
      {
        name: "sDAI",
        tokenAddress: "0x83F20F44975D03b1b09E64809B757c47f942BEeA",
      },
    ],
  },
  {
    chain: "ethereum",
    walletAddress: "0xd0697f70E79476195B742d5aFAb14BE50f98CC1E",
    assets: [
      {
        name: "usdt",
        tokenAddress: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      },
      {
        name: "steth",
        tokenAddress: "0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84",
      },
    ],
  },
];
const ALCHEMY_URLS: Record<string, string> = {
  ethereum: `https://eth-mainnet.g.alchemy.com/v2/`,
  celo: `https://celo-mainnet.g.alchemy.com/v2/`,
};

export async function GET() {
  const apiKey = process.env.ALCHEMY_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { success: false, error: "Missing ALCHEMY_API_KEY" },
      { status: 500 }
    );
  }

  try {
    const results = await Promise.all(
      input.flatMap(async ({ chain, walletAddress, assets }) => {
        const baseUrl = `${ALCHEMY_URLS[chain]}${apiKey}`;
        return Promise.all(
          assets.map(async ({ name, tokenAddress }) => {
            try {
              // Fetch balance
              const balanceRes = await fetch(baseUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  jsonrpc: "2.0",
                  id: 1,
                  method: "alchemy_getTokenBalances",
                  params: [walletAddress, [tokenAddress]],
                }),
              });
              const balanceJson = await balanceRes.json();
              const rawBalance =
                balanceJson.result.tokenBalances[0]?.tokenBalance;

              // Fetch metadata
              const metadataRes = await fetch(baseUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  jsonrpc: "2.0",
                  id: 2,
                  method: "alchemy_getTokenMetadata",
                  params: [tokenAddress],
                }),
              });
              const metadataJson = await metadataRes.json();
              const { decimals, symbol } = metadataJson.result;

              const balance = rawBalance
                ? parseFloat(BigInt(rawBalance).toString()) / 10 ** decimals
                : 0;

              // Fetch USD price from DefiLlama
              const llamaChain = chain === "celo" ? "celo" : "ethereum";
              const llamaRes = await fetch(
                `https://coins.llama.fi/prices/current/${llamaChain}:${tokenAddress.toLowerCase()}`
              );
              const llamaJson = await llamaRes.json();
              const priceData =
                llamaJson.coins?.[
                  `${llamaChain}:${tokenAddress.toLowerCase()}`
                ];
              const usdPrice = priceData?.price || 0;
              const usdValue = balance * usdPrice;

              return {
                chain,
                walletAddress,
                token: symbol,
                balance,
                usdPrice,
                usdValue,
              };
            } catch (err: any) {
              return {
                chain,
                walletAddress,
                token: name,
                balance: 0,
                usdPrice: 0,
                usdValue: 0,
                error: err.message || "Failed to fetch data",
              };
            }
          })
        );
      })
    );

    return NextResponse.json({
      success: true,
      data: results.flat(),
    });
  } catch (err: any) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Unknown error" },
      { status: 500 }
    );
  }
}
