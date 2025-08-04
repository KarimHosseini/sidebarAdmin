// Mock problematic modules
jest.mock("mapbox-gl", () => require("./mocks/mapboxGLMock"));
jest.mock("jspdf", () => require("./mocks/jspdfMock"));
jest.mock("maplibre-gl", () => require("./mocks/mapboxGLMock"));

// Mock react-map-gl
jest.mock("react-map-gl", () => {
  const React = require("react");
  return {
    Map: function MockMap() {
      return React.createElement("div", { "data-testid": "mock-map" });
    },
    Marker: function MockMarker() {
      return React.createElement("div", { "data-testid": "mock-marker" });
    },
    Popup: function MockPopup() {
      return React.createElement("div", { "data-testid": "mock-popup" });
    },
    NavigationControl: function MockNavControl() {
      return React.createElement("div", { "data-testid": "mock-nav" });
    },
    // Add any other components that need to be mocked
    Source: function MockSource() {
      return null;
    },
    Layer: function MockLayer() {
      return null;
    },
  };
});
