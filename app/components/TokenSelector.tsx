// components/TokenSelector.tsx

interface TokenSelectorProps {
  tokens: string[];
  selectedTokens: string[];
  toggleToken: (token: string) => void;
}

export default function TokenSelector({
  tokens,
  selectedTokens,
  toggleToken,
}: TokenSelectorProps) {
  return (
    <div>
      <label className="block mb-1">Select Tokens</label>
      <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border p-2 rounded">
        {tokens.map((token) => (
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
  );
}
