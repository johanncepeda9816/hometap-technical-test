import { LoadingComponent } from "../../../components/loading";
import { ResultsTable } from "../../../components/results-table";
import { useSearch } from "../../../hooks/useSearch";

export const SearchPropertiesScreen = () => {
  const { searchTerm, apiResponse, loading, setSearchTerm, handleSearch } =
    useSearch();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        Hometap Property Detail Search
      </h1>
      <div className="flex items-center space-x-4 mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Enter full address, including street, city, state, and zip"
          className="p-3 border border-gray-300 rounded-md w-[600px]"
          disabled={loading}
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 cursor-pointer"
          disabled={loading}
        >
          Search
        </button>
      </div>
      {loading && <LoadingComponent />}

      {apiResponse && (
        <ResultsTable propertyData={apiResponse} address={searchTerm} />
      )}
    </div>
  );
};
