import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Invoices } from "../invoices";
import { mockInvoiceData } from "../../__tests__/test-utils";

describe("Invoices", () => {
  it("renders the header row with correct columns", () => {
    render(<Invoices data={[]} />);

    expect(screen.getByText("Id")).toBeInTheDocument();
    expect(screen.getByText("Date")).toBeInTheDocument();
    expect(screen.getByText("Author")).toBeInTheDocument();
    expect(screen.getByText("Song Name")).toBeInTheDocument();
    expect(screen.getByText("Progress")).toBeInTheDocument();
  });

  it("renders empty state when no data provided", () => {
    render(<Invoices data={[]} />);

    // Should only have header, no data rows
    const idTexts = screen.getAllByText("Id");
    expect(idTexts).toHaveLength(1); // Only in header
  });

  it("renders invoice data correctly", () => {
    render(<Invoices data={mockInvoiceData} />);

    // Check first invoice
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2024-01-15")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Test Song 1")).toBeInTheDocument();

    // Check second invoice
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("2024-01-16")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("Another Test Song")).toBeInTheDocument();
  });

  it("renders progress bars for each invoice", () => {
    render(<Invoices data={mockInvoiceData} />);

    expect(screen.queryByText("75%")).toBeInTheDocument();
    expect(screen.queryByText("90%")).toBeInTheDocument();
  });
});
