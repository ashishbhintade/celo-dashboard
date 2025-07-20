interface TokenSelectorProps {
  tokens: string[];
  selectedTokens: string[];
  toggleToken: (token: string) => void;
  loading?: boolean;
}

export default function TokenSelector({
  tokens,
  selectedTokens,
  toggleToken,
  loading = false,
}: TokenSelectorProps) {
  const handleDeselectAll = () => {
    selectedTokens.forEach((token) => toggleToken(token));
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-white">Select Tokens</label>
        <button
          onClick={handleDeselectAll}
          disabled={loading || selectedTokens.length === 0}
          className={`text-xs border rounded px-2 py-1 transition-colors mr-1 cursor-pointer
            ${
              loading || selectedTokens.length === 0
                ? "bg-white text-gray-400 border-gray-300 cursor-not-allowed"
                : "bg-white text-red-500 border-red-300 hover:bg-gray-100"
            }`}
        >
          Deselect All Tokens
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto border rounded-lg p-3 bg-white shadow-sm">
        {loading
          ? Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className="h-5 my-1 bg-gray-200 animate-pulse rounded w-3/4"
              />
            ))
          : tokens.map((token) => (
              <label
                key={token}
                className="flex items-center gap-2 text-sm text-gray-800 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
              >
                <input
                  type="checkbox"
                  value={token}
                  checked={selectedTokens.includes(token)}
                  onChange={() => toggleToken(token)}
                  className="accent-blue-600"
                />
                <span className="capitalize">{token}</span>
              </label>
            ))}
      </div>
    </div>
  );
}
