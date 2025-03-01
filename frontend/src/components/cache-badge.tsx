export const CacheBadge = ({ isCached }: { isCached: boolean }) => (
  <span
    className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${
      isCached ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"
    }`}
  >
    {isCached ? "Cached" : "Live"}
  </span>
);
