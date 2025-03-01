import { useState } from "react";
import ProviderResponse from "../types/providers";
import { fetchPropertyDetails } from "../services/property";

export const useSearch = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [apiResponse, setApiResponse] = useState<ProviderResponse | null>(null);
  const backendApiUrl = import.meta.env.VITE_BACKEND_API_URL;

  const handleSearch = async () => {
    try {
      const data = await fetchPropertyDetails(backendApiUrl, searchTerm);
      setApiResponse(data);
    } catch (error: unknown) {
      setApiResponse({
        error: {
          message: (error as Error).message,
        },
      });
    }
  };

  return {
    searchTerm,
    apiResponse,
    setSearchTerm,
    handleSearch,
  };
};
