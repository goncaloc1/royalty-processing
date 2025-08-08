import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ProgressBar } from "../progress-bar";

describe("ProgressBar", () => {
  it("renders null progress with dash", () => {
    render(<ProgressBar progress={null} />);

    const dashElement = screen.getByText("-");
    expect(dashElement).toBeInTheDocument();
  });

  it("renders progress bar with percentage by default", () => {
    render(<ProgressBar progress={0.75} />);

    // Check that the progress bar container exists by test id
    const progressContainer = screen.getByTestId("progress-bar-container");
    expect(progressContainer).toBeInTheDocument();

    // Check that percentage is displayed
    const percentage = screen.getByText("75%");
    expect(percentage).toBeInTheDocument();
  });

  it("renders progress bar without percentage when showPercentage is false", () => {
    render(<ProgressBar progress={0.5} showPercentage={false} />);

    // Check that the progress bar exists
    const progressContainer = screen.getByTestId("progress-bar-container");
    expect(progressContainer).toBeInTheDocument();

    // Check that percentage is not displayed
    expect(screen.queryByText("50%")).not.toBeInTheDocument();
  });

  it("renders 0% progress correctly", () => {
    render(<ProgressBar progress={0} />);

    const percentage = screen.getByText("0%");
    expect(percentage).toBeInTheDocument();
  });

  it("renders 100% progress correctly", () => {
    render(<ProgressBar progress={1} />);

    const percentage = screen.getByText("100%");
    expect(percentage).toBeInTheDocument();
  });

  it("rounds progress percentage correctly", () => {
    render(<ProgressBar progress={0.756} />);

    const percentage = screen.getByText("76%");
    expect(percentage).toBeInTheDocument();
  });

  it("sets correct width style for progress bar", () => {
    render(<ProgressBar progress={0.42} />);

    const progressFill = screen.getByTestId("progress-bar-fill");
    expect(progressFill).toHaveStyle({ width: "42%" });
  });
});
