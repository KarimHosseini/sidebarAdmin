// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

// Import our setup file with mocks
import "./jest.setup";

// Mock functions used by components
window.performance.mark = jest.fn();
window.performance.measure = jest.fn();

// Mock IntersectionObserver which is not available in test environment
class MockIntersectionObserver {
  constructor(callback) {
    this.callback = callback;
    this.entries = [];
    this.observe = jest.fn();
    this.disconnect = jest.fn();
    this.unobserve = jest.fn();
  }
}

global.IntersectionObserver = MockIntersectionObserver;

// Mock the performance.now() method
const originalPerformanceNow = global.performance.now;
global.performance.now = jest.fn().mockImplementation(() => {
  return Date.now();
});

// Restore original implementation after tests
afterAll(() => {
  global.performance.now = originalPerformanceNow;
});

// Add mock for window.URL.createObjectURL
if (typeof window !== "undefined") {
  if (!window.URL.createObjectURL) {
    window.URL.createObjectURL = jest.fn(() => "mock-url");
  }

  // Mock HTMLCanvasElement.getContext if needed
  if (
    window.HTMLCanvasElement &&
    !window.HTMLCanvasElement.prototype.getContext
  ) {
    window.HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
      fillRect: jest.fn(),
      clearRect: jest.fn(),
      getImageData: jest.fn(() => ({ data: new Array(4) })),
      putImageData: jest.fn(),
      createImageData: jest.fn(() => []),
      setTransform: jest.fn(),
      drawImage: jest.fn(),
      save: jest.fn(),
      restore: jest.fn(),
      translate: jest.fn(),
      rotate: jest.fn(),
      scale: jest.fn(),
      arc: jest.fn(),
      fill: jest.fn(),
    }));
  }
}

// Suppress error logs during tests
const originalConsoleError = console.error;
console.error = jest.fn((...args) => {
  if (
    args[0] &&
    typeof args[0] === "string" &&
    (args[0].includes("Warning: ReactDOM.render") ||
      args[0].includes("act(...) is not supported in production") ||
      args[0].includes(
        "Not implemented: HTMLCanvasElement.prototype.getContext"
      ) ||
      args[0].includes("window.URL.createObjectURL"))
  ) {
    return;
  }
  originalConsoleError(...args);
});

// Restore original error after tests
afterAll(() => {
  console.error = originalConsoleError;
});
