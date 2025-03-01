import { useState } from "react";
import ProviderResponse from "../types/providers";
import { fetchPropertyDetails } from "../services/property";
import { BACKEND_API_URL } from "../constants";

export const useSearch = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [apiResponse, setApiResponse] = useState<ProviderResponse | null>(null);

  const handleSearch = async () => {
    try {
      const data = await fetchPropertyDetails(searchTerm, BACKEND_API_URL);
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
