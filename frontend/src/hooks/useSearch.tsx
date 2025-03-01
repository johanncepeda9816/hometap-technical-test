import { useEffect, useState } from "react";
import ProviderResponse from "../types/providers";
import { fetchPropertyDetails } from "../services/property";
import { BACKEND_API_URL } from "../constants";
import { usePrevious } from "@uidotdev/usehooks";
import { toast } from "react-toastify";

export const useSearch = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [apiResponse, setApiResponse] = useState<ProviderResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const previousText = usePrevious(searchTerm);

  useEffect(() => {
    if (searchTerm !== previousText) {
      setApiResponse(null);
    }
  }, [searchTerm, previousText]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      toast.warning("Please enter a search term");
      return;
    }

    try {
      setLoading(true);
      const data = await fetchPropertyDetails(searchTerm, BACKEND_API_URL);

      if (data) {
        setApiResponse(data);
        toast.success("Data retrieved successfully");
      } else {
        setApiResponse(null);
        toast.info("No results found for the search");
      }
    } catch (error: unknown) {
      console.error("Error fetching property details:", error);
      setApiResponse(null);

      if (error instanceof Error) {
        toast.error(`Error searching: ${error.message}`);
      } else {
        toast.error("An error occurred while fetching property data");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    searchTerm,
    apiResponse,
    loading,
    setSearchTerm,
    handleSearch,
  };
};
