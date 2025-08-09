import { SongEntry } from "../types/songs";
import { InvoiceEntry } from "../types/invoices";

// Mock data
export const mockSongData: SongEntry[] = [
  {
    id: 1,
    song: "Test Song 1",
    author: "John Doe",
    progress: 0.75,
    lastClickDate: "2024-01-15",
    lastClickProgress: 0.5,
  },
  {
    id: 2,
    song: "Another Test Song",
    author: "Jane Smith",
    progress: 0.9,
    lastClickDate: null,
    lastClickProgress: null,
  },
];

export const mockInvoiceData: InvoiceEntry[] = [
  {
    id: 1,
    date: "2024-01-15",
    author: "John Doe",
    songName: "Test Song 1",
    progress: 0.75,
  },
  {
    id: 2,
    date: "2024-01-16",
    author: "Jane Smith",
    songName: "Another Test Song",
    progress: 0.9,
  },
];

// Global mocks setup
export const setupGlobalMocks = () => {
  // Mock fetch globally
  global.fetch = jest.fn();

  // Mock console methods to avoid noise in tests
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});

  // Mock alert
  global.alert = jest.fn();
};

// Date mocking utility
export const mockDate = (dateString: string) => {
  const spy = jest
    .spyOn(Date.prototype, "toISOString")
    .mockReturnValue(`${dateString}T10:30:00.000Z`);

  return () => {
    spy.mockRestore();
  };
};
