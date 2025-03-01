import { useEffect, useState } from "react";
import ProviderResponse from "../types/providers";
import { fetchPropertyDetails } from "../services/property";
import { BACKEND_API_URL } from "../constants";
import { usePrevious } from "@uidotdev/usehooks";

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
    try {
      setLoading(true);
      const data = await fetchPropertyDetails(searchTerm, BACKEND_API_URL);
      setApiResponse(data);
    } catch (error: unknown) {
      console.error("Error fetching property details:", error);
      setApiResponse(null);
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
