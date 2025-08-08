import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSongs } from "../use-songs";
import React from "react";
import {
  mockSongData,
  setupGlobalMocks,
  mockDate,
} from "../../__tests__/test-utils";

// Setup global mocks
setupGlobalMocks();

let queryClient: QueryClient;

// Helper to create a wrapper with QueryClient
const createWrapper = () => {
  queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const renderUseSongsHook = () => {
  return renderHook(() => useSongs(), {
    wrapper: createWrapper(),
  });
};

describe("useSongs", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe("Query functionality", () => {
    it("fetches songs successfully", async () => {
      const mockResponse = {
        data: mockSongData,
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const { result } = renderUseSongsHook();

      // Initially data should be undefined
      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toBeNull();
      expect(result.current.mutatingId).toBeNull();

      // Wait for the query to resolve
      await waitFor(() => {
        expect(result.current.data).toEqual(mockSongData);
      });

      expect(result.current.error).toBeNull();
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith("/api/songs");
    });

    it("handles fetch errors", async () => {
      const mockError = new Error("Network error");
      (fetch as jest.Mock).mockRejectedValueOnce(mockError);

      const { result } = renderUseSongsHook();

      await waitFor(() => {
        expect(result.current.error).toBeTruthy();
      });

      expect(result.current.data).toBeUndefined();
      expect(result.current.error).toEqual(mockError);
    });
  });

  describe("Mutation functionality", () => {
    it("issues invoice successfully", async () => {
      const songToInvoice = mockSongData[0];
      const mockQueryResponse = { data: mockSongData };
      const mockInvoiceResponse = { data: { id: 123 } };

      // Mock the songs query
      (fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockQueryResponse,
        })
        // Mock the invoice POST
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockInvoiceResponse,
        });

      const { result } = renderUseSongsHook();

      // Wait for initial data to load
      await waitFor(() => {
        expect(result.current.data).toEqual(mockSongData);
      });

      // Issue invoice
      await act(async () => {
        result.current.mutate(songToInvoice);
      });

      // Verify POST request was made
      expect(fetch).toHaveBeenCalledWith("/api/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: expect.stringContaining('"author":"John Doe"'),
      });
    });

    it("handles invoice creation failure", async () => {
      const songToInvoice = mockSongData[0];
      const mockQueryResponse = { data: mockSongData };

      // Mock successful query, failed mutation
      (fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockQueryResponse,
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
        });

      const { result } = renderUseSongsHook();

      await waitFor(() => {
        expect(result.current.data).toEqual(mockSongData);
      });

      await act(async () => {
        result.current.mutate(songToInvoice);
      });

      expect(global.alert).toHaveBeenCalledWith(
        "Failed to issue invoice. Please try again."
      );
    });

    it("updates mutatingId during mutation", async () => {
      const songToInvoice = mockSongData[0];
      const mockQueryResponse = { data: mockSongData };
      const mockInvoiceResponse = { data: { id: 123 } };

      (fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockQueryResponse,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockInvoiceResponse,
        });

      const { result } = renderUseSongsHook();

      await waitFor(() => {
        expect(result.current.data).toEqual(mockSongData);
      });

      expect(result.current.mutatingId).toBeNull();

      await act(async () => {
        result.current.mutate(songToInvoice);
      });

      // After mutation completes, mutatingId should be reset to null
      await waitFor(() => {
        expect(result.current.mutatingId).toBeNull();
      });
    });

    it("builds correct payload for invoice", async () => {
      const songToInvoice = mockSongData[0];
      const mockQueryResponse = { data: mockSongData };
      const mockInvoiceResponse = { data: { id: 123 } };

      // Mock Date to have predictable output
      const mockDateString = "2024-03-15";
      const restoreDate = mockDate(mockDateString);

      (fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockQueryResponse,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockInvoiceResponse,
        });

      const { result } = renderUseSongsHook();

      await waitFor(() => {
        expect(result.current.data).toEqual(mockSongData);
      });

      await act(async () => {
        result.current.mutate(songToInvoice);
      });

      const expectedPayload = {
        date: mockDateString,
        author: "John Doe",
        songName: "Test Song 1",
        progress: 0.75,
      };

      expect(fetch).toHaveBeenCalledWith("/api/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(expectedPayload),
      });

      restoreDate();
    });

    it("updates cache after successful mutation", async () => {
      const songToInvoice = mockSongData[0];
      const mockQueryResponse = { data: mockSongData };
      const mockInvoiceResponse = { data: { id: 123 } };

      (fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockQueryResponse,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockInvoiceResponse,
        });

      const { result } = renderUseSongsHook();

      await waitFor(() => {
        expect(result.current.data).toEqual(mockSongData);
      });

      // Verify initial state of the song before mutation
      const initialSong = result.current.data![0];
      expect(initialSong.lastClickProgress).toBe(0.5);

      await act(async () => {
        result.current.mutate(songToInvoice);
      });

      // Verify cache was updated with new lastClickDate and lastClickProgress
      await waitFor(() => {
        const updatedSong = result.current.data![0];
        expect(updatedSong.lastClickProgress).toBe(0.75); // songToInvoice.progress
      });

      // Verify other songs remain unchanged
      const secondSong = result.current.data![1];
      expect(secondSong.lastClickProgress).toBeNull();
    });

    it("sets and resets mutatingId during mutation lifecycle", async () => {
      const songToInvoice = mockSongData[0];
      const mockQueryResponse = { data: mockSongData };
      const mockInvoiceResponse = { data: { id: 123 } };

      // Create a delayed promise to catch the mutation in progress
      let resolveInvoiceRequest: (value: unknown) => void;
      const delayedInvoicePromise = new Promise((resolve) => {
        resolveInvoiceRequest = resolve;
      });

      (fetch as jest.Mock)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => mockQueryResponse,
        })
        .mockImplementationOnce(() => delayedInvoicePromise);

      const { result } = renderUseSongsHook();

      await waitFor(() => {
        expect(result.current.data).toEqual(mockSongData);
      });

      // Verify initial state
      expect(result.current.mutatingId).toBeNull();

      // Start mutation but don't await it yet
      act(() => {
        result.current.mutate(songToInvoice);
      });

      // Verify mutatingId is set during mutation
      await waitFor(() => {
        expect(result.current.mutatingId).toBe(songToInvoice.id);
      });

      // Complete the mutation
      resolveInvoiceRequest!({
        ok: true,
        json: async () => mockInvoiceResponse,
      });

      // After mutation completes, mutatingId should be reset to null
      await waitFor(() => {
        expect(result.current.mutatingId).toBeNull();
      });
    });
  });

  describe("Return object structure", () => {
    it("returns correct readonly object structure", async () => {
      const mockResponse = { data: mockSongData };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const { result } = renderUseSongsHook();

      await waitFor(() => {
        expect(result.current.data).toEqual(mockSongData);
      });

      // Verify the return type structure
      expect(Object.keys(result.current)).toEqual([
        "data",
        "error",
        "mutate",
        "mutatingId",
      ]);
    });
  });
});
