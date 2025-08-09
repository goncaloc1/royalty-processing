import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Songs } from "../songs";
import { mockSongData } from "../../__tests__/test-utils";
import { SongEntry } from "../../types/songs";

// Mock the ProgressBar component since it's already tested separately
jest.mock("../progress-bar", () => ({
  ProgressBar: ({ progress }: { progress: number | null }) => (
    <div data-testid={`mocked-progress-bar-${progress}`}>
      Progress: {progress ? Math.round(progress * 100) : 0}%
    </div>
  ),
}));

describe("Songs", () => {
  const mockOnIssueInvoice = jest.fn();

  const mockData: SongEntry[] = [
    ...mockSongData,
    {
      id: 3,
      song: "Zero Progress Song",
      author: "Zero Author",
      progress: 0,
      lastClickDate: null,
      lastClickProgress: null,
    },
  ];

  beforeEach(() => {
    mockOnIssueInvoice.mockClear();
  });

  it("renders the header row with correct columns", () => {
    render(
      <Songs data={[]} onIssueInvoice={mockOnIssueInvoice} mutatingId={null} />
    );

    expect(screen.getByText("Id")).toBeInTheDocument();
    expect(screen.getByText("Song Name")).toBeInTheDocument();
    expect(screen.getByText("Author")).toBeInTheDocument();
    expect(screen.getByText("Progress")).toBeInTheDocument();
    expect(screen.getByText("Last Click Date")).toBeInTheDocument();
    expect(screen.getByText("Last Click Progress")).toBeInTheDocument();
  });

  it("renders empty state when no data provided", () => {
    render(
      <Songs data={[]} onIssueInvoice={mockOnIssueInvoice} mutatingId={null} />
    );

    // Should only have header, no data rows
    const idTexts = screen.getAllByText("Id");
    expect(idTexts).toHaveLength(1); // Only in header
  });

  it("renders song data correctly", () => {
    render(
      <Songs
        data={mockData}
        onIssueInvoice={mockOnIssueInvoice}
        mutatingId={null}
      />
    );

    // Check first song
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("Test Song 1")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("2024-01-15")).toBeInTheDocument();

    // Check second song
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("Another Test Song")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
  });

  it("renders progress bars for each song", () => {
    render(
      <Songs
        data={mockData}
        onIssueInvoice={mockOnIssueInvoice}
        mutatingId={null}
      />
    );

    expect(screen.getByTestId("mocked-progress-bar-0.75")).toBeInTheDocument();
    expect(screen.getByTestId("mocked-progress-bar-0.9")).toBeInTheDocument();
    expect(screen.getByTestId("mocked-progress-bar-0")).toBeInTheDocument();
  });

  it("renders dash for null last click date and progress", () => {
    render(
      <Songs
        data={mockData}
        onIssueInvoice={mockOnIssueInvoice}
        mutatingId={null}
      />
    );

    // Should have multiple dashes for songs without last click data
    const dashes = screen.getAllByText("-");
    expect(dashes.length).toBeGreaterThan(0);
  });

  it("renders last click progress as percentage when available", () => {
    render(
      <Songs
        data={mockData}
        onIssueInvoice={mockOnIssueInvoice}
        mutatingId={null}
      />
    );

    // First song has lastClickProgress of 0.5, should show as 50%
    expect(screen.getByText("50%")).toBeInTheDocument();
  });

  it("renders Issue Invoice buttons for all songs", () => {
    render(
      <Songs
        data={mockData}
        onIssueInvoice={mockOnIssueInvoice}
        mutatingId={null}
      />
    );

    const buttons = screen.getAllByText("Issue Invoice");
    expect(buttons).toHaveLength(3);
  });

  it("calls onIssueInvoice when button is clicked", () => {
    render(
      <Songs
        data={mockData}
        onIssueInvoice={mockOnIssueInvoice}
        mutatingId={null}
      />
    );

    const buttons = screen.getAllByText("Issue Invoice");
    fireEvent.click(buttons[0]);

    expect(mockOnIssueInvoice).toHaveBeenCalledTimes(1);
    expect(mockOnIssueInvoice).toHaveBeenCalledWith(mockData[0]);
  });

  it("disables button when progress is 0", () => {
    render(
      <Songs
        data={mockData}
        onIssueInvoice={mockOnIssueInvoice}
        mutatingId={null}
      />
    );

    const buttons = screen.getAllByText("Issue Invoice");
    // Third song has progress 0, so its button should be disabled
    expect(buttons[2]).toBeDisabled();
  });

  it("disables button when progress equals lastClickProgress", () => {
    const songWithSameProgress: SongEntry[] = [
      {
        id: 4,
        song: "Same Progress Song",
        author: "Test Author",
        progress: 0.8,
        lastClickDate: "2024-01-10",
        lastClickProgress: 0.8, // Same as current progress
      },
    ];

    render(
      <Songs
        data={songWithSameProgress}
        onIssueInvoice={mockOnIssueInvoice}
        mutatingId={null}
      />
    );

    const button = screen.getByText("Issue Invoice");
    expect(button).toBeDisabled();
  });

  it("disables button when invoice is being issued", () => {
    render(
      <Songs
        data={mockData}
        onIssueInvoice={mockOnIssueInvoice}
        mutatingId={1}
      />
    );

    const buttons = screen.getAllByText("Issue Invoice");
    // First song (id: 1) is mutating, so its button should be disabled
    expect(buttons[0]).toBeDisabled();
    // Other buttons should not be disabled (unless for other reasons)
    expect(buttons[1]).not.toBeDisabled();
  });

  it("enables button when conditions are met", () => {
    render(
      <Songs
        data={mockData}
        onIssueInvoice={mockOnIssueInvoice}
        mutatingId={null}
      />
    );

    const buttons = screen.getAllByText("Issue Invoice");
    // Second song should have enabled button (progress > 0, different from lastClickProgress, not mutating)
    expect(buttons[1]).not.toBeDisabled();
  });

  it("handles null progress correctly", () => {
    const songWithNullProgress: SongEntry[] = [
      {
        id: 5,
        song: "Null Progress Song",
        author: "Null Author",
        progress: null,
        lastClickDate: null,
        lastClickProgress: null,
      },
    ];

    render(
      <Songs
        data={songWithNullProgress}
        onIssueInvoice={mockOnIssueInvoice}
        mutatingId={null}
      />
    );

    expect(screen.getByText("Null Progress Song")).toBeInTheDocument();
    expect(screen.getByTestId("mocked-progress-bar-null")).toBeInTheDocument();
  });
});
