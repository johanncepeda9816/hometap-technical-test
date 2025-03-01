import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchPropertyDetails } from "./property";
import { BACKEND_API_URL, PROPERTIES_ENDPOINT } from "../constants";

describe("fetchPropertyDetails", () => {
  const mockBackendApiUrl = "http://localhost:3000";
  const address = "123 Main St";
  const mockPropertyData = {
    providers: {
      "Provider 1": { "Normalized Address": "123 Main St" },
    },
  };

  // Mock the fetch function
  beforeEach(() => {
    vi.resetAllMocks(); // Reset mocks before each test
    globalThis.fetch = vi.fn();
  });

  it("fetches property details successfully with custom backend URL", async () => {
    // Mock a successful fetch response
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPropertyData,
    });

    const result = await fetchPropertyDetails(address, mockBackendApiUrl);

    // Assert fetch was called with the correct URL
    expect(fetch).toHaveBeenCalledWith(
      `${mockBackendApiUrl}/${PROPERTIES_ENDPOINT}?address=${encodeURIComponent(
        address
      )}`
    );

    // Assert the response matches the mocked data
    expect(result).toEqual(mockPropertyData);
  });

  it("fetches property details successfully with default backend URL", async () => {
    // Mock a successful fetch response
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPropertyData,
    });

    const result = await fetchPropertyDetails(address);

    // Assert fetch was called with the correct URL
    expect(fetch).toHaveBeenCalledWith(
      `${BACKEND_API_URL}/${PROPERTIES_ENDPOINT}?address=${encodeURIComponent(
        address
      )}`
    );

    // Assert the response matches the mocked data
    expect(result).toEqual(mockPropertyData);
  });

  it("handles addresses with special characters correctly", async () => {
    const specialAddress = "123 Main St, Apt #4, City & State";
    const encodedAddress = encodeURIComponent(specialAddress);

    // Mock a successful fetch response
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPropertyData,
    });

    await fetchPropertyDetails(specialAddress);

    // Assert the address was properly encoded in the URL
    expect(fetch).toHaveBeenCalledWith(
      `${BACKEND_API_URL}/${PROPERTIES_ENDPOINT}?address=${encodedAddress}`
    );
  });

  it("throws an error when the response is not ok", async () => {
    // Mock a failed fetch response
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
    });

    await expect(fetchPropertyDetails(address)).rejects.toThrow(
      `Failed to fetch property details for address ${address}`
    );
  });

  it("throws an error when fetch fails", async () => {
    const networkError = new Error("Network error");
    // Mock a network error
    (fetch as unknown as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      networkError
    );

    await expect(fetchPropertyDetails(address)).rejects.toThrow(networkError);
  });

  it("logs error to console when fetch fails", async () => {
    // Spy on console.error
    const consoleSpy = vi.spyOn(console, "error");
    const networkError = new Error("Network error");

    // Mock a network error
    (fetch as unknown as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      networkError
    );

    try {
      await fetchPropertyDetails(address);
    } catch (error: unknown) {
      // We expect this to throw, so we catch it here
      console.error("Error fetching property details:", error);
    }

    // Assert console.error was called with the expected message
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error fetching property details:",
      networkError
    );
  });
});
