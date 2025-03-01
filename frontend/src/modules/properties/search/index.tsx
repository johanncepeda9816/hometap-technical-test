import { LoadingComponent } from "../../../components/loading";
import { ResultsTable } from "../../../components/results-table";
import { useSearch } from "../../../hooks/useSearch";

export const SearchPropertiesScreen = () => {
  const { searchTerm, apiResponse, loading, setSearchTerm, handleSearch } =
    useSearch();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-6 sm:text-3xl">
        Hometap Property Detail Search
      </h1>

      <div className="w-full max-w-3xl px-4">
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter full address, including street, city, state, and zip"
            className="p-3 border border-gray-300 rounded-md w-full"
            disabled={loading}
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 cursor-pointer w-full sm:w-auto whitespace-nowrap"
            disabled={loading}
          >
            Search
          </button>
        </div>
      </div>

      {loading && <LoadingComponent />}

      <div className="w-full max-w-12xl">
        {apiResponse && (
          <ResultsTable propertyData={apiResponse} address={searchTerm} />
        )}
      </div>
    </div>
  );
};
