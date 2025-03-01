import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { toast } from "react-toastify";
import { createMockProviderResponse } from "../test-helpers";
import { useSearch } from "../../hooks/useSearch";
import { BACKEND_API_URL } from "../../constants";

vi.mock("../../services/property", () => ({
  fetchPropertyDetails: vi.fn(),
}));

import { fetchPropertyDetails } from "../../services/property";

vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  },
}));

describe("useSearch", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with default values", () => {
    const { result } = renderHook(() => useSearch());

    expect(result.current.searchTerm).toBe("");
    expect(result.current.apiResponse).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it("should update searchTerm when setSearchTerm is called", () => {
    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.setSearchTerm("123 Main St");
    });

    expect(result.current.searchTerm).toBe("123 Main St");
  });

  it("should show warning toast when handleSearch is called with empty search term", async () => {
    const { result } = renderHook(() => useSearch());

    await act(async () => {
      result.current.handleSearch();
    });

    expect(toast.warning).toHaveBeenCalledWith("Please enter a search term");
    expect(fetchPropertyDetails).not.toHaveBeenCalled();
  });

  it("should fetch property details and set apiResponse on successful search", async () => {
    const mockPropertyData = createMockProviderResponse([
      {
        provider: "Provider 1",
        cached: true,
        propertyType: "Single Family",
        yearBuilt: 1995,
        squareFootage: 2000,
        lotSizeAcres: 0.5,
        bedrooms: 3,
        bathrooms: 2,
        roomCount: 6,
        septicSystem: false,
        salePrice: 500000,
        error: "",
      },
    ]);

    vi.mocked(fetchPropertyDetails).mockClear();
    vi.mocked(fetchPropertyDetails).mockResolvedValueOnce(mockPropertyData);

    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.setSearchTerm("123 Main St");
    });

    await act(async () => {
      await result.current.handleSearch();
    });

    expect(fetchPropertyDetails).toHaveBeenCalledWith(
      "123 Main St",
      BACKEND_API_URL
    );
    expect(result.current.apiResponse).toEqual(mockPropertyData);
    expect(toast.success).toHaveBeenCalledWith("Data retrieved successfully");
    expect(result.current.loading).toBe(false);
  });

  it("should handle null response from API", async () => {
    vi.mocked(fetchPropertyDetails).mockClear();
    vi.mocked(fetchPropertyDetails).mockResolvedValueOnce(null);

    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.setSearchTerm("123 Main St");
    });

    await act(async () => {
      await result.current.handleSearch();
    });

    expect(fetchPropertyDetails).toHaveBeenCalledWith(
      "123 Main St",
      BACKEND_API_URL
    );
    expect(result.current.apiResponse).toBeNull();
    expect(toast.info).toHaveBeenCalledWith("No results found for the search");
    expect(result.current.loading).toBe(false);
  });

  it("should handle API error with Error instance", async () => {
    const errorMessage = "Network error";

    vi.mocked(fetchPropertyDetails).mockClear();
    vi.mocked(fetchPropertyDetails).mockRejectedValueOnce(
      new Error(errorMessage)
    );

    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.setSearchTerm("123 Main St");
    });

    await act(async () => {
      await result.current.handleSearch();
    });

    expect(fetchPropertyDetails).toHaveBeenCalledWith(
      "123 Main St",
      BACKEND_API_URL
    );
    expect(result.current.apiResponse).toBeNull();
    expect(toast.error).toHaveBeenCalledWith(
      `Error searching: ${errorMessage}`
    );
    expect(result.current.loading).toBe(false);
  });

  it("should handle API error with unknown error format", async () => {
    vi.mocked(fetchPropertyDetails).mockClear();
    vi.mocked(fetchPropertyDetails).mockRejectedValueOnce("Unknown error");

    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.setSearchTerm("123 Main St");
    });

    await act(async () => {
      await result.current.handleSearch();
    });

    expect(fetchPropertyDetails).toHaveBeenCalledWith(
      "123 Main St",
      BACKEND_API_URL
    );
    expect(result.current.apiResponse).toBeNull();
    expect(toast.error).toHaveBeenCalledWith(
      "An error occurred while fetching property data"
    );
    expect(result.current.loading).toBe(false);
  });

  it("should reset apiResponse when searchTerm changes", async () => {
    const mockPropertyData = createMockProviderResponse([
      {
        provider: "Provider 1",
        cached: true,
        propertyType: "Single Family",
        yearBuilt: 1995,
        squareFootage: 2000,
        lotSizeAcres: 0.5,
        bedrooms: 3,
        bathrooms: 2,
        roomCount: 6,
        septicSystem: false,
        salePrice: 500000,
        error: "",
      },
    ]);

    vi.mocked(fetchPropertyDetails).mockClear();
    vi.mocked(fetchPropertyDetails).mockResolvedValueOnce(mockPropertyData);

    const { result, rerender } = renderHook(() => useSearch());

    act(() => {
      result.current.setSearchTerm("123 Main St");
    });

    await act(async () => {
      await result.current.handleSearch();
    });

    expect(result.current.apiResponse).not.toBeNull();

    act(() => {
      result.current.setSearchTerm("New Address");
    });

    rerender();

    expect(result.current.apiResponse).toBeNull();
  });
});
