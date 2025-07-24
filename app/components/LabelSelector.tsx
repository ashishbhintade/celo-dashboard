"use client";

type LabelSelectorProps = {
  labels: string[];
  selectedLabels: string[];
  toggleLabel: (label: string) => void;
  loading: boolean;
};

export default function LabelSelector({
  labels,
  selectedLabels,
  toggleLabel,
  loading,
}: LabelSelectorProps) {
  return (
    <div className="w-full max-w-sm">
      <label className="block text-sm font-medium text-white mb-2">
        Select Labels
      </label>
      <div className="grid grid-rows gap-2 bg-white p-2 rounded">
        {loading
          ? Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="h-4 bg-gray-200 animate-pulse rounded w-3/4"
              />
            ))
          : labels.map((label) => (
              <label
                key={label}
                className="flex items-center space-x-2 text-gray-700 cursor-pointer hover:bg-gray-100 py-1 px-2"
              >
                <input
                  type="checkbox"
                  disabled={loading}
                  checked={selectedLabels.includes(label)}
                  onChange={() => toggleLabel(label)}
                  className="rounded border-gray-300 text-amber-500 focus:ring-amber-200"
                />
                <span className="text-sm">{label}</span>
              </label>
            ))}
      </div>
    </div>
  );
}
