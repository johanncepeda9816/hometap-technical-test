import { BACKEND_API_URL, PROPERTIES_ENDPOINT } from "../constants";

export const fetchPropertyDetails = async (
  address: string,
  backendApiUrl?: string
) => {
  const url = `${
    backendApiUrl ?? BACKEND_API_URL
  }/${PROPERTIES_ENDPOINT}?address=${encodeURIComponent(address)}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching property details:", error);
    throw error;
  }
};
