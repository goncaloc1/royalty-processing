import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useInvoices } from "../use-invoices";
import React from "react";
import { mockInvoiceData, setupGlobalMocks } from "../../__tests__/test-utils";

// Setup global mocks
setupGlobalMocks();

let queryClient: QueryClient;

const createWrapper = () => {
  queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // disable retries for testing
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const renderUseInvoicesHook = () =>
  renderHook(() => useInvoices(), {
    wrapper: createWrapper(),
  });

describe("useInvoices", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("fetches invoices successfully", async () => {
    const mockResponse = {
      data: mockInvoiceData,
    };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const { result } = renderUseInvoicesHook();

    // Initially data should be undefined
    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toBeNull();

    // Wait for the query to resolve
    await waitFor(() => {
      expect(result.current.data).toEqual(mockInvoiceData);
    });

    expect(result.current.error).toBeNull();
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith("/api/invoices");
  });

  it("handles fetch errors", async () => {
    const mockError = new Error("Network error");
    (fetch as jest.Mock).mockRejectedValueOnce(mockError);

    const { result } = renderUseInvoicesHook();

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
    });

    expect(result.current.data).toBeUndefined();
    expect(result.current.error).toEqual(mockError);
  });

  it("handles HTTP error responses", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
    });

    const { result } = renderUseInvoicesHook();

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
    });

    expect(result.current.data).toBeUndefined();
  });

  it("handles malformed JSON response", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => {
        throw new Error("Invalid JSON");
      },
    });

    const { result } = renderUseInvoicesHook();

    await waitFor(() => {
      expect(result.current.error).toBeTruthy();
    });

    expect(result.current.data).toBeUndefined();
  });

  it("uses correct TanStack query key", async () => {
    const tanstackQueryKey = ["invoices"];
    const mockResponse = { data: [] };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    renderUseInvoicesHook();

    await waitFor(() => {
      const queryData = queryClient.getQueryData(tanstackQueryKey);
      expect(queryData).toEqual(mockResponse);
    });
  });

  it("returns readonly object structure", async () => {
    const mockResponse = { data: mockInvoiceData };

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const { result } = renderUseInvoicesHook();

    await waitFor(() => {
      expect(result.current.data).toEqual(mockInvoiceData);
    });

    // Verify the return type structure
    expect(result.current).toHaveProperty("data");
    expect(result.current).toHaveProperty("error");
  });
});
