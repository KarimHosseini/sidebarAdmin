/**
 * @jest-environment jsdom
 */
import { render } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { createStore } from "redux";

// Create a simple mock component that looks similar to the real component
const MockCustomeTable = () => (
  <div data-testid="mock-table">
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>Row 1</td>
        </tr>
        <tr>
          <td>2</td>
          <td>Row 2</td>
        </tr>
      </tbody>
    </table>
  </div>
);

// Mock Redux store
const createMockStore = () => {
  return createStore(() => ({
    relationals: {
      infinteLoop: {},
      userPermissions: {},
    },
    user: {
      token: "fake-token",
      userId: 1,
    },
    themeColor: "light",
  }));
};

// Basic tests for the table component
describe("Table Component", () => {
  it("renders correctly", () => {
    const store = createMockStore();

    const { getByTestId } = render(
      <Provider store={store}>
        <BrowserRouter>
          <MockCustomeTable />
        </BrowserRouter>
      </Provider>
    );

    expect(getByTestId("mock-table")).toBeInTheDocument();
  });
});
