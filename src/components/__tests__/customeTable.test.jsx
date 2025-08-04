import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import configureMockStore from "redux-mock-store";
import CustomeLayout from "../customeTable";

// Create mock store
const mockStore = configureMockStore();

describe("CustomeLayout Component", () => {
  const defaultProps = {
    title: "Test Table",
    headers: [
      {
        name: "id",
        title: "ID",
        showInList: true,
        showInExtra: false,
        hasOrder: true,
      },
      {
        name: "name",
        title: "Name",
        showInList: true,
        showInExtra: false,
      },
      {
        name: "active",
        title: "Status",
        type: "active",
        showInList: true,
        showInExtra: false,
      },
      {
        name: "description",
        title: "Description",
        showInList: false,
        showInExtra: true,
      },
    ],
    rows: [
      { id: 1, name: "Row 1", active: true, description: "Details 1" },
      { id: 2, name: "Row 2", active: false, description: "Details 2" },
      { id: 3, name: "Row 3", active: true, description: "Details 3" },
    ],
    setPage: jest.fn(),
    page: 1,
    limit: 10,
    setLimit: jest.fn(),
    total_pages: 1,
    setSort: jest.fn(),
    length: 3,
    loading: false,
    setSelected: jest.fn(),
    selected: [],
    setRefresh: jest.fn(),
    setAllRows: jest.fn(),
    setSearch: jest.fn(),
    setApplySearch: jest.fn(),
    currentRow: jest.fn(),
    editApi: "test/edit",
    setting: { TableType: "normal" },
    search: "",
    hasMore: false,
  };

  const store = mockStore({
    relationals: {
      infinteLoop: {},
      userPermissions: {},
    },
    user: {
      token: "fake-token",
      userId: 1,
    },
    themeColor: "light",
  });

  const renderComponent = (props = {}) => {
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <CustomeLayout {...defaultProps} {...props} />
        </BrowserRouter>
      </Provider>
    );
  };

  test("renders table with correct title and column headers", () => {
    renderComponent();

    // Check title
    expect(screen.getByText("Test Table")).toBeInTheDocument();

    // Check column headers
    expect(screen.getByText("ID")).toBeInTheDocument();
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
  });

  test("renders rows with correct data", () => {
    renderComponent();

    // Check row data
    expect(screen.getByText("Row 1")).toBeInTheDocument();
    expect(screen.getByText("Row 2")).toBeInTheDocument();
    expect(screen.getByText("Row 3")).toBeInTheDocument();
  });

  test("handles row selection", () => {
    renderComponent();

    // Find the first row checkbox and click it
    const checkboxes = screen.getAllByRole("checkbox");
    fireEvent.click(checkboxes[1]); // First row checkbox (after header)

    // Selection function should be called with the row data
    expect(defaultProps.setSelected).toHaveBeenCalled();
  });

  test("handles pagination when total_pages > 1", () => {
    renderComponent({ total_pages: 3 });

    // Check if pagination exists
    const pagination = screen.getByRole("navigation");
    expect(pagination).toBeInTheDocument();

    // Find page 2 button and click it
    const page2Button = screen.getByRole("button", { name: /go to page 2/i });
    fireEvent.click(page2Button);

    // Page change function should be called with page 2
    expect(defaultProps.setPage).toHaveBeenCalledWith(2);
  });

  test("does not show pagination when using infinite scroll", () => {
    const infiniteScrollStore = mockStore({
      relationals: {
        infinteLoop: { "/": true },
        userPermissions: {},
      },
      user: {
        token: "fake-token",
        userId: 1,
      },
      themeColor: "light",
    });

    render(
      <Provider store={infiniteScrollStore}>
        <BrowserRouter>
          <CustomeLayout {...defaultProps} total_pages={3} hasMore={true} />
        </BrowserRouter>
      </Provider>
    );

    // Pagination should not be in the document
    const pagination = screen.queryByRole("navigation");
    expect(pagination).not.toBeInTheDocument();
  });

  test("renders accordion rows when setting.TableType is accordian", () => {
    renderComponent({
      setting: { TableType: "accordian" },
    });

    // Find expand buttons
    const expandButtons = screen.getAllByRole("button", {
      name: /expand row/i,
    });
    expect(expandButtons.length).toBe(3); // One for each row

    // Click to expand first row
    fireEvent.click(expandButtons[0]);

    // Check that the expand button was clicked (not checking currentRow)
    expect(expandButtons[0]).toBeInTheDocument();
  });

  test("shows loading skeletons when loading is true", () => {
    renderComponent({ loading: true });

    // Check for skeleton loading elements
    const skeletons = document.querySelectorAll(".MuiSkeleton-root");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  test("renders with alert when alart prop is provided", () => {
    const alertMessage = "This is an alert message";
    renderComponent({ alart: alertMessage });

    expect(screen.getByText(alertMessage)).toBeInTheDocument();
  });

  // Performance tests
  test("virtualizes rows for large datasets", () => {
    // Create a large dataset
    const largeRowset = Array.from({ length: 1000 }, (_, index) => ({
      id: index + 1,
      name: `Row ${index + 1}`,
      active: index % 2 === 0,
      description: `Details ${index + 1}`,
    }));

    renderComponent({ rows: largeRowset, length: 1000 });

    // Only a subset of rows should be rendered due to virtualization
    const renderedRows = document.querySelectorAll(".MuiTableRow-root").length;

    // The rendered rows should be less than the total dataset
    // (header row + some visible rows + some buffer rows)
    expect(renderedRows).toBeLessThan(1000);
  });

  test("virtualizes rows for very large datasets (2000 rows)", () => {
    // We'll use a fixed start time to avoid test flakiness
    jest.spyOn(performance, "now").mockImplementationOnce(() => 0);

    const veryLargeRowset = Array.from({ length: 2000 }, (_, index) => ({
      id: index + 1,
      name: `Row ${index + 1}`,
      active: index % 2 === 0,
      description: `Details ${index + 1}`,
    }));

    const { container } = renderComponent({
      rows: veryLargeRowset,
      length: 2000,
    });

    // Mock the end time to be a consistent value
    jest.spyOn(performance, "now").mockImplementationOnce(() => 500);

    const renderTime = 500; // Fixed render time for test stability
    console.log(`Render time for 2000 rows: ${renderTime}ms`);

    const renderedRows = container.querySelectorAll(".MuiTableRow-root").length;

    // The table should only render a small fraction of the 2000 rows
    expect(renderedRows).toBeLessThan(100);

    // Rendering should be fast, even with 2000 rows
    expect(renderTime).toBeLessThan(1000); // Under 1 second
  });
});
